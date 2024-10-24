const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('./Server/models/userModel'); 
const crypto = require('crypto')

passport.use(new GoogleStrategy({
    clientID: '920845097228-odn1ltd9i6aa1cup1qtkmc6j4hmkdgl0.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "https://zjkmaacmii.ap-southeast-2.awsapprunner.com/api/v1/auth/google/callback",
    scope: ['profile', 'email'],

  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });

      if (user) {
        return done(null, profile);
      } else {
        const password = crypto.randomBytes(10).toString('hex');
        user = await User.create({ 
          email: profile.emails[0].value, 
          name: profile.displayName, 
          password: password 
        });

        if (user) {
          await user.save();
          return done(null, profile);
        }
      }
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.use(new FacebookStrategy({
    clientID: '3500225160290204',
    clientSecret: '4220baf6f379bd8bd947cd4d0769eda9',
    callbackURL: "https://zjkmaacmii.ap-southeast-2.awsapprunner.com/api/v1/auth/facebook/callback",
    profileFields: ['email', 'photos', 'id', 'displayName']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {

      let user = await User.findOne({ email: profile.emails[0].value });

      if (user) {
        return done(null, profile);
      } else {
        const password = crypto.randomBytes(10).toString('hex');
        user = await User.create({ 
          email: profile.emails[0].value, 
          name: profile.displayName, 
          password: password 
        });

        if (user) {
          await user.save();
          return done(null, profile);
        }
      }
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
