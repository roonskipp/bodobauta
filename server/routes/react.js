const express = require('express');
const jsonData = require('./testData.json');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const {ensureAuthenticated} = require('../config/auth');

const User = require('../models/User');

//const reactApp = require('../../client/src/App');

// init router
const router = express.Router()

// middleware function - must call next() at the end
router.use((req, res, next) => {
    console.log("req: " + req.url);
    next();
});

// default from /
router.get('/', (req, res) => {
    res.send('default page from router');
});

// try to render react
/*
router.get('/index', (req, res) => {
    res.send(reactApp)
})
*/

// Some other endpoint
router.get('/hello', ensureAuthenticated, function(req, res) {
    res.sendFile(__dirname + '/tempPages/hello.html');
}
);

router.get('/login', (req, res) => {
    res.sendFile(__dirname + '/tempPages/form.html');
})

router.get('/register', (req, res) => {
    res.sendFile(__dirname + '/tempPages/formRegister.html');
})

router.post('/logout', (req, res) =>{
    req.logout();
    res.redirect('/homepage/login');
})

router.post('/login',
 passport.authenticate('local',
  { successRedirect: '/homepage/hello',
   failureRedirect: '/homepage/login',
    failureFlash: true }
    )
);


router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
  
    if (!name || !email || !password || !password2) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }
  
    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
  
    if (errors.length > 0) {
        /*
      res.send('register', {
        errors,
        name,
        email,
        password,
        password2
      });*/
      res.send(errors);
    } else {
      User.findOne({ email: email }).then(user => {
        if (user) {
          errors.push({ msg: 'Email already exists' });
          res.render('register', {
            errors,
            name,
            email,
            password,
            password2
          });
        } else {
          const newUser = new User({
            name,
            email,
            password
          });
  
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                  );
                  res.redirect('admin/login');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }
  });

router.post('/register',
 passport.authenticate('local',
  { successRedirect: '/user',
   failureRedirect: '/homepage/login',
    failureFlash: true }
    )
);
// some testData in json format
router.get('/json', (req, res) => {
    console.log("sending json:" + JSON.stringify(jsonData));
    res.send(jsonData);
})

router.get('/about', function (req, res) {
    res.send('About birds');
  })

module.exports = router;