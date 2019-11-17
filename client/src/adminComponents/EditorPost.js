import React from 'react';


import { trackPromise } from 'react-promise-tracker';
import { usePromiseTracker } from "react-promise-tracker";
import Loader from 'react-loader-spinner';



export default class EditorPost extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            headline : "",
            key : this.props.keyNumber,
            date : "some date",
            author : "some name",
            text : "This will be a post containing all the text written in the given post, but if the text spans over multiple lines not all lines should be visible it should end in some ... and load the rest of the content when you click on the given post.",
            preClickText : "",
            showFullText : false,
            editingPostDbId : "",
        }
        
    }

    componentDidMount(){
        console.log("props:" + this.state.key);
        this.calculatePreClickText();
        this.queryPost();
        this.calculatePreClickText();
    }

    

    calculatePreClickText = () => {
        this.setState({
            preClickText : this.state.text.slice(0, 50)+"..."
        })
    }

    handleClick = (e) => {
        //alert("clicked post:" + this.state.headline);
        const post = {
           "postKey" : this.state.key,
           "headline" : this.state.headline,
           "date" : this.state.date,
           "author" : this.state.author,
           "text" : this.state.text,
           "editingPostDbId" : this.state.editingPostDbId
        }
        //alert(`EditorPost.JS sending ${post.date}`)
        this.props.callBack(post);
    }

    queryPost = (url = 'http://localhost:5000/posts/newpost', data = {
            "key" : this.state.key
        }) => {trackPromise(
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
                          author : data.author,
                          editingPostDbId : data._id,
                        preClickText : data.text})
                  })
              }));
            };


    render(){
        const {headline, text, preClickText, showFullText, fetchedText, keyNumber} = this.state;
        if(!showFullText){
        return(
            <div className="EditorPost" onClick = {this.handleClick}>
                <LoadingIndicator />
                <p className="editor-post-headline">{headline}</p>
            </div>
        )
        }
        else{
            return(
                <div className="EditorPost" onClick = {this.handleClick}>
                    <p>{headline}</p>
                    <div className = "ingress">                    
                        <p className="date">{this.state.date}</p>
                        <p className="author">{this.state.author}</p>
                    </div>
                    <p className="Expanded">{text}</p>
                </div>
            )
        }
    }
}

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
          <Loader type="Oval" color="#55d7ff" height="10" width="10" />
          </div>
      );  
     }