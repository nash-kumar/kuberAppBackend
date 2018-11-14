const bcrypt = require('bcrypt');
const rounds = 10;
const atob = require('atob');
const SECRET = process.env.SECRET;
let b64ToString;
let creds = [];
const jwt = require('jsonwebtoken');

function validateMobileNo(number) {
    if (number && (number.toString()).length > 6 && (number.toString()).length < 11) return true;
    else return false;
    return false;
}
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function hashPassword(password, callback) {
    bcrypt.hash(password, rounds, function (err, hash) {
        if (err) {
            console.error('Error while hashing the password', rounds, password, err, hash);
            callback(err, null);
        } else if (hash) {
            console.info('Hash Successfully Created');
            callback(null, hash);
        } else callback(null, null);
    });
}
function decodeAuthString(authString, callback) {
    b64ToString = atob(authString);
    creds = b64ToString.split(':');
    if (creds && creds.length === 2) callback(creds[0], creds[1]);
    else callback(null, null);
}

function generateJWTToken(id, callback) {
    // Extracting Id and converting to string representation 
    /* let id = new ObjectId(id);
    id = id.toHexString(); */
    const payload = { _id: id };
    console.log('The Hex Id String:', payload);
    let token = jwt.sign(payload, SECRET, {
        expiresIn: 604800 * 4 //4 week 
    });
    token = 'JWT ' + token;
    console.info('Successfully created an access token', id, token);
    callback(null, token);
}

module.exports = { validateMobileNo, validateEmail, hashPassword, decodeAuthString, generateJWTToken }
