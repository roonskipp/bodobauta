import React from 'react';
import '../css/GridCss.css';
import { trackPromise } from 'react-promise-tracker';
import { usePromiseTracker } from "react-promise-tracker";
import Loader from 'react-loader-spinner';


const LoadingIndicator = props => {
    const { promiseInProgress } = usePromiseTracker();
    
       return (
          promiseInProgress && 
          <div className ="grid-loading"
            style={{
            width: "100%",
            height: "100",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
            }}
          >
          <Loader type="ThreeDots" color="#55d7ff" height="100" width="100" />
          </div>
      );  
     }

export default class Post extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            headline : [],
            postId : [],
            key : this.props.keyNumber,
            date : [],
            author : [],
            text : [],
            preClickText : [],
            showFullText : false
        }
        
    }

    /* this.state = {
    headline : "some headline",
            postId : "some postId",
            key : this.props.keyNumber,
            date : "some date",
            author : "some name",
            text : "This will be a post containing all the text written in the given post, but if the text spans over multiple lines not all lines should be visible it should end in some ... and load the rest of the content when you click on the given post.",
            preClickText : "",
            showFullText : false
    }
            */

    componentDidMount(){
        console.log("props:" + this.state.key);
        this.calculatePreClickText();
        this.queryPost();
        this.calculatePreClickText();
    }

    componentWillReceiveProps(){

    }

    calculatePreClickText = () => {
        if(this.state.text.length > 150){
            this.setState({
                preClickText : this.state.text.slice(0, 150)+"..."
            })
        }
        else{
            this.setState({
                preClickText : this.state.text.slice(0, 150)
        })
    }
}

    handleClick = () => {
        console.log(this.state.key);
        this.setState({
            showFullText : !this.state.showFullText
        })
    }

    queryPost = (url = 'http://localhost:5000/posts/newpost', data = {
            "key" : this.state.key
        }) => {
            trackPromise(
            fetch(url, {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin':'*',
                  'Accept': 'application/json; text/plain',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  key: this.state.key
                })
              }).then(response => {
                  response.json().then(data => {
                      //data = data[0]
                      this.setState({
                          headline : data.headline,
                          text : data.text,
                          date : data.date,
                          author : "Skrevet av " + data.author,
                          postId : data.objectId,
                        })
                  }).then(data => {
                      this.calculatePreClickText();
                  })
              }));
            };


    render(){
        const {headline, text, preClickText, showFullText, fetchedText} = this.state;
        if(!showFullText){
        return(
            <div className="grid-posts-container" onClick = {this.handleClick}>
                <LoadingIndicator/>
                <h3 className="grid-title">{headline}</h3>                    
                <p className="grid-date">{this.state.date}</p>
                <p className="grid-author">{this.state.author}</p>
                <p className="grid-post-text-unexpanded">{preClickText}</p>
            </div>
        )
        }
        else{
            return(
                <div className="grid-posts-container" onClick = {this.handleClick}>
                    <h3 className="grid-title">{headline}</h3>                
                    <p className="grid-date">{this.state.date}</p>
                    <p className="grid-author">{this.state.author}</p>
                    <p className="grid-post-text-expanded">{text}</p>
                </div>
            )
        }
    }
}

// Gets the state from store, and puts it into props as "text, number and boolean".
// Accessible as "this.props.text, this.props.number, this.props.boolean"

/*const mapStateToProps = state => {
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