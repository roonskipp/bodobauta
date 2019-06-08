const express = require('express');
const config = require('./config');
const router = require('./routes/routes.js');


// Init server
const app = express();

// Start server
app.listen((config.PORT), () => 
console.log(`Server is listening on port: ${config.PORT}.`)
);

// set default page
app.get('/', (req, res) => {
    res.send("/default page")
});

// Make the server use router from routes.js
app.use('/homepage', router);