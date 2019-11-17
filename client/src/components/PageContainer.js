import React from 'react';
import PostsContainer from './PostsContainer';
import Header from './Header';
import Login from './Login';


import '../css/GridCss.css';

export default class PageContainer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            amountOfPosts : 5,
            showHome : true,
            showAbout : false,
            showSignUp : false,
            showPostEditor : false,
            showing : "home"
        }
    }

    headerCallBackFunction = (e) =>{
        switch(e.target.id){
            default:
                console.log("headerCallBackFunction was called");
                break;
            case "home":
                console.log("home");
                this.setState({
                    showHome : true,
                    showAbout : false,
                    showSignUp : false,
                    showPostEditor : false

                }, () => {
                    console.log("home: " + this.state.showHome + "\nabout:" + this.state.showAbout + "\nsignup: " + this.state.showSignUp);
                });
                this.updateShowing(e.target.id);
                break;
            case "about":
                console.log("about");
                this.setState({
                    showHome : false,
                    showAbout : true,
                    showSignUp : false,
                    showPostEditor : false

                }, () => {
                    console.log("home: " + this.state.showHome + "\nabout:" + this.state.showAbout + "\nsignup: " + this.state.showSignUp);
                });
                this.updateShowing(e.target.id);
                break;
            case "signup":
                console.log("signup");
                this.setState({
                    showHome : false,
                    showAbout : false,
                    showSignUp : true,
                    showPostEditor : false
                }, () => {
                    console.log("home: " + this.state.showHome + "\nabout:" + this.state.showAbout + "\nsignup: " + this.state.showSignUp);
                });
                this.updateShowing(e.target.id);
                break;
            case "posteditor":
                console.log("posteditor");
                // Logic for handling JWT valid or not
                this.checkValidJWT(e.target.id);
                break;
        }
    }

    checkValidJWT = (tabId) => {

        const url = "http://localhost:5000/admin/amiverified"
        const data = {"JWT": localStorage.getItem('JWT')};
        //const token = "invalidToken"
        const token = localStorage.getItem('JWT');
        //alert(JSON.stringify(data), url);
        //event.preventDefault();
        //var validToken = false;
        fetch(url, {method: 'GET',
                     headers: {
                        'Access-Control-Allow-Origin':'*',
                        'Accept' : 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization' : token 
                        },
                    }).catch(error => {
                        console.log(error);
                        alert("Something went wrong posting JWT")
                    }).then(
                        res => res.json()).then(response => {
                            if(response.res){
                                this.updateShowing(tabId);
                                this.setState({
                                    showHome : false,
                                    showAbout : false,
                                    showSignUp : false,
                                    showPostEditor : true
                                }, () => {
                                    console.log("home: " + this.state.showHome + "\nabout:" + this.state.showAbout + "\nsignup: " + this.state.showSignUp);
                                });
                            }
                            else{
                                alert("Expired JWT or invalid.");
                            }
                        }).catch(error => {
                            console.log(error);
                            alert("Failure getting jwtresult from response.");
                        });
        
    }

    updateShowing = (id) => {
        this.setState({
            showing : id
        }, () => {
            console.log("showing:" + this.state.showing);
        })
    }

    /*
    renderMorePosts = () => {
        console.log("Lets show more posts!")
        this.setState({
            amountOfPosts : this.amountOfPosts + 5
        })
    }
*/
    render(){
        switch(this.state.showing){
            case "home":
                return(
                    <div className="wrapper">
                        <Header callBack = {this.headerCallBackFunction}/>
                       
                        <h1 className="bodobauta">Bodø Bauta Løpeklubb</h1>
                        <p className ="last-updates">Siste oppdateringer fra klubben</p>
                        <PostsContainer amountOfPosts={this.state.amountOfPosts}/>
                    </div>
                )
            case "about":
                return(
                    <div className="wrapper">
                        <Header callBack = {this.headerCallBackFunction}/>
                        <h1>About</h1>
                        <p>The PageContainer will hold content for a page</p>
                    </div>
                )
            case "signup":
                return(
                    <div className="wrapper">
                        <Header callBack = {this.headerCallBackFunction}/>
                        <h1>Signup</h1>
                        <p>The PageContainer will hold content for a page</p>
                    </div>
                )
            default:
                return(
                    <div className="PageContainer">
                        <Header callBack = {this.headerCallBackFunction}/>
                        <h1>Default</h1>
                        <p>The PageContainer will hold content for a page</p>
                        <PostsContainer amountOfPosts={this.state.amountOfPosts}/>
                    </div>
                )
        }
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