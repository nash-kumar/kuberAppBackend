const UserModel = require('../user/user.model');
const Validators = require('../../helpers/validators');
const bcrypt = require('bcrypt');
const User = require('../../models/user.model');

function signup(data, callback) {
    //Native Signup
    if (data.type === "native" && data.password) {
        Validators.hashPassword(data.password, function (err, hash) {
            if (err) callback(err, null);
            else if (hash) {
                data.password = hash;
                UserModel.findUser({ email: data.email }, (err, res) => {
                    if (err) callback(err, null);
                    else if (res && res.type !== data.type) {
                        UserModel.findUserAndUpdate({ email: data.email }, data, (err, res) => {
                            if (err) callback(err, null);
                            else if (res) callback(null, res);
                            else {
                                data.type = "native";
                                UserModel.signup(data, callback);
                            }
                        });
                    } else if (res) callback(null, null)
                    else {
                        data.type = "native";
                        UserModel.signup(data, callback);
                    }
                });
            } else callback(null, null);
        });
    }

    //Social Signup

    else if (data.type === "google" || data.type === "facebook" && data.userId) {
        Validators.hashPassword(data.userId, function (err, hash) {
            if (err) callback(err, null);
            else if (hash) {
                data.userId = hash;
                UserModel.findUser({ email: data.email }, (err, res) => {
                    if (err) callback(err, null);
                    else if (res && res.type !== data.type) {
                        UserModel.findUserAndUpdate({ email: data.email }, data, (err, res) => {
                            if (err) callback(err, null);
                            else if (res) callback(null, res);
                            else {
                                if (data.type === "google") {
                                    data.type = "google"
                                } else data.type === "facebook"
                                UserModel.signup(data, callback);
                            }
                        });
                    } else if (res) callback(null, null)
                    else {
                        if (data.type === "google") {
                            data.type = "google"
                        } else data.type === "facebook"
                        UserModel.signup(data, callback);
                    }
                });
            } else callback(null, null);
        });
    }
}






// else if (data.type === "google" && data.userId) {
//     Validators.hashPassword(data.userId, function (err, hash) {
//         if (err) callback(err, null);
//         else if (hash) {
//             data.userId = hash;
//             UserModel.findUser({ email: data.email }, (err, res) => {
//                 if (err) callback(err, null);
//                 else if (res && res.type !== data.type ) {
//                     UserModel.findUserAndUpdate({ email: data.email }, data, (err, res) => {
//                         if (err) callback(err, null);
//                         else if (res) callback(null, res);
//                         else {
//                             data.type = "google";
//                             UserModel.signup(data, callback);
//                         }
//                     });
//                 }
//                 else if (res) callback(null, res);
//                 else {
//                     data.type = "google";
//                     UserModel.signup(data, callback);
//                 }
//             });
//         } else callback(null, null);
//     });
// } 

//Facebook login
//     else if (data.type === "facebook" && data.userId) {
//         Validators.hashPassword(data.userId, function (err, hash) {
//             if (err) callback(err, null);
//             else if (hash) {
//                 data.userId = hash;
//                 UserModel.findUser({ email: data.email }, data, (err, res) => {
//                     if (err) callback(err, null);
//                     else if (res && res.type !== data.type ) {
//                         UserModel.findUserAndUpdate({ email: data.email }, data, (err, res) => {
//                             if (err) callback(err, null);
//                             else if (res) callback(null, res);
//                             else {
//                                 data.type = "facebook";
//                                 UserModel.signup(data, callback);
//                             }
//                         });
//                     }
//                     else if (res) callback(null, res);
//                     else {
//                         data.type = "facebook";
//                         UserModel.signup(data, callback);
//                     }
//                 });
//             } else callback(null, null);
//         });
//     } else callback(null, null);
// }


function login(data, callback) {
    if (data.email && data.password && data.type === "native") {
        UserModel.login({ email: data.email }, (err, res) => {
            if (err) callback(err, null);
            else if (res) {
                bcrypt.compare(data.password, res.password, (err, same) => {
                    if (err) callback(err, null);
                    else if (same) {
                        Validators.generateJWTToken(res._id, callback);
                    } else callback(null, null);
                });

            } else callback(null, null);
        });
    } else if (data.type === "google" && data.userId) {
        UserModel.login({ email: data.email }, (err, res) => {
            if (err) callback(err, null);
            else if (res) {
                bcrypt.compare(data.userId, res.userId, (err, same) => {
                    if (err) callback(err, null);
                    else if (same) {
                        Validators.generateJWTToken(res._id, callback);
                    } else callback(null, null);
                });
            }
            else callback(null, null);
        })
    } else if (data.type === "facebook" && data.userId) {
        UserModel.login({ email: data.email }, (err, res) => {
            if (err) callback(err, null);
            else if (res) {

                bcrypt.compare(data.userId, res.userId, (err, same) => {
                    if (err) callback(err, null);
                    else if (same) {
                        Validators.generateJWTToken(res._id, callback);
                    } else callback(null, null);
                });
            }
            else callback(null, null);
        });
    }

}

// function login(type, callback) {
//         if (email && password) {
//             UserModel.login({ email }, (err, res) => {
//                 if (err) callback(err, null);
//                 else if (res) {
//                     if (type === "native") {
//                         bcrypt.compare(password, res.password, (err, same) => {
//                             if (err) callback(err, null);
//                             else if (same) {
//                                 Validators.generateJWTToken(res._id, callback);
//                             } else callback(null, null);
//                         });                        
//                     } else if (type === "google") {
//                         if (req.user) {
//                             socialSignin(req.user, (err, docs) => {
//                                 if (err) resp.errorResponse(res, err, 501, "Error While Signin");
//                                 else if(docs) resp.successPostResponse(res, docs, "Authenticated");
//                                 else resp.noRecordsFound(res, "No User Found");
//                             });
//                         } else {
//                             resp.missingBody(res, "Missing Body");
//                         }
//                     } else if (type === "facebook") {
//                         if (req.user) {
//                             socialSignin(req.user, (err, docs) => {
//                                 if (err) resp.errorResponse(res, err, 501, "Error While Signin");
//                                 else if(docs) resp.successPostResponse(res, docs, "Authenticated");
//                                 else resp.noRecordsFound(res, "No User Found");
//                             });
//                         } else {
//                             resp.missingBody(res, "Missing Body");
//                         }
//                     } else callback(null, null);                    
//                 } else callback(null, null);
//             });
//         } else callback(null, null);

// }



function socialSignin(user, callback) {
    Validators.generateJWTToken(user._id, callback);
}

module.exports = { signup, login, socialSignin }