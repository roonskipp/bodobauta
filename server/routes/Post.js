const express = require('express');
const router = express.Router();
//const bcrypt = require('bcryptjs');
//const passport = require('passport');
// Load post model
const fetch = require('node-fetch');
const Post = require('../models/Post');
//const { forwardAuthenticated } = require('../config/auth');

// Login Page
//router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
//router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Post a new post


// query for maxposts
router.get('/maxposts', (req, res) => {
  Post.find({}).then(posts => {
    let amount = {"amount" : posts.length};
    console.log("sending: " + amount);
    res.json(amount)
  })
})

// query for post
router.post('/post', (req, res) => {
  
  const key = req.body.key;
  console.log("Looking for post with key: " + key);
  Post.find({}).sort({date:-1}).limit(2).then(post => {
      if(post){
          console.log(post);
          console.log("Found post with text: " + post.text + " -> and key: " + post.key);
          res.send(post)
      }
      else{
          console.log("Found no post with key: " + key);
      }
  })
});

// post for newpost
router.post('/newpost', (req, res) => {
  const key = req.body.key;
  /* this key explained
  sum(all) keys = X
  key x-5 will be post number x-5, where x is the latest added post.
  */
 
  Post.find().sort({date:1}).then(post => {
      if(post){
          console.log(`post: ${post[key]}`);
          console.log("Found post with text: " + post.text + " -> and key: " + post.key);
          res.send(post[key])
      }
      else{
          console.log("Found no post with key: " + key);
      }
  })
});

// post for newpost
router.post('/makenewpost', (req, res) => {
  const token = req.headers.authorization
  if(verifyJWT(token)){
  const key = req.body.key;
  const newPost = new Post(req.body.newPost);
  newPost.save((err, post) => {
    if(err){
      res.status(500).send(JSON.stringify({"response": "Something went wrong saving post to database"}));
      return console.error(err);
    } 
    console.log("Saved " + post.headline + " to database");
    res.status(200).send(JSON.stringify({"response":"Saved post to database"}));
  })
  }
  else{
    console.log("An error happened trying to verify JWT for NewPost");
    res.status(500).send(JSON.stringify({"response": "There was something wrong with your JWT"}));
  }
});

router.post('/updatepost', (req, res) => {
  const token = req.headers.authorization
  if(verifyJWT(token)){
  const key = req.body.key;
  Post.findOne({key: key}).then(post => {
    if(post){
      console.log("Found post with postkey: " + key + " and text: "+ post.text + "\nAttempting to update it.");
    }
    else{
      console.log("Found no post with key: " + key);
    }
  })
  Post.findOneAndUpdate({key: key}, req.body.update).then(post => {
    if(post){
      console.log("Found post for updating with key: " + key + ". Text is now: " + post.text);
      res.send(post);
    }
    else{
      console.log("Somehow found no post with that key: " + key);
    }
  })
}else{
  console.log("An error happened trying to verify JWT for deletePost");
  res.status(500).send(JSON.stringify({"response": "There was something wrong with your JWT"}));
}}
);

router.post('/deletepost', (req, res) => {
  const token = req.headers.authorization
  if(verifyJWT(token)){
    const key = req.body.key;
    //Based on loaded key in client figure out which post is to be deleted...

    Post.findOne({_id: key}).then(post => {
      if(post){
        console.log("/deletepost: Found post with postkey: " + key + " and text: "+ post.text + "\nAttempting to delete it.");
      }
      else{
        console.log("/deletepost: Found no post with key: " + key);
      }
    })
    Post.findOneAndDelete({_id: key}).then(post => {
      if(post){
        console.log("Deleted post with key: " + key);
        res.send(post);
      }
      else{
        console.log("/deletepost: Somehow found no post with that key: " + key);
      }
    })
  }
  else{
    console.log("An error happened trying to verify JWT for deletePost");
    res.status(500).send(JSON.stringify({"response": "There was something wrong with your JWT"}));
  }
});

verifyJWT = (token) => {
  const url = "http://localhost:5000/admin/amiverified"
    //event.preventDefault();
    const fetchPromise = fetch(url, {method: 'GET',
                 headers: {
                    'Access-Control-Allow-Origin':'*',
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization' : token 
                    },
                }).catch(error => {
                    console.log(error);
                    return false;
                }).then(
                    res => res.json()).then(response => {
                        if(response.res){
                            console.log("NewPost's Token was valid");
                            return true;
                        }
                        else{
                            console.log("NewPost's token is Expired JWT or invalid.");
                            return false;
                        }
                    }).catch(error => {
                        console.log(error);
                        console.log("NewPost's jwt token --> Failure getting jwtresult from response.");
                        return false;
                    })
        return fetchPromise;
}



module.exports = router;