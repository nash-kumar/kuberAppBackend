var userModel = require('../model/model').userModel;
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();
const schedule=require('node-schedule');
var Email = process.env.email;
var pass = process.env.password;
var service = process.env.service;

exports.register= (req, res) => {
    async.waterfall([ function(done){
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
    } }],);
}
exports.login= (req,res)=>{
    userModel.findOne({ email: req.body.data.email}, function (err, userInfo) {

        if (err) {
            next(err);
        } if (userInfo) {
            if (bcrypt.compareSync(req.body.data.password, userInfo.password)) {

                res.json({ success: true, message: "user found!!!", data: { user: userInfo } });
            } else {
                res.json({ success: false, message: "Invalid email/password!!!" });
            }
        }
        if (!userInfo) {
            res.json({ success: false, message: "Invalid email/password!!!" });
        }
    });
}

exports.forgot_password=function (req, res, next) {
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

                    res.json({ success: false, message: "No account with that email address exists." });
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
            name= user.firstname;
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
            smtpTransport.sendMail(mailOptions, function (err, res) {
                if (err) {
                    res.json({ success: false, message: "Check the given email id" });
                } else {
                    res.json({ success: true, message: "Email sent " })
                }
            });
        }
    ],);
}
exports.reset_get = (req, res)=> {
    userModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
            res.json({ success: false, message: "Password reset token is invalid or has expired" });
        }
    });
};

exports.reset_password =  (req, res)=>{
    async.waterfall([
        function (done) {
            userModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                if (!user) {
                    debugger;
                    res.json({ success: false, message: 'Password reset token is invalid or has expired.' });

                     } else {
                    user.password = bcrypt.hashSync(req.body.password, saltRounds)
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save(function (err) {
                        done(err, user);
                    });
                    user1 = user.email;
                    res.json({ success: true, message: 'Your password has been updated.' });
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
            name= user.firstname;
            nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);
            var mailOptions = {
                to: user1,
                from: Email,
                subject: '[Kuber App]',
                text: 'Hi ' + nameCapitalized + ',\n\n' +
                    'This is a confirmation that the password for your account ' + user1 + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err, res) {
                if (err) {
                    res.json({ success: false, message: "Kindly check your mail for instructions" })
                } else {
                    res.json({ success: true, message: "Email Sent" })
                }
            });
        }
    ]);
}