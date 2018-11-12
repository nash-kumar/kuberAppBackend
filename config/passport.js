const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const passport = require('passport');
const GoogleStratergy = require('passport-google-oauth20');
const keys = require('./keys')


passport.use(
    new GoogleStratergy({
        //options for the google strat
        callbackURL: "http://localhost:4101/user/google/redirect",
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        //passport callback function
        console.log('function fired');
        console.log(profile);
    })

)

