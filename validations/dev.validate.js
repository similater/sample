/**
 * @Description
 * This validate file has all dev validations. 
 * @author
 * R.M. Kavindu Nimesh
 * @END
 */


const joi = require("joi");
const { xssPrevent, validatePhoneNumber } = require("./custom.validate");


const login = joi.object({

    username: joi.string()
        .required()
        .label("username")
    ,
    password: joi.string()
        .required()
        .label("password")
    ,

});


module.exports = {
    
    login,
}