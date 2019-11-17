import React from 'react';

class DataFetchingComponent extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            isloaded : false,
            json : null,
            externalApi : null,
        };
    }

    componentDidMount(){
        this.fetchData();
        this.fetchFromApi();
    }

    fetchData = () => {
        try {
            console.log("Attempting to fetch...");
            fetch('/homepage/json')
            .then(res => {
                return res.json();
              })
              .then(json => {
                this.setState({
                    isloaded : true,
                    json : json
                });
              })
        } catch (error) {
            console.log("something went wrong fetching");
        }
    }

    fetchFromApi = () => {
        fetch('http://localhost:5000/homepage').then(res => res.text()).then(res => this.setState(
            {
                externalApi : res
            }
        )).catch(err => console.log(err));
    }

    render(){
        const {isloaded, json, externalApi} = this.state;
        console.log(this.state);
        if(!isloaded){
            return(<div>
                <p>
                    No data was loaded.
                </p>
            </div>)
        }
        else {return (
        <div>
            <p>{json.testData}</p>
            <p>hei{externalApi}</p>
        </div>
        );
        }
    }
}

export default DataFetchingComponent;