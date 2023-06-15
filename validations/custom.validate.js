const sanitizeHtml = require('sanitize-html');
const he = require('he');


const validatePhoneNumber = (phoneNumber) => {
    // Remove all non-digit characters from the phone number
    const digitsOnly = phoneNumber.replace(/\D/g, '');
  
    // Check if the phone number is a valid length
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return false;
    }
  
    // Check if the phone number is in a valid format
    const regex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g;
    return regex.test(phoneNumber);
}


const xssPrevent = ( str, allowedTags= [], htmlEncode = 1 ) => {
    if ( htmlEncode === 0 ) {
        str = he.encode(str);
    }
    return sanitizeHtml(str, {
        allowedTags: allowedTags
    }).replace(/&amp;/g, '&');
}

module.exports = {
    validatePhoneNumber,
    xssPrevent
};