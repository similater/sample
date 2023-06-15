/**
 * @Description 
 * This controller file has all dev controllers. 
 * @author
 * R.M. Kavindu Nimesh
 * @END
 */


const dev      = require("../modules/dev.module");
const authorization = require("../json/authorization.json");
const response      = require('../services/response'); // Custom errors
const validate      = require('../validations/dev.validate'); // Input validations

const internalServerError = require("../services/internalServerError.js"); // :)3v

const login = async (req, res) => {


    /**
     * @detail
     * Input Validation
     */
    try {

        const data = await validate.login.validateAsync(req.body);

        try{

            /**
             * @detail
             * Process
             */
            const result = await dev.login( data )
            res.status(200).send( result );

        } catch (err){
            await internalServerError(err); // :)3v
            res.status(200).send( response.error( "0500" ) );
        }
        
    } catch (err) {
        res.status(200).send( response.error( "0000", err.details[0].message ) );
    }

}

const error_list = async (req, res) => {


    /**
     * @detail
     * Authorization
     */
    if ( !authorization.dev.error_list.includes(req.authorization.data.role) ) {
        res.status(401).send( response.error("0403") );
        return;
    }

    const data = { "authData" : req.authorization.data};

        try{

            /**
             * @detail
             * Process
             */
            const result = await dev.error_list( data )
            res.status(200).send( result );

        } catch (err){
            await internalServerError(err); // :)3v
            res.status(200).send( response.error( "0500" ) );
        }
        
}

const error_delete = async (req, res) => {


    /**
     * @detail
     * Authorization
     */
    if ( !authorization.dev.error_delete.includes(req.authorization.data.role) ) {
        res.status(401).send( response.error("0403") );
        return;
    }

    const data = { "authData" : req.authorization.data};

        try{

            /**
             * @detail
             * Process
             */
            const result = await dev.error_delete( data )
            res.status(200).send( result );

        } catch (err){
            await internalServerError(err); // :)3v
            res.status(200).send( response.error( "0500" ) );
        }
        
}

module.exports = {
    login,
    error_list,
    error_delete,
}