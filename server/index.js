// SERVER CODE

const express = require('express');
const config = require('./config/config');
const router = require('./routes/routes.js');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const react = require('./routes/react.js');
const postroute = require('./routes/Post.js');
const cors = require('cors');
const uuid = require('uuid/v4')


var flash = require('connect-flash');
var session = require("express-session");
var bodyParser = require("body-parser");


// Passport Config
require('./config/passport')(passport);

// Init server
const app = express();

// Init session support
//app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'build')))
app.use(session({
    key: 'user_sid',
    secret: 'goN6DJJC6E287cC77kkdYuNuAyWnz7Q3iZj8',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Init cors
app.use(cors());


// Init flash for flash messages upon login
app.use(flash());

// DB Config
const db = require('./config/keys').MongoURI;

// Connect to MongoDB
mongoose
.connect(db, {
useUnifiedTopology: true,
useNewUrlParser: true,
})
.then(() => console.log('DB Connected!'))
.catch(err => {
console.log("DB Connection Error: " + err.message);
});
//mongoose.connect(db, {useNewUrlParser: true}).then(console.log("MongoDB connected...")).catch(err => console.log(err));
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Start server
app.listen((config.PORT), () => 
console.log(`Server is listening on port: ${config.PORT}.`)
);

// set default page
app.get('/', (req, res) => {
    res.sendFile('/Users/Tobias/git/bodobauta/client/public/index.html');
});

// // Serve static build
// app.get('/*', function (req, res) {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// Make the server use router from routes.js
app.use('/admin', router);

// Make the server use react routes from ./routes/react.js
//app.use('/react', react);

// Make the server use react routes from ./routes/react.js
app.use('/posts', postroute);