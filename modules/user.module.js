/**
 * @Description 
 * This module file has all user modules
 * @author
 * R.M. Kavindu Nimesh
 * @END
 */

const query    = require('./../services/query'); // For excute sql quaries and get result
const response = require('../services/response');
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const luxon    = require('luxon');
const axios    = require('axios');

const inputControll = require('./../json/inputControll.json');

const internalServerError = require("../services/internalServerError.js"); // :)3v

require('dotenv').config( {path: './../.env/config.env'} );


/**
 * @Table_of_Content 
 * User Login           const login
 * User Logout          const logout
 * New user Add         const add
 * @END
 */

const login    = async ( data ) => {

    data.pass = await bcrypt.hash( data.pass, process.env.SALT );

    let result  = await query('SELECT user.id, user.role FROM user WHERE user.auth = ? && user.code = ?', [data.auth, data.pass]);

    if ( !result.status ) {
        await internalServerError(result.err); // :)3v
        return ( response.error("0500") ); // Internal server error
    }
    
    if ( result.data.length === 0 ) {
        return ( response.error("0002") ); // no result found
    }

    const accessToken = jwt.sign(
        { user: result.data[0].id, role: result.data[0].role, location: result.data[0].location_id },
        process.env.JWTACCESS,
        {
          expiresIn: parseInt(process.env.JWTAMAXAGE),
        }
    );



    return response.success(
        "0200",
        {
            accessToken : accessToken
        }
    );
    
}

const add      = async ( data ) => {

    /**
     * @detail
     * The "auth" must be a unique data
     */
    let result  = await query("SELECT id FROM user WHERE auth = ? LIMIT 1", [data.auth]);

    if ( !result.status ) {
        await internalServerError(result.err); // :)3v
        return ( response.error("0500") ); // system error
    }

    if ( result.data.length > 0 ) {
        return ( response.error("0054") ); // This auth already exist
    }

    /**
     * @detail
     * Input controll check userRole
     */
    if ( "user" in inputControll[`${data.authData.role}`] ) {
        if ( "add" in inputControll[`${data.authData.role}`].user ) {
            if ( inputControll[`${data.authData.role}`].user.add.role.includes(data.role) === false ) {
                return response.error( "0403" )
            }
        } else {
            return response.error( "0403" )
        }
    } else {
        return response.error( "0403" )
    }

    if ( data.web === undefined ) data.web = '';

    /**
     * @detail
     * Insert data to "user" table
     */

    data.pass = await bcrypt.hash( data.pass, process.env.SALT );
    const dateTime = luxon.DateTime.now().setZone("UTC").toFormat("y-MM-dd HH:mm:ss")

    result  = await query("INSERT INTO `user`(`id`, `code`, `auth`, `role`, `status`, `added_by`, `added_time`) VALUES (?,?,?,?,?,?,?)", [null, data.pass, data.auth, data.role, 1, data.authData.user, dateTime]);

    if ( !result.status ) {
        await internalServerError(result.err); // :)3v
        return ( response.error("0500") );
    }


    /**
     * @detail
     * Insert data to "user_details" table
     */

    let result1;
    if (data.role == 3) {
        result1  = await query( "INSERT INTO `user_company`(`user_id`,  `name`, `address`, `web`, `phone`, `last_update`) VALUES (?,?,?,?,?,?)", [result.data.insertId, data.name, data.address, data.web, data.phone, dateTime] );
    } else {
        result1  = await query( "INSERT INTO `user_detail`(`user_id`, `name`, `address`, `phone`, `last_update`) VALUES (?,?,?,?,?)", [result.data.insertId, data.name, data.address, data.phone, dateTime] );
    }

    if ( !result1.status ) {
        await internalServerError(result1.err); // :)3v
        await query( "DELETE FROM `user` WHERE `id`= ?", [result.data.insertId] ); // delete added user record
        return ( response.error("0500") );
    }

    return response.success(
        "0200"
    )

}

const logout   = ( req ) => {

    const token = req.headers.authorization.split(' ')[1];
    jwt.destroy(token);

}

const check = ( data ) => {
    return ( response.success('200', data.authData) );
}

const forget_password = async(data) => {

    
    try {
        const dateTime = luxon.DateTime.now().setZone("UTC").toFormat("y-MM-dd HH:mm:ss");
        // Remove Old Forget Password Requests
        await removeOld.forget_password( dateTime );
        
        /**
         * @Details 
         * Check if already requested
         */
        let result  = await query(`
        SELECT user.id
        FROM verification 
        INNER JOIN user ON user.id = verification.user_id 
        WHERE  user.auth = ? && verification.type = ? && user.status = 1 LIMIT 1`, [ data.email, 2 ]);

        
        if ( !result.status ) {
            await internalServerError(result.err); // :)3v
            return ( response.error("0500") ); // system error
        }

        if ( result.data.length > 0 ) {
            return ( response.error("0024") ); // already requested
        }

        
        /**
         * @Details 
         * Check email exist or not
         */
        result  = await query(`
        SELECT id
        FROM user
        WHERE user.auth = ? && user.status = 1 LIMIT 1`, [ data.email ]);

        if ( !result.status ) {
            await internalServerError(result.err); // :)3v
            return ( response.error("0500") ); // system error
        }

        if ( result.data.length === 0 ) {
            return ( response.error("0025") ); // This record is not exist
        }


        /**
         * @Details 
         * Insert to verification table
         */
        let code = crypto.randomBytes(35).toString("hex");

        const result1  = await query('INSERT INTO `verification`(`id`, `user_id`, `code`, `type`, `count`, `timestamp`) VALUES (? ,? ,? ,? ,? ,? )', [ null, result.data[0].id, code, 2, 1, dateTime ]);

        if ( !result1.status ) {
            await internalServerError(result.err); // :)3v
            return ( response.error("0500") ); // system error
        }

        /**
         * @Details 
         * Send email to user
         */
        var url = `${process.env.CONF_DOMAIN}/verification-email?userId=${result.data[0].id}&code=${code}`;

        let emailResponse = await email( data.email, 'Password Reset', {
            url: url
        }, 'forget-password' );

        if ( emailResponse ) {

            return ( response.success( "0026" ) );

        } else {
            await query( "DELETE FROM verification WHERE id = ?;", [result1.data.insertId] ); // Delete verification row
            return ( response.error("0023") );
        }

    } catch ( err ) {
        await internalServerError(err); // :)3v
        return ( response.error( "0500" ) );
    }

    
}

const list   = async ( data ) => {

    try {

        /**
         * @detail
         * location validation
        */
       let added_by = '';
        if ( data.authData.role == 1 ) {
            if (data.added_by !== undefined) {
                added_by = `&& user.added_by = ${data.added_by}`;
            } else {
                added_by = ``;
            }
            
        } else if ( data.authData.role == 3 ){
            added_by = `&& user.added_by = ${data.authData.user}`;
            data.role = 4;
        } else {
            return {}
        }

        if ( data.role != 3 ) {
            result  = await query(
                `select user.id, user.auth, user.status, user_detail.name, user_detail.phone, user_detail.address
                FROM user
                INNER JOIN user_detail ON user_detail.user_id = user.id
                WHERE user.status != 403 && user.id != 1 ${added_by} && user.role = ?
                ORDER BY user.id DESC`,
                [data.role]
            );
        } else {
            result  = await query(
                `select user.id, user.auth, user.status, user_company.name, user_company.phone, user_company.address, user_company.logo, user_company.web
                FROM user
                INNER JOIN user_company ON user_company.user_id = user.id
                WHERE user.status != 403 && user.id != 1 ${added_by} && user.role = ?
                ORDER BY user.id DESC`,
                [data.role]
            );
        }

        

        if ( !result.status ) {
            await internalServerError(result.err); // :)3v
            return ( response.error("0500") ); // system error
        }

        return result;

    } catch ( err ) {
        await internalServerError(err); // :)3v
        return ( response.error("0500") );
    }

}

const view   = async ( data ) => {

    try {
        /**
         * @detail
         * location validation
        */
        let added_by = '';
        if ( data.authData.role !== 1 ) {
            added_by = `&& user.added_by = ${data.authData.user}`;
        }

        let result  = await query(
            `select user.role
            FROM user
            WHERE user.id = ?`,
            [data.id]
        );

        if (result.data.length === 0) {
            return result;
        } 



        if ( result.data[0].role != 3 ) {
            result  = await query(
                `select user.id, user.auth, user.status, user_detail.name, user_detail.phone, user_detail.address
                FROM user
                INNER JOIN user_detail ON user_detail.user_id = user.id
                WHERE user.status != 403 ${added_by} && user.id = ?
                ORDER BY user.id DESC`,
                [data.id]
            );
        } else {
            result  = await query(
                `select user.id, user.auth, user.status, user_company.name, user_company.phone, user_company.address, user_company.logo, user_company.web
                FROM user
                INNER JOIN user_company ON user_company.user_id = user.id
                WHERE user.status != 403 ${added_by} && user.id = ?
                ORDER BY user.id DESC`,
                [data.id]
            );
        }

        if ( !result.status ) {
            await internalServerError(result.err); // :)3v
            return ( response.error("0500") ); // system error
        }

       return result;

    } catch ( err ) {
        await internalServerError(err); // :)3v
        return ( response.error("0500") );
    }

}

const edit      = async ( data ) => {

    /**
     * @detail
     * The "auth" must be a unique data
     */
    let result  = await query("SELECT id FROM user WHERE auth = ? LIMIT 1", [data.auth]);

    if ( !result.status ) {
        await internalServerError(result.err); // :)3v
        return ( response.error("0500") ); // system error
    }

    if ( result.data.length > 0 ) {
        return ( response.error("0054") ); // This auth already exist
    }

    /**
     * @detail
     * Input controll check userRole
     */
    if ( "user" in inputControll[`${data.authData.role}`] ) {
        if ( "add" in inputControll[`${data.authData.role}`].user ) {
            if ( inputControll[`${data.authData.role}`].user.add.role.includes(data.role) === false ) {
                return response.error( "0403" )
            }
        } else {
            return response.error( "0403" )
        }
    } else {
        return response.error( "0403" )
    }

    /**
     * @detail
     * get "role" from user
     */
    result = await query("SELECT role FROM user WHERE id = ? LIMIT 1", [data.id]);

    if ( !result.status ) {
        await internalServerError(result.err); // :)3v
        return ( response.error("0500") ); // system error
    }

    let role = 0;
    if ( result.data.length > 0 ) {
        role = result.data[0].role;
    }


    if ( data.web === undefined ) data.web = '';

    /**
     * @detail
     * Update data from "user" table
     */

    const dateTime = luxon.DateTime.now().setZone("UTC").toFormat("y-MM-dd HH:mm:ss")

    if ( role != 3) {
        result  = await query(`UPDATE user 
        INNER JOIN user_detail ON user_detail.user_id = user.id
        SET  user.auth = ?, user.role = ?, user_detail.name = ?, user_detail.address = ?, user_detail.phone = ?, user_detail.last_update = ? WHERE user.id = ?`, [data.auth, data.role, data.name, data.address, data.phone, dateTime, data.id]);
    } else {
        result  = await query(`UPDATE user 
        INNER JOIN user_company ON user_company.user_id = user.id
        SET  user.auth = ?, user.role = ?, user_company.name = ?, user_company.address = ?, user_company.web = ?, user_company.phone = ?, user_company.last_update = ? WHERE user.id = ?`, [data.auth, data.role, data.name, data.address, data.web, data.phone, dateTime, data.id]);
    }
    

    if ( !result.status ) {
        await internalServerError(result.err); // :)3v
        return ( response.error("0500") );
    }

    return response.success(
        "0200"
    )

}

module.exports = {
    login,
    add,
    logout,
    check,
    forget_password,
    list,
    view,
    edit
}