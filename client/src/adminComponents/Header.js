import React from 'react';

export default class Header extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }
    }

    handleClick= (e) => {
        // Calls callback-function passed through props from PageContainer
        this.props.callBack(e);
    }

    render(){
        return(
            <div className="header">
        <div className="HeaderButtonBorder">
                    <button id="home" onClick={(e) => this.handleClick(e)} >Login</button>
                </div>
                <div className="HeaderButtonBorder">
                    <button id="posteditor" onClick={(e) => this.handleClick(e)} >Post Editor</button>
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