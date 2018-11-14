const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');
const UserModel = require('../features/user/user.model');

module.exports = function (passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = process.env.SECRET;
    passport.use(new JwtStrategy(opts, function (jwtPayload, done) {
        console.log('User Authenticating:', jwtPayload);
        UserModel.findUser({ _id: jwtPayload._id }, function (err, user) {
            if (err) {
                return done(err, false);
            } else if (user) {
                return done(null, user[0]);
            } else {
                return done(null, false);
            }
        });
    }));
    passport.use('googleToken', new GooglePlusTokenStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }, async (accessToken, refreshToken, profile, done) => {        
        UserModel.findUser({ googleId: profile.id }, function (err, user) {
            if (err) {
                return done(err, false);
            } else if (user) {
                return done(null, user[0]);
            } else {
                UserModel.findUser({ email: profile.emails[0].value }, function (err, docs) {
                    if (err) {
                        console.log("Error:", err);
                        return done(err, false);
                    } else if (docs) {
                        UserModel.findUserAndUpdate({ email: profile.emails[0].value }, { googleId: profile.id }, (err, data) => {
                            if (err) return (done(err, false));
                            else if (data) return done(null, data);
                            else return done(null, false);
                        });
                    } else {
                        UserModel.signup({ email: profile.emails[0].value, googleId: profile.id, profileImage: profile.photos[0].value }, (err, resp) => {
                            if (err) done(err, false);
                            else if (resp) done(null, resp);
                            else done(null, false);
                        });
                    }
                });
            }
        });
    }));
    passport.use('facebookToken', new FacebookTokenStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }, async (accessToken, refreshToken, profile, done) => {
        console.log("profile", profile);
        UserModel.findUser({ facebookId: profile.id }, function (err, user) {
            if (err) {
                return done(err, false);
            } else if (user) {
                return done(null, user[0]);
            } else {
                UserModel.findUser({ email: profile.emails[0].value }, function (err, docs) {
                    if (err) {
                        console.log("Error:", err);
                        return done(err, false);
                    } else if (docs) {
                        UserModel.findUserAndUpdate({ email: profile.emails[0].value }, { facebookId: profile.id }, (err, data) => {
                            if (err) return (done(err, false));
                            else if (data) return done(null, data);
                            else return done(null, false);
                        });
                    } else {
                        UserModel.signup({ email: profile.emails[0].value, facebookId: profile.id, profileImage: profile.photos[0].value }, (err, resp) => {
                            if (err) done(err, false);
                            else if (resp) done(null, resp);
                            else done(null, false);
                        });
                    }
                });
            }
        });
    }));
}