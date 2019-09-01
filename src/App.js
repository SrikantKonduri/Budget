import React, { Component } from 'react'
import CreateAcc from './CreateAcc'
import BudgetMain from './BudgetMain'
import './style.css'

class App extends Component{
    constructor(props){
        super(props)
        this.state = {
            loggedIn : false,
            mainPage : true,
            budgetMain: false 
        }
    }
    login_handler(){
        console.log('handling login')
        const data = {
            username: this.refs.uname.value,
            password: this.refs.pwd.value
        }
        // fetch('/login',{
        //     method: 'POST',
        //     body: JSON.stringify(data) ,
        //     headers: {
        //         'Content-type': 'application/json'
        //     } 
        // }).then(res => console.log(`res: ${res}`));   
        this.setState({budgetMain: true});
    }
    createAcc_handler(){
        this.setState({
            mainPage: false
        });
    }
    render(){
        var render_loginApp = 
        <div id="frame">
            <form> 
                <h2 id = "app-title">Budget</h2>
                <input type = "email" placeholder = 'Username' className = "input-field" id = "uname" ref = 'uname'>
                </input>
                <input type="password" placeholder="Password" className = "input-field" ref = 'pwd'>
                </input>
                <div id = 'buttons'>
                    <button href = '' id = 'create-acc-btn' 
                     className = 'btn' onClick = {()=>this.createAcc_handler()}>
                        Create account
                    </button>
                    <button id = 'login-btn'
                     className = 'btn' onClick = {()=>this.login_handler()}>
                        Login
                    </button>
                </div>
            </form>
        </div>
        var render_createApp = <CreateAcc />
        var render_budgetMain = <BudgetMain />
        if(this.state.budgetMain){
            return(render_budgetMain)            
        }
        else if(this.state.mainPage){
            return(render_loginApp);
        }
        else{
            return(render_createApp);
        }
    }
}

export default App



