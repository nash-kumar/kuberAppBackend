const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const passport = require('passport');
const GoogleStratergy = require('passport-google-oauth20');
const keys = require('./keys')
var FacebookStrategy = require('passport-facebook').Strategy;
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
                    username: profile.displayName,
                    email:profile.emails[0].value
               } }); 
               newUser.save((err, result) => {
                   if (err) {
                      console.log(err);
                   } else if (result) {
                       console.log('user added' + newUser)
                   }
               });
             console.log(profile);

            }

        });
      })
 }))

 passport.use(
    new FacebookStrategy({
        //options for the google strat
        callbackURL    : 'http://localhost:4101/user/facebook/callback',
        profileURL: 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        profileFields  : ['id', 'email', 'name'],
        clientID: keys.facebookAuth.clientID,
        clientSecret: keys.facebookAuth.clientSecret
    },
 function(req, token, refreshToken, profile, done) {

     // asynchronous
     process.nextTick(function() {

         // check if the user is already logged in
         if (!req.user) {

             userModel.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                 if (err)
                     return done(err);

                 if (user) {
                     return done(null, user); // user found, return that user
                 } else {
                     // if there is no user, create them
                     const newUser = userModel({
                        facebook:{
                            id:profile.id,
                            token : token,
                            name  : profile.displayName,
                            email : (profile.emails[0].value || '').toLowerCase()
   
                   } }); 
                   newUser.save((err, result) => {
                       if (err) {
                          console.log(err);
                       } else if (result) {
                           console.log('user added' + newUser)
                       }
                   });
                // console.log(profile);
                 }
             });

         } 
     });

 }));



        
// passport.use(
//         new FacebookStrategy({
//             //options for the google strat
//             callbackURL: keys.facebookAuth.callbackURL,
//             clientID: keys.facebookAuth.clientID,
//             clientSecret: keys.facebookAuth.clientSecret
//         },
//             function(req, token, refreshToken, profile, done) {
        
//                 // asynchronous
//                 process.nextTick(function() {
        
//                     // check if the user is already logged in
//                     if (!req.user) {
        
//                         userModel.findOne({ 'facebook.id' : profile.id }, function(err, user) {
//                             if (err)
//                                 return done(err);
        
//                             if (user) {
        
//                                 // if there is a user id already but no token (user was linked at one point and then removed)
//                                 if (!user.facebook.token) {
//                                     user.facebook.token = token;
//                                     user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
//                                     user.facebook.email = (profile.emails[0].value || '').toLowerCase();
        
//                                     user.save(function(err) {
//                                         if (err)
//                                             return done(err);
                                            
//                                         return done(null, user);
//                                     });
//                                 }
        
//                                 return done(null, user); // user found, return that user
//                             } else {
//                                 // if there is no user, create them
//                                 // var newUser            = new userModel();
        
//                                 // newUser.facebook.id    = profile.id;
//                                 // newUser.facebook.token = token;
//                                 // newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
//                                 // newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();
        
//                                 // newUser.save(function(err) {
//                                 //     if (err)
//                                 //         return done(err);
                                        
//                                 //     return done(null, newUser);
//                                 // });
//                                 console.log(profile);
//                             }
//                         });
        
//                     } else {
//                         // user already exists and is logged in, we have to link accounts
//                         var user            = req.user; // pull the user out of the session
        
//                         user.facebook.id    = profile.id;
//                         user.facebook.token = token;
//                         user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
//                         user.facebook.email = (profile.emails[0].value || '').toLowerCase();
        
//                         user.save(function(err) {
//                             if (err)
//                                 return done(err);
                                
//                             return done(null, user);
//                         });
        
//                     }
//                 });
        
//             }))
        