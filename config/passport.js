const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const user = require('../models/User');
const User = require('../models/User');

module.exports = function (passport){
   passport.use(new GoogleStrategy({
       clientID: process.env.GOOGLE_CLIENT_ID,
       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
       callbackURL: '/auth/google/callback'
   }, async (accessToken, refreshToken, profile, done) => {
        // console.log(profile); ...This will give you an idea of how we are getting our values below
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.familyName,
            lastName: profile.name.givenName,
            image: profile.photos[0].value
        }

        try {
            // first we look for the user if he/she exists
            let user = await User.findOne({googleId: profile.id});

            // if the user exists we want to call null for the error and pass the user in
            if(user){
                done(null, user);
            } else {
                // else if there is no user then we want to create one
                user = await User.create(newUser);
                done(null, user);
            }
        } catch (err) {
            console.error(err);
        }
   }))

   passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
});
}