const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const passport = require('passport');
const GoogleStratergy = require('passport-google-oauth20');
const keys = require('./keys')
const User = require('../model/model');

passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser((id, done)=>{
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStratergy({
        //options for the google strat
        callbackURL: "http://localhost:4101/user/google/redirect",
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    },(accessToken, refreshToken, profile, done)=>{
        User.findOne({google:{googleID:profile.id}}).then((currentUser)=>{
            if (err)
            return done(err);
            if(currentUser){
                console.log('User is '+ currentUser);
                done(null, currentUser);
            }else{
                new User({
                    googleID:profile.id,
                    username: profile.displayname
                }).save().then((newUser) => {
                    console.log("new user created"+ newUser);
                    done(null, newUser);
                });
            }
        });
    } ) )



        
       



       