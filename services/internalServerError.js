/**
 * @Description 
 * This is for log internal server errors
 * @author
 * R.M. Kavindu Nimesh
 * @END
 */

const query    = require('./query'); // For excute sql quaries and get result
const luxon    = require('luxon');
require('dotenv').config( {path: './../.env/config.env'} );


module.exports = async function (err,level){
    if ( process.env.DEV ) {

        var orig = Error.prepareStackTrace,
            error = new Error(),
            stack;

        Error.prepareStackTrace = function(){return arguments[1];};
        Error.captureStackTrace(error, arguments.callee);

        stack = error.stack[level || 0];

        Error.prepareStackTrace = orig;

        if(!stack){
            return 'stack level ' + level + ' out of range.';
        }

        const dateTime = luxon.DateTime.now().setZone("UTC").toFormat("y-MM-dd HH:mm:ss");

        try{
            var stackTrace = err.stack.split("\n");
            console.log(stackTrace)
            result  = await query('INSERT INTO `internal_server_error`(`id`, `error`,`path`, `timestamp`) VALUES (?,?,?,?)', [null, err.toString(), stackTrace[1], dateTime]);
            return true;
        }catch (err){
            return false;
        }

    } else {
        return true;
    }
};