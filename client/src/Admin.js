import React from 'react';
import PageContainer from './adminComponents/PageContainer';

const App = () => {
    const url = "http://localhost:5000/admin/";
    fetch(url, {method: 'GET',
                 mode: 'cors', 
                 headers: {
                    'Access-Control-Allow-Origin':'*',
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json'
                    }
                }).catch(error => {
                    console.log(error);
                    //alert("GET failed")
                }).then(
                    res => res.json()).then(response => {
                        //alert("Loaded ok.");
                    }).catch(error => {
                        console.log(error);
                        //alert("Failure GET!");
                    });
  return (
        <div className = "App">
            <PageContainer />
        </div>
  );
}

export default App;
