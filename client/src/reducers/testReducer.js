import { combineReducers } from 'redux';
import {
  TEXTACTION,
  NUMBERACTION,
  BOOLEANACTION,
} from '../actions/actions';



// Initial states
const textState = {
    text: 'initial'
}

const numberState = {
    number: 0
}

const booleanState = {
    boolean: false
}

// takes the text and returns a new state with updated text
function textReducer(state = textState, action) {
  switch (action.type) {
    case TEXTACTION:
      return Object.assign({}, state, {
        text: action.text
      })
    default:
      return state
  }
}

// takes the number and returns a new state with updated number
function numberReducer(state = numberState, action) {
    switch (action.type) {
      case NUMBERACTION:
        return Object.assign({}, state, {
          number: action.number
        })
      default:
        return state
    }
  }

// takes the boolean and returns a new state with updated boolean
function booleanReducer(state = booleanState, action) {
    switch (action.type) {
      case BOOLEANACTION:
        return Object.assign({}, state, {
          boolean: action.boolean
        })
      default:
        return state
    }
  }

// Combine all reducers into one reducer for your app
const testReducer = combineReducers({
  textReducer,
  numberReducer,
  booleanReducer
})

export default testReducer;