/**
 * @Description 
 * This validate file has all user validates. 
 * @author
 * R.M. Kavindu Nimesh
 * @END
 */


const joi = require("joi");
const { xssPrevent, validatePhoneNumber } = require("./custom.validate");

const login = joi.object({

    auth: joi.string()
        .label("Mobile Number")
    ,
    pass: joi.string()
        .label("password")
    ,

});

const add = joi.object({

    name: joi.string()
        .min(1)
        .max(200)
        .required()
        .label("User Name")
    ,
    role: joi.number()
        .min(1)
        .max(4)
        .required()
        .label("User Role")
    ,
    web: joi.string()
        .min(0)
        .max(300)
        .label("web")
    ,
    auth: joi.string()
        .max(200)
        .label("auth")
    ,
    pass: joi.string()
        .label("Password")
    ,
    address: joi.string()
        .min(1)
        .max(500)
        .required()
    ,
    phone: joi.string()
        .required()
        .label("phone")
        .custom((value, helper) => {
            let phoneValid = validatePhoneNumber(value);
            if (!phoneValid) {
                return helper.message("phone number is incorrect");
            }
            return value
        })
    ,

});

const list = joi.object({

    added_by: joi.number()
        .min(1)
        .max(2147483647)
        .label("added_by")
    ,
    role: joi.number()
        .min(2)
        .max(4)
        .required()
    ,

});

const view = joi.object({

    id: joi.number()
        .min(1)
        .max(2147483647)
        .required()
        .label("id")
    ,

});

const edit = joi.object({

    id: joi.number()
        .min(1)
        .max(999999)
        .required()
        .label("id")
    ,
    name: joi.string()
        .min(1)
        .max(200)
        .required()
        .label("User Name")
    ,
    role: joi.number()
        .min(1)
        .max(4)
        .required()
        .label("User Role")
    ,
    web: joi.string()
        .min(0)
        .max(300)
        .label("web")
    ,
    auth: joi.string()
        .max(200)
        .label("auth")
        .required()
    ,
    pass: joi.string()
        .label("Password")
    ,
    address: joi.string()
        .min(1)
        .max(500)
        .required()
    ,
    phone: joi.string()
        .required()
        .label("phone")
        .custom((value, helper) => {
            let phoneValid = validatePhoneNumber(value);
            if (!phoneValid) {
                return helper.message("phone number is incorrect");
            }
            return value
        })
    ,

});

module.exports = {
    login,
    add,
    list,
    view,
    edit,
}