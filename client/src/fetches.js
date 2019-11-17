export {verifyJWTGet as default};

function verifyJWTGet(event){

    const url = "http://localhost:5000/admin/amiverified"
    const data = {"JWT": localStorage.getItem('JWT')};
    //const token = "invalidToken"
    const token = localStorage.getItem('JWT');
    alert(JSON.stringify(data), url);
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
                    alert("Something went wrong posting JWT");
                    return false;
                }).then(
                    res => res.json()).then(response => {
                        if(response.res){
                            //alert("JWT was valid!");
                            return true;
                        }
                        else{
                            alert("Expired JWT or invalid.");
                            return false;
                        }
                    }).catch(error => {
                        console.log(error);
                        alert("Failure getting jwtresult from response.");
                        return false;
                    })
        return fetchPromise;
}