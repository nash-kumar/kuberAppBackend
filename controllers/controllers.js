var userModel = require('../model/model').userModel;
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const async = require('async');
let randToken=require('rand-token');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const schedule = require('node-schedule');
var Email = process.env.email;
var pass = process.env.password;
var service = process.env.service;
var refreshTokens = {} 
exports.register = (req, res) => {
    async.waterfall([function (done) {
        if (req.body.data) {
            const user = userModel({
                firstname: req.body.data.firstname,
                lastname: req.body.data.lastname,
                email: req.body.data.email,
                password: bcrypt.hashSync(req.body.data.password)
            });
            user.save((err, result) => {
                if (err) {
                    res.status(500).send({
                        success: false,
                        message: err.message
                    });
                } else if (result) {
                    res.status(201).send({ success: true, message: "Data added successfully", result });
                }
            });
        } else {
            res.status(400).json({
                message: 'Please Enter any DATA!'
            });
        }
    }]);
}
exports.login = (req, res) => {
    userModel.findOne({ email: req.body.data.email }, function (err, userInfo) {

        if (err) {
            next(err);
        } if (userInfo) {
            if (bcrypt.compareSync(req.body.data.password, userInfo.password)) {
             const token = jwt.sign({
                   email:userInfo.email,
                   _id:userInfo._id
                }, process.env.JWT_KEY, {
                        expiresIn: "1h"
                    });
                    const refreshToken = jwt.sign({
                        email:userInfo.email,
                        _id:userInfo._id
                     }, process.env.JWT_KEY, {
                             expiresIn: "2m"
                         });
                         const response = {
                            "status": "Logged in",
                            "token": token,
                            "refreshToken": refreshToken,
                        }
                         refreshTokens[refreshToken]=response;
                         res.status(200).json(response);
            } else {
                res.json({ success: false, message: "Invalid email/password!!!" });
            }
        }
        if (!userInfo) {
            res.json({ success: false, message: "Invalid email/password!!!" });
        }
    });
}
exports.token= (req,res) => {
    // refresh the damn token
    const postData = req.body
    // if refresh token exists
    if((postData.refreshToken) && (postData.refreshToken in refreshTokens)) {
        const user = {
            "email": postData.email,
            
        }
        const token = jwt.sign(user, process.env.JWT_KEY, { expiresIn: "1d"})
        const response = {
            "token": token,
        }
        // update the token in the list
        refreshTokens[postData.refreshToken].token = token
        res.status(200).json(response);        
    } else {
        res.status(404).send('Invalid request')
    }
}


exports.forgot_password = function (req, res, next) {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            userModel.findOne({ email: req.body.email }, function (err, user) {

                if (err) {
                    next(err);
                }
                else if (!user) {

                    res.status(400).json({message: "No account with that email address exists." });
                } else {
                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    user.save(function (err) {
                        done(err, token, user);
                    });
                }
            });
        },
        function (token, user, done) {
            res.json({ success: true });
            var smtpTransport = nodemailer.createTransport({
                service: service,
                host: 'smtp.gmail.com',
                port: 465,
                auth: {
                    user: Email,
                    pass: pass
                }
            });
            name = user.firstname;
            nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);
            var mailOptions = {
                to: req.body.email,
                from: Email,
                subject: '[Kuber App]',
                text: 'Hi ' + nameCapitalized + ',\n\n' +

                    'We recieved a request to reset your KuberApp password\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + 'localhost:4200/forgot' + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err, result) {
                if (err) {
                     res.status(500).json({message: "Check the given email id" });
                } else {
                    res.status(200).json({message: "Email sent " })
                }
            });
        }
    ]);
}
exports.reset_get = (req, res) => {
    userModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function (err) {
                done(err, user);
            });
            return res.json({ success: false, message: "Password reset token is invalid or has expired" });
        }
    });
};

exports.reset_password = (req, res) => {
    async.waterfall([
        function (done) {
            userModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                if (!user) {
                    debugger;
                    userModel.findOne({ resetPasswordToken: req.params.token }, function (err, user1) {
                        if (err) {
                           res.status(403).json({ message: 'Error while updating user document.' });
                        }
                        user1.resetPasswordToken = undefined;
                        user1.resetPasswordExpires = undefined;
                        user1.save(function (err) {
                            done(err, user1);
                        });
                         res.status(403).json({ message: 'Password reset token is invalid or has expired.' });
                    });
                } else {
                    user.password = bcrypt.hashSync(req.body.password, saltRounds)
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save(function (err) {
                        done(err, user);
                    });
                    user1 = user.email;
                    res.status(200).json({ message: 'Your password has been updated.' });
                }

            });
        },
        function (user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: service,
                host: 'smtp.gmail.com',
                port: 465,
                auth: {
                    user: Email,
                    pass: pass
                }
            });
            name = user.firstname;
            nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);
            var mailOptions = {
                to: user1,
                from: Email,
                subject: '[Kuber App]',
                text: 'Hi ' + nameCapitalized + ',\n\n' +
                    'This is a confirmation that the password for your account ' + user1 + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err, result) {
                if (err) {
                    res.status(403).json({ message: "Kindly check your mail for instructions" })
                } else {
                    res.status(200).json({message: "Email Sent" })
                }
            });
        }
    ]);
}