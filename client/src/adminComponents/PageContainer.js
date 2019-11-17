import React from 'react';
import Header from './Header';
import Login from './Login';
import PostEditor from './PostEditor';
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
                        <h1 className="bodobauta">Bodø Bauta Løpeklubb Admin</h1>
                        <Login />
                    </div>
                )
                case "posteditor":
                    return(
                        <div className="wrapper">
                            <Header callBack = {this.headerCallBackFunction}/>
                            <h1 className="bodobauta">Lag nye eller endre eksisterende innlegg</h1>
                            <PostEditor/>
                        </div>
                    )
            default:
                return(
                    <div className="PageContainer">
                        <Header callBack = {this.headerCallBackFunction}/>
                        <h1>Bodø Bauta Løpeklubb Admin</h1>
                        <Login />
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