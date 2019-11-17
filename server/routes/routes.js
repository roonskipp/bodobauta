const express = require('express');
const jsonData = require('./testData.json');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const {ensureAuthenticated} = require('../config/auth');

const User = require('../models/User');

// init router
const router = express.Router()
router.use(cors());

// middleware function - must call next() at the end
router.use((req, res, next) => {
    console.log("req: " + req.url);
    next();
});

// default from /

router.get('/', (req, res) => {
    console.log("Inside website '/'. Loggin req.sessionID below.");
    console.log("req.sessionID: " + req.sessionID);
    console.log("Website received GET request");
    res.send({
      res: 'default page from router',
    });
});

// Some other endpoint
router.get('/hello', ensureAuthenticated, function(req, res) {
    res.sendFile(__dirname + '/tempPages/hello.html');
}
);

router.get('/dashboard', ensureAuthenticated, function(req, res) {
  res.sendFile(__dirname + '/tempPages/dashboard.html');
}
);

/*
router.get('/login', (req, res) => {
    res.sendFile(__dirname + '/tempPages/form.html');
})
*/
router.get('/register', (req, res) => {
    res.sendFile(__dirname + '/tempPages/formRegister.html');
})

router.post('/logout', ensureAuthenticated, (req, res) =>{
    req.logout();
    res.redirect('/admin/login');
})

router.post('/newpost', ensureAuthenticated, (req, res) =>{
  console.log(req.body);
  res.redirect('/admin/newpost');
})

router.get('/newpost', ensureAuthenticated, (req, res) => {
  res.sendFile(__dirname + '/tempPages/newpost.html');
});

router.post('/login',
 passport.authenticate('local',
  {
    //successRedirect: '/admin/dashboard',
    //failureRedirect: '/admin/login',
    failureFlash: true }
    ), (req, res) => {
      // Successfully logged in ! create a JWT Token for the user to store locally
      res.send(JSON.stringify({"LoginAttempt" : true,
      "jwt" : genToken(req.body)
    }));
      console.log(req.body);
      console.log("Login success, sending data");
      console.log(__dirname);
    }
);


router.post('/register', (req, res) => {
  console.log(req.body);
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
                  res.redirect('admin/newpost');
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
   failureRedirect: '/admin/login',
    failureFlash: true }
    )
);
// some testData in json format
router.get('/json', (req, res) => {
    console.log("sending json:" + JSON.stringify(jsonData));
    res.send(jsonData);
})


router.post('/verify', (req, res) => {
  console.log("received a post to verify");
  console.log("data was: " + req.body.JWT);
  var receivedToken = req.body.JWT;
  var tokenWasValid = verifyToken(receivedToken);
  console.log(tokenWasValid);
  if(tokenWasValid){
    res.send(JSON.stringify({"ValidJWT" : true}));
  }
  else{
    res.send(JSON.stringify({"ValidJWT": false}))
  }
}); 

router.get('/amiverified', (req, res) => {
  var receivedToken = req.headers.authorization;
  console.log("header key: " + receivedToken);
  var tokenWasValid = verifyToken(receivedToken);
  console.log(tokenWasValid);
  if(tokenWasValid){
    res.send(JSON.stringify({"res" : true}))
  }
  else{
    console.log("Lets redirect");
    res.send(JSON.stringify({"res": false}));
    //res.send(JSON.stringify({"res" : false}));
  }
});

router.get('/about', function (req, res) {
    res.send('About birds');
  });

genToken = (payload) => {
  var token = jwt.sign(payload, key, signOptions)
  return token;
}

verifyToken = (token) => {
  try{
    var legit = jwt.verify(token, key, verifyOptions)
    return legit;
  }
  catch(err){
    return false;
  }
  
}

var verifyOptions = {
  issuer:  "bodoBauta",
  subject:  "admin",
  audience:  "admin",
  expiresIn:  "1m",
  algorithm:  "HS256"
 };

var key = "hemmelig"

var signOptions = {
  issuer:  "bodoBauta",
  subject:  "admin",
  audience:  "admin",
  expiresIn:  "1m",
  algorithm:  "HS256"
 };





module.exports = router;