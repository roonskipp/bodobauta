import React from 'react';
import Post from './Post';
import '../css/PostsContainer.css';
import { trackPromise } from 'react-promise-tracker';
import { usePromiseTracker } from "react-promise-tracker";
import Loader from 'react-loader-spinner';

const LoadingIndicator = props => {
    const { promiseInProgress } = usePromiseTracker();
    
       return (
          promiseInProgress && 
          <div
            style={{
            width: "100%",
            height: "100",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
            }}
          >
          <Loader type="Oval" color="#55d7ff" height="100" width="100" />
          </div>
      );  
     }

export default class PostsContainer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            amountOfPosts : 0,
            maxPosts : 0,
            posts : [],
            btnShowMore : "Show more posts",
            runnningKey : 0,
        }
    }

    
    // Logic for loading the posts from DB through endpoint on server


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
        console.log(`amount of posts: ${this.state.amountOfPosts}`);
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
                case (0):
                    break;
            }
            let posts = this.state.posts;
            let newKey = this.state.runnningKey;
            for(var i = 0; i<postsToRender; i++){
                console.log("Created a post");
                posts.push(<Post className="Post" key={newKey} keyNumber={newKey}>Hei</Post>);
                newKey = newKey - 1;
            }
    
            console.log(posts);
            this.setState({
                posts : posts,
                amountOfPosts : this.state.amountOfPosts + postsToRender,
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
            localStorage.setItem("postsContainerState", JSON.stringify(this.state));
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
        trackPromise(
        fetch("http://localhost:5000/posts/maxposts").then(response => {
            response.json().then(data => {
                this.setState({
                    maxPosts : data.amount,
                    runnningKey : data.amount -1,
                });
                this.createPosts();
                console.log(`maxposts: ${this.state.maxPosts}`);
            })
        }));
    }


    render(){
        const Posts = this.state.posts;
        const maxPosts = this.state.maxPosts;
        const btnShowMore = this.state.btnShowMore;
        const listItems = Posts.map((post) => <li key={post.key}>{post}</li>);
        console.log("listItems:" + listItems);

        console.log(Posts);
        return(
            <div className="postswrapper">
                {listItems}
                <LoadingIndicator />
                <div className = "showMoreBtn">
                    <button onClick={() => this.createPosts()}>{btnShowMore}</button>
                </div>
            </div>
        )
    }
}

// Gets the state from store, and puts it into props as "text, number and boolean".
// Accessible as "this.props.text, this.props.number, this.props.boolean"
/*
const mapStateToProps = state => {
    return {
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}
*/
// Connects the class to store, making state send its state to props as defined in const mapStateToProps
//export default connect(mapStateToProps, mapDispatchToProps)(StateShowingComponent);