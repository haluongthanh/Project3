const User = require('../models/userModel');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config()
const passport = require('passport')


passport.use(new GoogleStrategy({
        clientID: '920845097228-odn1ltd9i6aa1cup1qtkmc6j4hmkdgl0.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: "/api/v1/auth/google/callback"
    },
    async function(accessToken, refreshToken, profile, cb) {

        try {
            let user = await User.findOne({ authGoogleId: profile.id, authType: "google" });
            if (user) {
                return next(null, user);
            } else {
                user = await User.create({ email: profile.emails[0].value, name: profile.displayName, authGoogleId: profile.id, authType: "google" });
                if (user) {
                    await user.save();
                    return next(null, user);
                }
            }
        } catch (error) {
            console.log(error)
        }

        return cb(null, profile);

    }
));