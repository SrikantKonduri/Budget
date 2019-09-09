import React, { Component } from 'react'
import './style.css'

class CreateAcc extends Component{
    create_acc_handler(){
        const username = this.refs.uname.value;
        const password = this.refs.pwd.value;
        const confirmPassword = this.refs.cpwd.value;
        const credentials = {
            username,password
        }
        console.log(credentials);
        if(password === confirmPassword){
            fetch('http://localhost:8000/signup',{
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(credentials)
            }).then(response => response.json())
            .then(response_data => {
                if(response_data.requestResult === 'success'){
                    console.log(response_data);
                    alert('Account Created Successfully, please login to use App');
                }
                else{
                    alert('Account is Currently in use,Please create your account with another Username');
                }
            })
        }
        else{
            alert('Passwords do not match');
        }
    }
    render(){
        return(
            <div id="frame">
                <form> 
                    <h2 id = "app-title">Budget</h2>
                    <input type = "email" placeholder = 'Username' className = "input-field" id = "uname" ref = 'uname'>
                    </input>
                    <input type="password" placeholder="Password" className = "input-field" ref = 'pwd'>
                    </input>
                    <input type="password" placeholder="Confirm Password"
                        className = "input-field" ref = 'cpwd'>
                    </input>
                    <button id = 'signup-btn' onClick = {() => this.create_acc_handler()}>Sign Up</button>
                </form>
            </div>
        );
    }
}

export default CreateAcc;