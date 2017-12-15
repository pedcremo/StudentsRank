var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var fs = require('fs');
var mkdirp = require('mkdirp');
//==================================================================
// Define the strategy to be used by PassportJS
passport.use(new LocalStrategy(
  function(username, password, done) {
    if (username === 'admin' && password === 'admin') { // stupid example
      let user = readSubjectsUser('343242');
      user.id = '343242';
      user.displayName = 'admin';
      return done(null,user);
    }
    if (username === 'pedcremo' && password === 'hola') { // stupid example
      let user = readSubjectsUser('333342');
      user.id = '333342';
      user.displayName = 'Pere Crespo';
      //return done(null,JSON.stringify(user));
      return done(null,user);
    }

    return done(null, false, { message: 'Incorrect username.' });
  }
));
function readSubjectsUser(idUser) {
  if (fs.existsSync('src/server/data/' + idUser + '/subjects.json')) {
    let content = fs.readFileSync('src/server/data/' + idUser + '/subjects.json');
    return JSON.parse(content);
  }else {
    let subjects = {'defaultSubject':'default','subjects':[]};
    mkdirp('src/server/data/' + idUser, function (err) {
      if (err) {
        console.error(err);
      }else {
        fs.writeFileSync('src/server/data/' + idUser + '/subjects.json', JSON.stringify(subjects), 'utf8', (err) => {
          if (err) {
            throw err;
          }
          console.log('The file subjects.json has been saved!');
        });
        console.log('dir created');
      }
    });
    return subjects;
  }
}
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
    clientID: '332430709061-iqlrm5kcr4v0qipb43almus8ta66lh9m.apps.googleusercontent.com',
    clientSecret: 'S-caPNjls6bBOP7lIJAskLpN',
    callbackURL: '/api/auth/google/callback',
    passReqToCallback:true
  },
  /*function(accessToken, refreshToken, profile, cb) {
    //console.log('PROFILE GOOGLE ' + profile.id);
    return done(null,cb);
  }*/
  function(request, accessToken, refreshToken, profile, done) {
    //User.findOrCreate({ googleId: profile.id }, function (err, user) {
      if (profile._json.domain === 'iestacio.com') {
        let subjects = readSubjectsUser(profile.id);
        profile.defaultSubject = subjects.defaultSubject;
        profile.subjects = subjects.subjects;
        return done(null, profile); 
      }else {
        return done(null, false, { message: 'Incorrect username. expected user with domain iestacio.' });
      }
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
