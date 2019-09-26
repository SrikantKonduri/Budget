import React, { Component } from 'react'
import CreateAcc from './CreateAcc'
import BudgetMain from './BudgetMain'
import './style.css'
import {Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
// const jwt = require('jsonwebtoken');
// const {promisify} = require('util');
// const SECRET = 'THIS-IS-MY-SECRET-KEY-YOU-CANT-CRACK-IT';

class App extends Component{
    constructor(props){
        super(props)
        this.state = {
            loggedIn : false,
            mainPage : true,
            budgetMain: false 
        }
    }
    // async extractId(token){
    //     const decodedData = await promisify(jwt.verify)(token,SECRET);
    //     return decodedData.id;
    // }
    componentWillMount(){
        if(cookies.get('jwt_token')){
            this.state.loggedIn = true;
        }
    }
    renderLogin(){
        this.setState({mainPage: true});
    }
    async login_handler(){
        console.log('handling login')
        const data = {
            username: this.refs.uname.value,
            password: this.refs.pwd.value
        }
        if(!data.username || !data.password){
            alert('Enter username & password');
        }
        else{
            const res = await fetch('http://localhost:8000/login',{
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(data) 
            });
            console.log(res);
            const response_server = await res.json();
            console.log(`Did server recieve data?: ${response_server.message}`,response_server);
            if(response_server.message === 'success'){
                // const user_id = await this.extractId(response_server.token);
                // console.log(`user_id: ${user_id}`);
                console.log('----Date------');
                console.log(new Date().getTime());
                cookies.set('jwt_token',response_server.token,{maxAge: response_server.ea});
                cookies.set('user',response_server.user,{maxAge: response_server.ea});
                this.setState({
                    loggedIn: true,
                })
                // <Redirect to = {`/home/${response_server.token}`}/>
                // this.props.history.push(`/home/${response_server.token}`);
                // this.props.history.push({
                //     pathname: '/home',
                //     state: {token: response_server.token}
                // })
            }
            else{
                alert('Invalid username or password');
            }
        }
    }
    createAcc_handler(){
        this.setState({
            mainPage: false
        });
    }
    render(){
        var render_loginApp = 
        <div id="frame">
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
        </div>
        var render_createApp = <CreateAcc renderLogin = {this.renderLogin.bind(this)}/>
        // var render_budgetMain = <BudgetMain />
        if(this.state.loggedIn){
            console.log('rendering budget..');
            console.log('---------Token via cookie-------');
            console.log(cookies.get('jwt_token'))
            return <Redirect 
                    to = {{
                        pathname: `/home`,
                    }}/>
            // return <Redirect to = {`/home/${this.state.token}`}/>
        }
        else if(this.state.mainPage){
            console.log('Huahhhhh');
            return(render_loginApp);
        }
        else{
            return(render_createApp);
        }
    }
}

export default App



