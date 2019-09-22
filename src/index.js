import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import BudgetMain from './BudgetMain';
import * as serviceWorker from './serviceWorker';

class NewComponent extends Component{
    render(){
        return(
            <Router>
                <div>
                    <Switch>
                        <Route exact path = '/' component = {App}/>
                        <Route exact path = '/home' component = {BudgetMain}/>
                    </Switch>
                </div>
            </Router>
            
        );
    }
}
ReactDOM.render(<NewComponent />,document.querySelector('#root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
