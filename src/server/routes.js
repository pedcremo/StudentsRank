var router = require('express').Router();
var four0four = require('./utils/404')();
var data = require('./data');

var auth = require('./authentication');
var passport = require('passport');
var fs = require('fs');
//router.get('/people', getPeople);
//router.get('/person/:id', getPerson);


//===== NEW PERE ===========================================================
router.get('/getStudents', getStudents);
router.get('/getGradedTasks', getGradedTasks);

router.post('/saveStudents',function(req, res) {
  if (req.isAuthenticated()) {
    fs.writeFile('src/server/data/' + req.user.id + '/students.json', JSON.stringify(req.body), 'utf8', (err) => {
      if (err) {
        throw err;
      }
      console.log('The file has been saved!');
    });
      res.send('OK');
    }
});

router.post('/saveGradedTasks',function(req, res) {
  if (req.isAuthenticated()) {
    //data.saveGradedTasks(req.body);
    fs.writeFile('src/server/data/' + req.user.id + '/gradedtasks.json', JSON.stringify(req.body), 'utf8', (err) => {
      if (err) {
        throw err;
      }
      console.log('The file has been saved!');
    });
      res.send('OK');
    }
});

// route to test if the user is logged in or not
router.get('/loggedin', function(req, res) {
  console.log('Logged in EXPRESS' + JSON.stringify(req.user));
  res.send(req.isAuthenticated() ? req.user : '0');
});

// route to log in
router.post('/login', passport.authenticate('local'), function (req, res) {
  console.log('login ' + JSON.stringify(req.user));
  console.log('session ' + JSON.stringify(req.session));
  res.send(req.user);
});

router.get('/loginTwitter',
  passport.authenticate('twitter'));

router.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    console.log('TWITTER login ' + JSON.stringify(req.user));
    res.redirect('/');
  });

router.get('/loginFacebook',
  passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    console.log('Facebook login ' + JSON.stringify(req.user));
    res.redirect('/');
  });

router.get('/loginGoogle',
   passport.authenticate('google', { scope: ['profile'] }));//passport.authenticate('google'));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    console.log('Google login ' + JSON.stringify(req.user));
    res.redirect('/');
  });

// route to log out
router.get('/logout', function(req, res) {
  req.logOut();
  res.redirect('/');
  //res.send(200);
});
//========= END NEW ====================================================

router.get('/*', four0four.notFoundMiddleware);

module.exports = router;

//////////////

/*function getPeople(req, res, next) {
  res.status(200).send(data.people);
}*/
function getStudents(req, res, next) {  
  //var myObj = require('./data/' + req.user.id + '/students.json');
  fs.readFile('src/server/data/' + req.user.id + '/students.json',function(err, data) {
         if(err) {
            console.log(err);
         }
         console.log(data);
         res.status(200).send(data);
  });
  //res.status(200).send(myObj);
}
function getGradedTasks(req, res, next) {
  //var myObj = require('./data/' + req.user.id + '/gradedtasks.json');
  //res.status(200).send(myObj);
  fs.readFile('src/server/data/' + req.user.id + '/gradedtasks.json',function(err, data) {
         if(err) {
            console.log(err);
         }
         console.log(data);
         res.status(200).send(data);
  });
}

/*function getPerson(req, res, next) {
  var id = +req.params.id;
  var person = data.people.filter(function(p) {
    return p.id === id;
  })[0];

  if (person) {
    res.status(200).send(person);
  } else {
    four0four.send404(req, res, 'person ' + id + ' not found');
  }
}*/
