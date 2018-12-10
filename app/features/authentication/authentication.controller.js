const UserModel = require('../user/user.model');
const AdminModel = require('../admin/admin.model');
const Validators = require('../../helpers/validators');
const bcrypt = require('bcrypt');
const User = require('../../models/user.model');

function signup(data, role, callback) {
    //Native Signup
    if (data.type === "native" && data.password) {
        Validators.hashPassword(data.password, function (err, hash) {
            if (err) callback(err, null);
            else if (hash) {
                data.password = hash;
                if (role === "admin") model = AdminModel;
                else model = UserModel;
                model.findUser({ email: data.email }, (err, registered) => {
                    if (err) callback(err, null);
                    else if (registered) {
                        model.findUser({ email: data.email, type: { $nin: [data.type] } }, (err, user) => {
                            if (err) callback(err, null);
                            else if (user) {
                                data.$push = { type: data.type }
                                delete data.type;
                                model.findUserAndUpdate({ _id: user[0]._id }, data, (err, res) => {
                                    if (err) callback(err, null);
                                    else if (res) callback(null, res);
                                    else callback(null, null);
                                });
                            } else callback(null, null);
                        });
                    } else model.signup(data, callback);
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
                if (role === "admin") model = AdminModel;
                else model = UserModel;
                model.findUser({ email: data.email }, (err, registered) => {
                    if (err) callback(err, null);
                    else if (registered) {
                        model.findUser({ email: data.email, type: { $nin: [data.type] } }, (err, user) => {
                            if (err) callback(err, null);
                            else if (user) {
                                if (data.type === "google") {
                                    data.$push = { type: data.type }
                                    delete data.type;
                                    model.findUserAndUpdate({ _id: user[0]._id }, data, (err, res) => {
                                        if (err) callback(err, null);
                                        else if (res) {
                                            model.findUserAndUpdate({ _id: user[0]._id }, { $pull: { type: "facebook" } }, (err, resp) => {
                                                if (err) callback(err, null);
                                                else if (resp) callback(null, resp)
                                                else callback(null, null);
                                            });
                                        }
                                        else callback(null, null);
                                    });
                                }
                                else {
                                    data.$push = { type: data.type }
                                    delete data.type;
                                    model.findUserAndUpdate({ _id: user[0]._id }, data, (err, res) => {
                                        if (err) callback(err, null);
                                        else if (res) {
                                            model.findUserAndUpdate({ _id: user[0]._id }, { $pull: { type: "google" } }, (err, resp) => {
                                                if (err) callback(err, null);
                                                else if (resp) callback(null, resp)
                                                else callback(null, null);
                                            });
                                        }
                                        else callback(null, null);
                                    });
                                }

                            } else callback(null, null);
                        });
                    } else model.signup(data, callback);
                });
            } else callback(null, null);
        });
    } else callback(null, null);
}

function login(data, role, callback) {
    if (role === "admin") model = AdminModel;
    else model = UserModel;
    if (data.email && data.password && data.type === "native") {
        model.login({ email: data.email }, (err, res) => {
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
    } else if (data.type === "google" || data.type === "facebook" && data.userId) {
        model.login({ email: data.email, type: { $in: [data.type] } }, (err, res) => {
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
    } else callback(null, null);
}

module.exports = { signup, login }