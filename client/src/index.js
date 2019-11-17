import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import { usePromiseTracker } from "react-promise-tracker";
import './css/index.css';
import App from './App';
import Admin from './Admin';
import * as serviceWorker from './serviceWorker';

const LoadingIndicator = props => {
  const { promiseInProgress } = usePromiseTracker();
  
     return (
        promiseInProgress
    );  
   }

function App2(){
  return(
    <div>
      <Switch>
        <Route path="/home">
          <App/>
        </Route>
        <Route path="/admin">
          <Admin/>
        </Route>
      </Switch>
    </div>
  );
}

ReactDOM.render(
  <Router>
    <App2 />
    <LoadingIndicator />
  </Router>, 
  document.getElementById('root')
  );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
