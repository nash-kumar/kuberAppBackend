const express = require('express');
const router = express.Router();
const userModel = require('../model/model').userModel;
const cardModel = require('../model/card').cardModel;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const passport = require('passport');

//REGISTRATION-API
router.post('/register', (req, res) => {
    console.log('POST IS WORKING!');
    if (req.body.data) {
        const user = userModel({
                firstname: req.body.data.firstname,
                lastname: req.body.data.lastname,
                email: req.body.data.email,
                password: bcrypt.hashSync(req.body.data.password, saltRounds)
            
        });
        userModel.findOne({'local.email':req.body.data.email , 'google.email': req.body.data.email,'facebook.email':req.body.data.email},function(err,userData)
        {
            if (err) {
                next(err);
            } else if (userData !== null && userData.email === user.local.email && userData.google.email === user.local.email && userData.facebook.email === user.local.email) {
                res.status(201).send({ success: true, message: "User Already exists", userData });
            }else {
                user.save((err, result) => {
                    if (err) {
                        if (err && err.name === 'ValidationError'){
                            res.status(501).send({ success: false, message: 'Required fields are missing' });}
                        else if (err && err.name === 'MongoError') {
                        res.status(501).send({ success: false, message: "User has been registered" });
                        }
                    } else if (result) {
                        res.status(201).send({ success: true, message: "Data added successfully", result });
                    }
                })
            }
        })}
   else {
    res.status(400).json({
        message: 'Please Enter any DATA!'
    });
}
});

//LOGIN-API
router.post('/login', (req, res) => {
    const email = req.body.data.email;
    var password = req.body.password;

    userModel.findOne({ email: req.body.data.email }, function (err, userInfo) {

        if (err) {
            next(err);
        } if (userInfo) {
            if ((req.body.data.password, userInfo.password)) {

                res.json({ success: true, message: "user found!!!", data: { user: userInfo } });
            } else {
                res.json({ success: false, message: "Invalid email/password!!!" });
            }
        }
        if (!userInfo) {
            res.json({ success: false, message: "Invalid email/password!!!" });
        }
    });
});
router.get('/login', (req, res) => {
    res.render('login', { user: req.user });
});

// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    res.send('logging out');
});


router.get('/facebook', passport.authorize('facebook', { scope: ['public_profile', 'email'] }));

// handle the callback after facebook has authenticated the user
router.get('/facebook/callback',
    passport.authorize('facebook', (req, res) => {
        // res.send('You have done');
    }));



//auth with google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

//callback for 
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.send('You have done');
});
//CARD-API
router.post('/card', (req, res) => {
    if (req.body.data) {
        let userData = cardModel({
            cardType:req.body.data.cardType,
            cardNumber:req.body.data.cardNumber,
            userId:req.body.data.userId,
            userEmail:req.body.data.userEmail,
            expDate:req.body.data.expDate,
            cardUserName:req.body.data.cardUserName,
            cvvCode:req.body.data.cvvCode
        });
        userData.save((err, result) => {
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
});

router.get('/card/list/:id', function (req, res, next) {
    let query = cardModel.findOne({id: req.params.userId});
    query.exec((err, result) => {
        if (err) {
            res.send(err);
            res.status(404).send({ success: false, message: "Users Not Found" })
        } else {
            res.status(200).send({ success: true, message: "Succesfully fetched user details", result : result.cardNumber});
            //res.json({ user });
        }
    })
});



require('dotenv').config();

var Email = process.env.email;
var pass = process.env.password;
var service = process.env.service;


// FORGOT PASSWORD API 

router.post('/forgot', function (req, res, next) {
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
            var mailOptions = {
                to: req.body.email,
                from: Email,
                subject: '[Kuber App]',
                text:'Hi\n\n' +
                
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
    ], function (err) {
        if (err) return next(err);
        res.redirect('/forgot');
    });
});

router.get('/reset/:token', function (req, res) {
    userModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
            res.json({ success: false, message: "Password reset token is invalid or has expired" });
        }
    });
});

router.post('/reset/:token', function (req, res) {
    async.waterfall([
        function (done) {
            userModel.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                if (err) {
                    next(err);
                }
                else if (!user) {
                    debugger;
                    res.json({ success: false, message: 'Password reset token is invalid or has expired.' });
                } else {
                    user.password = req.body.password;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save(function (err) {
                        done(err, user);
                    });
                    user = user.email;
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
            var mailOptions = {
                to: user,
                from: Email,
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user + ' has just been changed.\n'
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
});


module.exports = router;