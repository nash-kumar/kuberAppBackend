const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const passport = require('passport');
const GoogleStratergy = require('passport-google-oauth20');
const keys = require('./keys')
const userModel = require('../model/model').userModel;

passport.use(
    new GoogleStratergy({
        //options for the google strat
        callbackURL: "http://localhost:4101/user/google/redirect",
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, 
    function(accessToken, refreshToken, profile, done) {
        //check
      process.nextTick(function(){
            userModel.findOne({'google.googleID': profile.id}, function(err, user){
                if(err)
                    return done(err);
                if(user)
                console.log('user is',user);
                    // return done(null, user);
                    else{
                const newUser = userModel({
                    google:{
                    googleID: profile.id,
                    username: profile.displayName
               } }); 
               newUser.save((err, result) => {
                   if (err) {
                      console.log(err);
                   } else if (result) {
                       console.log('user added' + newUser)
                   }
               });

            }

        });
      })
 }))



        
       



       