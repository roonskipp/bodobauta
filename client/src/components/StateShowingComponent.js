import React from 'react';
import {connect} from 'react-redux';
import { NUMBERACTION, TEXTACTION, BOOLEANACTION } from '../actions/actions';

export class StateShowingComponent extends React.Component{

    render(){
        return(
            <div className="StateShowingComponent">
                <p>Text: {this.props.text.text}</p>
                <p>Number: {this.props.number.number}</p>
                <p>Boolean: {this.props.boolean.boolean.toString()}</p>
                <button onClick={() => this.props.setText(this.props.text.text + "+1")}>Change textState</button>
                <button onClick={() => this.props.setNumber(this.props.number.number+1)}>Change numberState</button>
                <button onClick={() => this.props.setBoolean(!this.props.boolean.boolean)}>Change booleanState</button>
            </div>
        )
    }
}

// Gets the state from store, and puts it into props as "text, number and boolean".
// Accessible as "this.props.text, this.props.number, this.props.boolean"
const mapStateToProps = state => {
    return {
        text: state.textReducer,
        number: state.numberReducer,
        boolean: state.booleanReducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setText: (newText) => {
            dispatch({
                type: TEXTACTION,
                text: newText
            });
        },
        setNumber: (newNumber) => {
            dispatch({
                type: 'NUMBERACTION',
                number: newNumber
            });
        },
        setBoolean: (newBoolean) => {
            dispatch({
                type: BOOLEANACTION,
                boolean: newBoolean
            });
        },
    }
}

// Connects the class to store, making state send its state to props as defined in const mapStateToProps
export default connect(mapStateToProps, mapDispatchToProps)(StateShowingComponent);