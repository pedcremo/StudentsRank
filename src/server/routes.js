var router = require('express').Router();
var four0four = require('./utils/404')();
var data = require('./data');
 
var auth = require('./authentication');
var passport = require('passport');
var fs = require('fs');
var formidable = require('formidable');
var mkdirp = require('mkdirp');
const FileAsync = require('lowdb/adapters/FileAsync');
// Create database instance and start server
const low = require('lowdb');
const adapter = new FileAsync('src/server/data/shares.json');
let dbase;
low(adapter)
.then((db) => {
  db.defaults({ shares: [] }).write();
  return db;
})
.then((db) => {
  dbase = db;
  //next();
});

//db.defaults({'shares': [] })
//  .write();

//===== NEW PERE ===========================================================
router.get('/getStudents', getStudents);
router.get('/getGradedTasks', getGradedTasks);
router.get('/getAttitudeTasks', getAttitudeTasks);
router.get('/getSettings', getSettings);
router.get('/changeSubject', changeSubject);
router.get('/addSubject',addSubject);
router.get('/getSharedGroups',getSharedGroups);

function changeSubject(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("changeSubject ->" + req.query.newsubject);
    req.user.defaultSubject = req.query.newsubject;
    //req.user.subjects.push(req.query.newsubject);
    let jsonSubjects = {};
    jsonSubjects.defaultSubject = req.query.newsubject;
    jsonSubjects.subjects = req.user.subjects;
    fs.writeFile('src/server/data/' + req.user.id + '/subjects.json', JSON.stringify(jsonSubjects), 'utf8', (err) => {
        if (err) {
          throw err;
        }       
       console.log('The file subjects.json has been saved !');
    });
    //passport.serializeUser
    res.status(200).send("OK");
  }
}

router.post('/uploadImage', uploadImage);
 
router.post('/saveStudents',function(req, res) {
  if (req.isAuthenticated()) {
    fs.writeFile('src/server/data/' + req.user.id + '/' + req.user.defaultSubject + '/students.json', JSON.stringify(req.body), 'utf8', (err) => {
      if (err) {
        throw err;
      }
      console.log('The file has been saved!');
      // Data is automatically saved to localStorage
      let numStudents = req.body.length;
      if (!dbase.get('shares').find({'defaultSubject': req.user.defaultSubject}).value()) {
        dbase.get('shares')
        .push({'defaultSubject':req.user.defaultSubject,'src':'src/server/data/' + req.user.id + '/' + req.user.defaultSubject + '/students.json','hits':numStudents})
        .write();
      }else{
        dbase.get('shares')
        .find({'defaultSubject':req.user.defaultSubject})
        .assign({'hits':numStudents})
        .write();
      }
      
    });
      res.send('OK');
    }
});
 
router.post('/saveGradedTasks',function(req, res) {
  if (req.isAuthenticated()) {
    fs.writeFile('src/server/data/' + req.user.id + '/' + req.user.defaultSubject + '/gradedtasks.json', JSON.stringify(req.body), 'utf8', (err) => {
      if (err) {
        throw err;
      }
      console.log('The file has been saved!');
    });
      res.send('OK');
    }
});

router.post('/saveAttitudeTasks',function(req, res) {
  if (req.isAuthenticated()) {
    fs.writeFile('src/server/data/' + req.user.id + '/' + req.user.defaultSubject + '/attitudetasks.json', JSON.stringify(req.body), 'utf8', (err) => {
      if (err) {
        throw err;
      }
      console.log('The file has been saved!');
    });
      res.send('OK');
    }
});

router.post('/saveSettings',function(req, res) {
  if (req.isAuthenticated()) {
    fs.writeFile('src/server/data/' + req.user.id + '/' + req.user.defaultSubject + '/settings.json', JSON.stringify(req.body), 'utf8', (err) => {
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
   passport.authenticate('google', { 
     scope: ['profile','email'],
     hd: 'iestacio.com'
    }));//passport.authenticate('google'));
 
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
  let id = req.user.id;
  let ds = req.user.defaultSubject;
  console.log("DEFAULTSUBJECT ->" + req.user.defaultSubject);
  if (req.user.defaultSubject !== 'default') {
    if (fs.existsSync('src/server/data/' + req.user.id + '/' + req.user.defaultSubject + '/students.json')) {
      // Do something
      fs.readFile('src/server/data/' + req.user.id + '/' + req.user.defaultSubject + '/students.json',function(err, data) {
        if(err) {
          console.log(err);
        }
        console.log(data);
        res.status(200).send(data);
      });
    }else{
      mkdirp('src/server/data/' + req.user.id + '/' + req.user.defaultSubject, function (err) {
        if (err) console.error(err)
        else console.log('dir created')
      });
      fs.writeFile('src/server/data/' + req.user.id + '/' + req.user.defaultSubject + '/students.json', JSON.stringify([]), 'utf8', (err) => {
        if (err) {
          throw err;
        }
        res.status(200).send('[]');
        console.log('The file has been saved empty!');
      });
    }
  }else {
    res.status(200).send('[]');
  }
 
}
 
function uploadImage(req, res) {
  if (req.isAuthenticated()) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        // `file` is the name of the <input> field of type `file`
        var oldPath = files.myImage.path,
            fileSize = files.myImage.size,
            fileExt = files.myImage.name.split('.').pop(),
            index = oldPath.lastIndexOf('/') + 1,
            fileName = oldPath.substr(index);

        //empty_file
        if (fileSize == 0) {
          //If we are editing the student and don't send a new profile because we don't want to change it
          if (!fs.existsSync('src/server/data/fotos/' + fields.idStudent + '.jpg')) {
            fs.createReadStream('src/server/data/fotos/huevon.jpg').pipe(fs.createWriteStream('src/server/data/fotos/' + fields.idStudent + '.jpg'));
          }
        //Profile file real with size greater than 0
        }else {
          fs.readFile(oldPath, function(err, data) {
              fs.writeFile('src/server/data/fotos/' + fields.idStudent + '.jpg', data, function(err) {
                  fs.unlink(oldPath, function(err) {
                      if (err) {
                        res.status(500);
                        res.send(err);
                      } else {
                        res.status(200);
                        res.json({'success': true});
                      }
                    });
                });
            });
        }
    });
  }
}
 
function getGradedTasks(req, res, next) {
  if (req.user.defaultSubject !== 'default') {
    if (fs.existsSync('src/server/data/' + req.user.id + '/' + req.user.defaultSubject + '/gradedtasks.json')) {
      fs.readFile('src/server/data/' + req.user.id + '/' + req.user.defaultSubject + '/gradedtasks.json',function(err, data) {
              if(err) {
                  console.log(err);
              }
              console.log(data);
              res.status(200).send(data);
        });
    }else {
      mkdirp('src/server/data/' + req.user.id + '/' + req.user.defaultSubject, function (err) {
        if (err) console.error(err);
        else console.log('dir created');
      });
      fs.writeFile('src/server/data/' + req.user.id + '/' + req.user.defaultSubject + '/gradedtasks.json', JSON.stringify([]), 'utf8', (err) => {
        if (err) {
          throw err;
        }
        res.status(200).send('[]');
        console.log('The file has been saved empty!');
      });
    }
  }else {
    res.status(200).send('[]');
  }
}
 
function getAttitudeTasks(req, res, next) {
  let id = req.user.id;
  let ds = req.user.defaultSubject;
  console.log('req.user'+req.user+' id='+id+' ds='+ds);
  if (req.user.defaultSubject !== 'default') {
    if (!fs.existsSync('src/server/data/' + req.user.id + '/' + req.user.defaultSubject + '/attitudetasks.json')) {    
      mkdirp('src/server/data/' + req.user.id + '/' + req.user.defaultSubject, function (err) {
        if (err) console.error(err);
        else console.log('dir created');
      });
      fs.createReadStream('src/server/data/attitudetasks_skeleton.json').pipe(fs.createWriteStream('src/server/data/' + req.user.id + '/' + req.user.defaultSubject + '/attitudetasks.json'));
      let content = fs.readFileSync('src/server/data/attitudetasks_skeleton.json');
      res.status(200).send(content);
    }else {
      fs.readFile('src/server/data/'+ req.user.id + '/' + req.user.defaultSubject + '/attitudetasks.json',function(err, data) {
        if(err) {
            console.log(err);
        }
        console.log(data);
        res.status(200).send(data);
      });
    }
  }else {
    res.status(200).send('[]');
  }
}

function getSettings(req, res, next) {
  let id = req.user.id;
  let ds = req.user.defaultSubject;
  console.log('req.user'+req.user+' id='+id+' ds='+ds);
  if (req.user.defaultSubject !== 'default') {
    if (!fs.existsSync('src/server/data/' + req.user.id + '/' + req.user.defaultSubject + '/settings.json')) {    
      mkdirp('src/server/data/' + req.user.id + '/' + req.user.defaultSubject, function (err) {
        if (err) console.error(err);
        else console.log('dir created');
      });
      fs.createReadStream('src/server/data/settings_skeleton.json').pipe(fs.createWriteStream('src/server/data/' + req.user.id + '/' + req.user.defaultSubject + '/settings.json'));
      let content = fs.readFileSync('src/server/data/settings_skeleton.json');
      res.status(200).send(content);
    }else {
      fs.readFile('src/server/data/'+ req.user.id + '/' + req.user.defaultSubject + '/settings.json',function(err, data) {
        if(err) {
            console.log(err);
        }
        console.log(data);
        res.status(200).send(data);
      });
    }
  }else {
    res.status(200).send({});
  }
}

function getSharedGroups(req, res, next) {
  if (req.isAuthenticated()) {
    let shares = dbase.get('shares')
                .value();
    res.status(200).send(shares);
  }else {
    res.status(401).send("Not authorized");
  }
}

function addSubject(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.query.newSubject) {
      mkdirp('src/server/data/' + req.user.id + '/' + req.query.newSubject, function (err) {
        if (err) console.error(err);
        else console.log('dir created');
      });
      if (req.query.sharedGroup) {
        let item = dbase.get('shares')
        .find({'defaultSubject':req.query.sharedGroup})
        .value();
        let students = JSON.parse(fs.readFileSync(item.src));
        /* We proceed to remove previos attitude tasks from the students */
        students.forEach(function(itemStudent){
          itemStudent[1].attitudeTasks = [];
        });
        //fs.createReadStream(item.src).pipe(fs.createWriteStream('src/server/data/' + req.user.id + '/' + req.query.newSubject + '/students.json'));
        fs.writeFile('src/server/data/' + req.user.id + '/' + req.query.newSubject + '/students.json', JSON.stringify(students), 'utf8', (err) => {
          if (err) {
            throw err;
          }       
         console.log('The file students.json has been copied from a share !');
        });
      }
      let contents = fs.readFileSync('src/server/data/' + req.user.id + '/subjects.json');
      req.user.defaultSubject = req.query.newSubject;
      req.user.subjects.push(req.query.newSubject);
      // Define to JSON type
      let jsonSubjects = JSON.parse(contents);
      jsonSubjects.defaultSubject = req.query.newSubject;
      jsonSubjects.subjects.push(req.query.newSubject);
      fs.writeFile('src/server/data/' + req.user.id + '/subjects.json', JSON.stringify(jsonSubjects), 'utf8', (err) => {
        if (err) {
          throw err;
        }       
       console.log('The file subjects.json has been saved !');
      });
      res.status(200).send('OK');
    }else {
      res.status(401).send("Empty new subject");
    }
  }else {
    res.status(401).send("Not authorized");
  }
}