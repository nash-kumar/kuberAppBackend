const UserModel = require('../user/user.model');
const Validators = require('../../helpers/validators');
const bcrypt = require('bcrypt');

function signup(data, callback) {
    if (data.password) {
        Validators.hashPassword(data.password, function (err, hash) {
            if (err) callback(err, null);
            else if (hash) {
                data.password = hash;
                UserModel.signup(data, callback);
            } else callback(null, null);
        });
    } else callback (null, null);
}

function login(authString, callback) {
    Validators.decodeAuthString(authString, (email, password) => {
        if (email && password) {
            UserModel.login({email}, (err, res) => {
                if (err) callback(err, null);
                else if (res) {
                    bcrypt.compare(password, res.password, (err, same) => {
                        if (err) callback(err, null);
                        else if (same) {
                            Validators.generateJWTToken(res._id, callback);
                        } else callback(null, null);
                    });
                } else callback(null, null);
            });
        } else callback(null, null);
    });

}

function socialSignin(user, callback) {
    Validators.generateJWTToken(user._id, callback);
}
module.exports = { signup, login , socialSignin}