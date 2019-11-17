import React from 'react';
import '../css/Login.css';
const loginEndpoint = "http://localhost:5000/admin/login";

export default class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            Email : "",
            Password : "",
            LoggedIn : false,
        }
    }

    handleChange = (event) => {
        console.log(event.target);
        this.setState({
            [event.target.id] : event.target.value,
        });
        console.log(event.target.Email);
    }
    handleSubmit = event => {
        event.preventDefault();
        const url = "http://localhost:5000/admin/login";
        const data = {"email" : this.state.Email,
                    "password" : this.state.Password};
        //alert(JSON.stringify(data));
        fetch(url, {method: 'POST',
                     mode: 'cors', 
                     headers: {
                        'Access-Control-Allow-Origin':'*',
                        'Accept' : 'application/json',
                        'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    }).catch(error => {
                        console.log(error);
                        alert("Login failed")
                    }).then(
                        res => res.json()).then(response => {
                            if(response.LoginAttempt){
                                window.location.reload();
                                //alert("Success");
                            }
                            this.setState({LoggedIn : response.LoginAttempt})
                            console.log(response);
                            // save JWT token in local storage
                            localStorage.setItem('JWT', response.jwt);
                            console.log(localStorage.getItem('JWT'));
                        }).catch(error => {
                            console.log(error);
                            alert("Failure logging in!");
                        })
    };

    handleVerifyBtnClick = event => {
        event.preventDefault();
        if(localStorage.getItem('JWT') == null){
            alert("No token stored in cache");
            return;
        }
//localStorage.getItem('JWT')
        const url = "http://localhost:5000/admin/verify"
        const data = {"JWT": localStorage.getItem('JWT')};
        alert(JSON.stringify(data), url);
        //event.preventDefault();
        fetch(url, {method: 'POST',
                     mode: 'cors', 
                     headers: {
                        'Access-Control-Allow-Origin':'*',
                        'Accept' : 'application/json',
                        'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    }).catch(error => {
                        console.log(error);
                        alert("Something went wrong posting JWT")
                    }).then(
                        res => res.json()).then(response => {
                            if(response.ValidJWT){
                                alert("JWT was valid!");
                            }
                            else
                            {alert("JWT invalid! Perhaps it expired")}
                            console.log(response.ValidJWT);
                        }).catch(error => {
                            console.log(error);
                            alert("Failure getting jwtresult from response.");
                        })
    }

    handleSecondVerify = (event) => {

        const url = "http://localhost:5000/admin/amiverified"
        const data = {"JWT": localStorage.getItem('JWT')};
        //const token = "invalidToken"
        const token = localStorage.getItem('JWT');
        //alert(JSON.stringify(data), url);
        //event.preventDefault();
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
                                alert("JWT was valid!");
                            }
                            else{
                                alert("Expired JWT or invalid.");
                            }
                        }).catch(error => {
                            console.log(error);
                            alert("Failure getting jwtresult from response.");
                        })
    }


    /*
            queryPost = (url = 'http://localhost:5000/admin/login', data = {
                'Access-Control-Allow-Origin':'*',
                "email" : this.state.Email, // Try to use hardcoded
                "password" : this.state.Password // Try to use hardcoded
            }) => {
                fetch(url, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                      'Accept': 'application/json; text/plain',
                      'Content-Type': 'application/json',

                    },
                    body: data,
                  }).then(response => {
                      response.json().then(response => {
                          //data = data[0]
                          console.log(response);
                      })
                  })
                };
    */


    render(){
        return(
            <div className ="LoginForm">
            <div>
                <form onSubmit = {this.handleSubmit}>
                    <label>
                        Admin Login:
                        <input id="Email" type="text" value={this.state.Email} onChange = {this.handleChange}/>
                    </label>
                    <label>
                        Password:
                        <input id="Password" type="password" value={this.state.Password} onChange = {this.handleChange}/>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
            {/*<div className="VerifyButton">
                <button onClick={this.handleVerifyBtnClick}>Verify my JWT</button>
            </div>
            <div>
                <button onClick={this.handleSecondVerify}>Another verify</button>
        </div>*/}

            </div>
        )
    }
}