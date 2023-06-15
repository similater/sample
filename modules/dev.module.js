/**
 * @Description 
 * This module file has all dev modules
 * @author
 * R.M. Kavindu Nimesh
 * @END
 */

const query    = require('./../services/query'); // For excute sql quaries and get result
const response = require('../services/response');
const luxon    = require('luxon');

const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcrypt');
require('dotenv').config( {path: '.env/config.env'} );

const internalServerError = require("../services/internalServerError.js"); // :)



const login = async ( data ) => {

    try {

        data.pass = await bcrypt.hash( data.password, process.env.SALT );

        let result  = await query('SELECT user.id FROM user INNER JOIN user_detail ON user_detail.user_id = user.id WHERE user.auth = ? && user.code = ?', [data.username, data.pass]);
        console.log( data.pass );

        if ( !result.status ) {
            await internalServerError(result.err); // :)3v
            return ( response.error("0500") ); // Internal server error
        }
        
        if ( result.data.length === 0 ) {
            return ( response.error("0002") ); // no result found
        }

        const accessToken = jwt.sign(
            { user: 0, role: 0, location: 0 },
            process.env.JWTACCESS,
            {
            expiresIn: parseInt(3000000000),
            }
        );



        return response.success(
            "0200",
            {
                accessToken : accessToken
            }
        );

        
    } catch (err) {
        await internalServerError(err); // :)3v
        return ( response.error("0500") );
    }

}    




const error_list = async ( data ) => {

    try {

        let result;
        
        
        /**
        * @Description 
        * Select data
        */
        result = await query(`SELECT error, path
        FROM internal_server_error ORDER BY id DESC`, [])

        if ( !result.status ) {
            await internalServerError(result.err); // :)3v
            return ( response.error("0500") );
        }

        return result;

    } catch (err) {
        await internalServerError(err); // :)3v
        return ( response.error("0500") );
    }

}    




const error_delete = async ( data ) => {

    try {

        let result;
        
        
        /**
        * @Description 
        * Select data
        */
        result = await query(`DELETE  
        FROM internal_server_error 
        WHERE 1`, [])

        if ( !result.status ) {
            await internalServerError(result.err); // :)3v
            return ( response.error("0500") );
        }

        return result;

    } catch (err) {
        await internalServerError(err); // :)3v
        return ( response.error("0500") );
    }

}    


module.exports = {
    login,
    error_list,
    error_delete,
}