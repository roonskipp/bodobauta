const express = require('express');

// init router
const router = express.Router()

// middleware function - must call next() at the end
router.use((req, res, next) => {
    console.log("Hello this is the middleware function");
    next();
});

// default from /
router.get('/', (req, res) => {
    res.send('default page from router');
});

// Some other endpoint
router.get('/hello', function(req, res) {
    res.send('homepage');
}
);

router.get('/about', function (req, res) {
    res.send('About birds')
  })

module.exports = router;