var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;

//==================================================================
// Define the strategy to be used by PassportJS
passport.use(new LocalStrategy(
  function(username, password, done) {
    if (username === 'admin' && password === 'admin') { // stupid example
      return done(null, {id:'343242',displayName: 'admin'});
    }
    if (username === 'pedcremo' && password === 'hola') { // stupid example
      return done(null, {id:'333342',displayName: 'Pere Crespo'});
    }

    return done(null, false, { message: 'Incorrect username.' });
  }
));

passport.use(new TwitterStrategy({
    consumerKey: 'O7irwQHhR39bk5oWuYK7KgBK5',
    consumerSecret: 'brTcGHZI8SQPz1U08HAm5VeSnjatuASLF6EyD1hdpkmlMvk2Me',
    callbackURL: '/api/auth/twitter/callback'
  },
  function(token, tokenSecret, profile, cb) {
    return cb(null, profile);
  }
));

passport.use(new FacebookStrategy({
    clientID: '408509946157515',
    clientSecret: 'fbb3f995d1d03972cf56f6a825b395b0',
    callbackURL: '/api/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'name', 'gender','photos']
  },
  function(accessToken, refreshToken, profile, cb) {
    /*User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });*/
    return cb(null, profile);
  }
));

passport.use(new GoogleStrategy({
    clientID: '978656105531-8oovnul0pvkjff2covvv2n4s5rc9iktf.apps.googleusercontent.com',
    clientSecret: '9gN5wl3pvOcXUrwNUDJH1vo6',
    callbackURL: '/api/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log('PROFILE GOOGLE ' + profile.id)
    //User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return cb(null, profile);
    //});
  }
));

// Serialized and deserialized methods when got from session
passport.serializeUser(function(user, done) {
  done(null, user);
  console.log('SERIALIZE USER');
});

passport.deserializeUser(function(user, done) {
  console.log('DESERIALIZE USER');
  done(null, user);
});

// Define a middleware function to be used for every secured routes
var auth = function(req, res, next) {
  console.log('Session: %j', req);
  if (!req.isAuthenticated()) {
    res.send(401);
  }else {
    next();
  }
};

module.exports = auth;
