import React from 'react';
import '../css/NewPost.css';
import verifyJWTGet  from '../fetches';



export default class NewPost extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            postText : "placeholder",
            postAuthor : "placeholder Author",
            postHeadline :"placeholder headline",
            maxPosts : "",
            runnningKey : "",
        }
    }

    componentDidMount(){
        fetch("http://localhost:5000/posts/maxposts").then(response => {
            response.json().then(data => {
                this.setState({
                    maxPosts : data.amount,
                    runnningKey : data.amount,
                });
            })
        });
        if(localStorage.getItem("localNewPost")){
            try{
                const localNewPost = JSON.parse(localStorage.getItem("localNewPost"));
                console.log(`Found local new post in storage: ${localNewPost.headline}`);

            this.setState({
                postText : localNewPost.text,
                postAuthor : localNewPost.author,
                postHeadline : localNewPost.headline
            })
            }
            catch(error){
                alert(error);
            }
            
        }
    }



    handleSubmit = event => {
        event.preventDefault();
        // Do logic for UPDATE on server/DB if JWT is valid
        // do this async and make if/else based on result
        const verifyResult = verifyJWTGet();
        verifyResult.then(result => {
            if(result){
                // handle the submit
                this.doSubmit();
            }
            else{
                // Do not handle the submit, token was invalid
                //alert("JWT token was invalid. Log in again to submit your changes.")
                alert("Session expired. Log in again to submit changes.")
            }
        });
        }

    doSubmit = () => {
        // Logic for actually posting the changes/new post
        if(window.confirm("Do you want to post this new post?")){
            this.sendNewPost();
        }
    }

    handleChange = (event) => {
        console.log(event.target);
        this.setState({
            [event.target.id] : event.target.value,
        }, () => {
            console.log(this.state);
        });

        const localPost = {
            "text": this.state.postText,
            "headline" : this.state.postHeadline,
            "author": this.state.postAuthor
                }
        localStorage.setItem("localNewPost", JSON.stringify(localPost)
        );
    }

    // TODO find maxpostnumber

    sendNewPost = (url = 'http://localhost:5000/posts/makenewpost', data = {
            "key" : this.state.editingPost
        }) => {
            const token = localStorage.getItem('JWT');
            fetch(url, {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin':'*',
                  'Accept': 'application/json; text/plain',
                  'Content-Type': 'application/json',
                  'Authorization' : token,
                },
                body: JSON.stringify({
                  "key" : this.state.editingPost,
                  "newPost" : {
                        "headline" : this.state.postHeadline,
                        "key" : this.state.runnningKey,
                        "text": this.state.postText,
                        "author":this.state.postAuthor,
                        "date": (new Date()).toISOString(),
                        
                            }
                })
              }).then(response => {
                  response.json().then(data => {
                      console.log("response was: " + data);
                  })
              });
    };







    // TODO give postselecter a callbackfunction to tell editor which post is selected
  
    render()
    {
        const newPost = this.state.newPost;
        const {postText, postHeadline, postAuthor} = this.state;
            return(
                <div className="PostEditor">
                        <form onSubmit={this.handleSubmit}>
                            Some form
                            <input id="postText" placeholder="Text" type="text" onChange = {this.handleChange} value={this.state.postText || ""}></input>
                            <input id="postAuthor" placeholder="Author" type="text" onChange = {this.handleChange} value={this.state.postAuthor || ""}></input>
                            <input id="postHeadline" placeholder="Headline" type="text" onChange = {this.handleChange} value={this.state.postHeadline || ""}></input>
                            <input type="submit" value="Submit new post" />
                        </form> 
                </div>
            );
    }  
}