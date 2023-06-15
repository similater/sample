/**
 * @Description 
 * This is for authorization
 * @author
 * R.M. Kavindu Nimesh
 * @END
 */

const response = require('./response'); // Custom errors
const jwt   = require('jsonwebtoken');

require('dotenv').config( {path: './../.env/config.env'} );
const query    = require('./../services/query');
const internalServerError = require("../services/internalServerError.js");

const authorize = async ( req, res, next ) => {

    if ( req.headers.cookie === undefined ) {
        res.redirect("/");
        // res.status(401).send( response.error("0401") );
        return;
    }

    result = getCookie( 'admin', req.headers.cookie );

    if ( !result.status ) {
        res.redirect("/");
        // res.status(401).send( response.error("0401") );
        return;
    }

    let accessToken = result.data;

    let check = new Promise(function(resolve) {
        jwt.verify(result.data, process.env.JWTACCESS, (err, data) => {
            if (err) {
                resolve({
                    status : false,
                });
            } else {
                resolve({
                    status : true,
                    data : data
                });
            }
        })
    })
    let data = await check;

    if ( !data.status ) {
        // res.status(401).send( response.error("0401") );
        res.redirect("/");
        return;
    }

    // Get data and check user is true
    result  = await query("SELECT user.id, user.auth FROM user WHERE user.status = 1 && user.role = ? && user.id = ?", [data.data.role, data.data.user]);

    if ( !result.status ) {
        await internalServerError(result.err); // :)3v
        res.status(500).send( response.error("0500") );
        return;
    }

    if ( result.data.length === 0 ) {
        res.status(403).send( response.error("0403") );
        return;
    }

    
    data.data.auth = result.data[0].auth;
    
    data = data.data;
    data.accessToken = accessToken;
   
    req.authorization = {
        data
    };
    next();

};


const getCookie = (cookie_name, cookie) => {
    const re = new RegExp(`(?<=${cookie_name}=)[^;]*`);
    try {
        return {
            "status": true,
            "data": cookie.match(re)[0]
        }
    } catch {
        return {
            "status": false
        }
    }
};


module.exports = {authorize};