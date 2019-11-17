import React from 'react';
import EditorPost from './EditorPost';



export default class PostSelecter extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            selectedPost : null,
            amountOfPosts : 0,
            maxPosts : 0,
            posts : [],
            btnShowMore : "Show more posts",
            runnningKey : 0,
        }
        
    }

    componentDidMount(){
    }

    handleClick= (e) => {
        // Calls callback-function passed through props from PostEditor
        this.props.callBack(e);
    }

    createPosts= () => {
        // check if there are any posts in localstorage
        if(localStorage.getItem("PostsStored")){
            //alert("Posts are stored");
            // There are posts stored. Check if the session is new
            let lastSession = localStorage.getItem("lastSession");
            // handle times of lastSession, and rerender everything if it is more than 30 minutes ago
        }
        else{
            //alert("No posts are stored in cache");
        }
        // TODO:
        /*
        check DB how many posts exists.
        create no more if postlimit is reached
        */
        //let maxPosts = fetch("http://localhost:5000/posts/maxposts");
        let postsToRender = 0;
        let postsRendered = this.state.amountOfPosts;
        let maxposts = this.state.maxPosts;
        let diff = maxposts - postsRendered;
        /*
        if(this.state.amountOfPosts < this.state.maxPosts){
            switch(diff){
                default:
                    // more than 2, render 3
                    postsToRender = 3;
                    break;
                case (2):
                    postsToRender = 2;
                    break;
                case (1):
                    postsToRender = 1;
                    break;
            }
            */
            if(this.amountOfPosts != maxposts){
            // postsToRender replaced with maxposts to render all posts in the selected. code above also commented out
            let posts = this.state.posts;
            let newKey = this.state.runnningKey;
            for(var i = 0; i<maxposts; i++){
                console.log("Created a post");
                posts.push(<EditorPost className="EditorPost" key={newKey} keyNumber={newKey} callBack = {this.props.callBack}>Hei</EditorPost>);
                newKey = newKey - 1;
            }
    
            console.log(posts);
            this.setState({
                posts : posts,
                amountOfPosts : maxposts,
                runnningKey : newKey,
            });
            if(this.state.amountOfPosts === maxposts){
                this.setState({
                    btnShowMore : " All posts loaded",
                })
            }
            // Store in localStorage that posts have been created
            localStorage.setItem("PostsStored", true);
            console.log("Running key: " + this.state.runnningKey);
            console.log(this.state);
            return(posts);
        }
        else{
            console.log("all posts have been rendered");
            this.setState({
                btnShowMore : "All posts loaded"
            })
        }
    }

    componentDidMount(){
        fetch("http://localhost:5000/posts/maxposts").then(response => {
            response.json().then(data => {
                this.setState({
                    maxPosts : data.amount,
                    runnningKey : data.amount -1,
                });
                this.createPosts();
            })
        });
    }
  
    render(){
        const EditorPosts = this.state.posts;
        const maxPosts = this.state.maxPosts;
        const btnShowMore = this.state.btnShowMore;
        const listItems = EditorPosts.map((editorPost) => <li key={editorPost.key}>{editorPost}</li>);

        return(
            <div className="post-selecter">
                <ul className="list-of-editor-posts">
                  {listItems}
                </ul>
            </div>
        );
    }
}