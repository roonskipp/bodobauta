import React from 'react';
import '../css/GridCss.css';

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
                    <button id="home" onClick={(e) => this.handleClick(e)} >Home</button>
                </div>
                <div className="HeaderButtonBorder">
                    <button id="about" onClick={(e) => this.handleClick(e)} >About</button>
                </div>
                <div className="HeaderButtonBorder">
                    <button id="signup" onClick={(e) => this.handleClick(e)} >Sign Up</button>
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