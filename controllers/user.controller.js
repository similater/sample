/**
 * @Description 
 * This controller file has all user controllers. 
 * @author
 * R.M. Kavindu Nimesh
 * @END
 */

const user      = require("../modules/user.module");
const authorization = require("../json/authorization.json");
const response      = require('../services/response'); // Custom errors
const validate      = require('../validations/user.validate'); // Input validations
const internalServerError = require("../services/internalServerError.js"); // :)3v

require('dotenv').config( {path: './../.env/config.env'} );

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
            const result = await user.login( data )
            if ( result.status ) {
                res.cookie("admin", result.data.accessToken, { 
                    httpOnly: true,
                    maxAge: process.env.JWTAMAXAGE,
                });
                res.status(200).send( response.success( "0200" ) );
            }else{
                res.status(200).send( result );
            }

        } catch (err){
            await internalServerError(err); // :)3v
            res.status(200).send( response.error( "0500" ) );
        }
        
    } catch (err) {
        res.status(200).send( response.error( "0000", err.details[0].message ) );
    }

}

const add = async (req, res) => {


    /**
     * @detail
     * Authorization
     */
    if ( !authorization.user.add.includes(req.authorization.data.role) ) {
        res.status(401).send( response.error("0403") );
        return;
    }


    /**
     * @detail
     * Input Validation
     */
    try {

        const data = await validate.add.validateAsync(req.body);

    data.authData  = req.authorization.data;

        try{

            /**
             * @detail
             * Process
             */
            const result = await user.add( data )
            res.status(200).send( result );

        } catch (err){
            await internalServerError(err); // :)3v
            res.status(200).send( response.error( "0500" ) );
        }
        
    } catch (err) {
        res.status(200).send( response.error( "0000", err.details[0].message ) );
    }

}

const check = async (req, res) => {

    const data = { "authData" : req.authorization.data};

        try{

            /**
             * @detail
             * Process
             */
            const result = await user.check( data )
            res.status(200).send( result );

        } catch (err){
            await internalServerError(err); // :)3v
            res.status(200).send( response.error( "0500" ) );
        }
        
}

const logout = async (req, res) => {

    try{

        /**
         * @detail
         * Process
         */
        res.cookie("admin", req.authorization.data.accessToken, { 
            httpOnly: true,
            maxAge: 0,
        });
        res.status(200).send( response.success( "0200" ) );

    } catch (err){
        await internalServerError(err); // :)3v
        res.status(200).send( response.error( "0500" ) );
    }
        
}

const list = async (req, res) => {


    /**
     * @detail
     * Authorization
     */
    if ( !authorization.user.list.includes(req.authorization.data.role) ) {
        res.status(401).send( response.error("0403") );
        return;
    }


    /**
     * @detail
     * Input Validation
     */
    try {

        const data = await validate.list.validateAsync(req.body);

    data.authData  = req.authorization.data;

        try{

            /**
             * @detail
             * Process
             */
            const result = await user.list( data )
            res.status(200).send( result );

        } catch (err){
            await internalServerError(err); // :)3v
            res.status(200).send( response.error( "0500" ) );
        }
        
    } catch (err) {
        res.status(200).send( response.error( "0000", err.details[0].message ) );
    }

}

const view = async (req, res) => {


    /**
     * @detail
     * Authorization
     */
    if ( !authorization.user.view.includes(req.authorization.data.role) ) {
        res.status(401).send( response.error("0403") );
        return;
    }


    /**
     * @detail
     * Input Validation
     */
    try {

        const data = await validate.view.validateAsync(req.body);

    data.authData  = req.authorization.data;

        try{

            /**
             * @detail
             * Process
             */
            const result = await user.view( data )
            res.status(200).send( result );

        } catch (err){
            await internalServerError(err); // :)3v
            res.status(200).send( response.error( "0500" ) );
        }
        
    } catch (err) {
        res.status(200).send( response.error( "0000", err.details[0].message ) );
    }

}

const edit = async (req, res) => {


    /**
     * @detail
     * Authorization
     */
    if ( !authorization.user.edit.includes(req.authorization.data.role) ) {
        res.status(401).send( response.error("0403") );
        return;
    }


    /**
     * @detail
     * Input Validation
     */
    try {

        const data = await validate.edit.validateAsync(req.body);

    data.authData  = req.authorization.data;

        try{

            /**
             * @detail
             * Process
             */
            const result = await user.edit( data )
            res.status(200).send( result );

        } catch (err){
            await internalServerError(err); // :)3v
            res.status(200).send( response.error( "0500" ) );
        }
        
    } catch (err) {
        res.status(200).send( response.error( "0000", err.details[0].message ) );
    }

}

module.exports = {
    login,
    add,
    check,
    logout,
    list,
    view,
    edit,
}