import React from 'react';
import PostSelecter from './PostSelecter';
import NewPost from './NewPost';
import verifyJWTGet  from '../fetches';



export default class PostEditor extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            postText : "",
            postAuthor : "",
            postHeadline : "",
            newPost : true,
            editingPost : "",
            editingPostDbId: "",
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
                    if(window.confirm("Do you want to post this new post?")){
                        this.doSubmit();
                    }
            }
            else{
                // Do not handle the submit, token was invalid
                alert("JWT token was invalid. Log in again to submit your changes.")
            }
        });
        }

    doSubmit = () => {
        // Logic for actually posting the changes/new post
        this.updatePost();
    }

    handleChange = (event) => {
        console.log(event.target);
        this.setState({
            [event.target.id] : event.target.value,
        });
    }

    editorCallBackFunction = (e) =>{
        console.log("State was:" + this.state.editingPost);
        this.setState({
            "editingPost" : e.postKey,
            "postAuthor" : e.author,
            "postText" : e.text,
            "postHeadline" : e.headline,
            "editingPostDbId" : e.editingPostDbId

        }, () =>{
            console.log("State updated. editingPost is now: " + e.postKey);
            console.log("State updated. editingPostDBid is now: " + e.editingPostDbId);
            // this.updatePost(); pretty sure this should not be called here.
        });
        
        // TODO
        // Implement functionality to load the selected post from the selector
    }

    handleNewPost = (e) =>{
        e.preventDefault();
        this.setState({
            newPost : true,
        });
        //alert("clicked");
    }

    handleEditPost = (e) =>{
        e.preventDefault();
        this.setState({
            newPost : false,
        });
        //alert("clicked");
    }

    handleDelete = (e) =>{
        e.preventDefault();
        const verifyResult = verifyJWTGet();
        verifyResult.then(result => {
            if(result){
                // handle the submit
                    if(window.confirm(`Do you sure you want to delete ${this.state.editingPost}?
                    If it is deleted it can not be recovered.`)){
                        this.deletePost();
                    }
                    
             }
             else{
                // Do not handle the submit, token was invalid
                alert("Session expired. Log in again to submit your changes.")
            }
        });
    }

    deletePost = (url = 'http://localhost:5000/posts/deletepost', data = {
            "dbkey" : this.state.editingPostDbId
        }) => {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin':'*',
                  'Accept': 'application/json; text/plain',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  "key" : this.state.editingPostDbId
                })
              }).then(response => {
                  response.json().then(data => {
                      console.log("response was: " + data);
                      this.setState({
                          editingPost : "",
                          postText: "",
                          postAuthor : "",
                          postHeadline : ""
                      })
                  })
              });
    };

    updatePost = (url = 'http://localhost:5000/posts/updatepost', data = {
            "key" : this.state.editingPost
        }) => {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin':'*',
                  'Accept': 'application/json; text/plain',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  "key" : this.state.editingPost,
                  "update" : { 
                        "text": this.state.postText,
                        "headline" : this.state.postHeadline
                    }
                })
              }).then(response => {
                  response.json().then(data => {
                      console.log("response was: " + data);
                      this.setState({
                          postText: data.postText,
                          postAuthor : data.postAuthor,
                          postHeadline : data.postHeadline
                      })
                  })
              });
    };







    // TODO give postselecter a callbackfunction to tell editor which post is selected
  
    render(){
        const newPost = this.state.newPost;
        const {postText, postHeadline, postAuthor} = this.state;
        if(newPost){
            return(
                <div className="posteditor">
                    <div className="edit-or-new-buttons">
                        <button onClick={this.handleEditPost}>Edit post</button>
                        <button onClick={this.handleNewPost}>New post</button>
                        <p className="new-post">Lag et nytt innlegg</p>
                    </div>
                        <NewPost callBack = {this.editorCallBackFunction}/>
                </div>
            );
        }
        else{
            return(
                <div className="posteditor">
                    <div className="edit-or-new-buttons">
                        <button onClick={this.handleEditPost}>Edit post</button>
                        <button onClick={this.handleNewPost}>New post</button>
                        <p className="existing-posts">Eksisterende innlegg</p>
                    </div>

                        <PostSelecter callBack = {this.editorCallBackFunction}/>
                    <div className="post-form-wrapper">
                        <form className="post-form" onSubmit={this.handleSubmit}>
                            <textarea className="input-text-box" id="postText" placeholder="Text" type="text" value={this.state.postText || ""} onChange = {this.handleChange}></textarea>
                            <p className="p1">Forfatter</p>
                            <input className ="input-author"id="postAuthor" placeholder="Author" type="text" value={this.state.postAuthor || ""} onChange = {this.handleChange}></input>
                            <p className="p2">Overskrift</p>
                            <input className ="input-headline"id="postHeadline" placeholder="Headline" type="text" value={this.state.postHeadline || ""} onChange = {this.handleChange}></input>
                            <input className ="input-submit-btn"type="submit" value="Submit changes" />
                        </form> 
                        <button className="post-delete-btn" id="deleteButton" onClick={this.handleDelete}>Delete post</button>

                    </div>
                </div>
            );
        }
        
    }
}