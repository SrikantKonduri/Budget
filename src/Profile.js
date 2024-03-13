import React,{Component} from 'react';
import Cookies from 'universal-cookie';
import {Redirect} from 'react-router-dom'
import './style_profile.css'
import './Grid.css'
const cookies = new Cookies();

class Profile extends Component{
    constructor(props){
        super(props)
        this.state = {
            tokenExpired: false,
            renderHome: false
        }
    }
    async getProfileInfo(){
        console.log('MOUNTED');
        const response = await fetch(`http://localhost:8000/profile/${cookies.get('uid')}`,{
            headers: {
                'Authorization': `Bearer ${cookies.get('jwt_token')}`
            }
        });
        const result = await response.json();
        console.log('dvkjfbkjnd,nckjsnlk',result);
        if(result.data.income === null || result.data.income === -1){
            result.data.income = '<Unknown>'
        }
        if(result.status === 'Data Exists'){
            const profile_info = result.data;
            this.setState(profile_info);    
        }
        else{
            this.setState(result.data);
        }
    }
    async componentWillMount(){
        if(cookies.get('jwt_token')){
            const response = await fetch('http://localhost:8000/profile',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.get('jwt_token')}`
                },
                body: JSON.stringify({uid: cookies.get('uid')})
            });
            // const avatar_res = response.json();
            const up_res = response;
            if(response.status === 204){
                console.log('***********************');
                console.log('MOUNTED');
                this.getProfileInfo();
            }
            else if(response.status === 401){
                this.setState({tokenExpired: true})
            }
            else{
                const reader = up_res.body.getReader();
                const stream = await new ReadableStream({
                    start(controller) {
                      return pump();
                      function pump() {
                        return reader.read().then(({ done, value }) => {
                          // When no more data needs to be consumed, close the stream
                          if (done) {
                              controller.close();
                              return;
                          }
                          // Enqueue the next data chunk into our target stream
                          controller.enqueue(value);
                          return pump();
                        });
                      }
                    }  
                });
                const res = await new Response(stream);
                const blob = await res.blob();
                const url = URL.createObjectURL(blob)
                document.getElementById('avatar').src = url ;
                
                this.getProfileInfo();
            }
        }else{
            this.setState({tokenExpired: true})
        }

    }
    homeHandler(){
        this.setState({renderHome: true})
    }
    render(){
        if(this.state.tokenExpired){
            return <Redirect 
                to = {{
                    pathname: '/'
                }}/>
        }
        else if(this.state.renderHome){
            return <Redirect 
                to = {{
                    pathname: '/home'
                }}/>
        }
        else{
            return(
                <div id = 'cover'>
                    <nav>
                        <ion-icon name="home" title = 'Home' id = 'home' onClick = {this.homeHandler.bind(this)}></ion-icon>
                    </nav>
                    <img src= "" alt="Avatar" id = 'avatar'></img>
                    {/* <hr /> */}
                    <h1 id = 'name'><b>Hey {this.state.name}</b></h1>
                    <div id = 'profile-section' className = 'row'>
                        <div id = 'contact-info' className = 'col span-1-of-3 personal-info'>
                            <ion-icon name="call" className = 'icon_info'></ion-icon>
                            <h3 className = 'heading-info'>We can call</h3>
                            <div className = 'info'>
                                {this.state.phone}
                            </div>
                        </div>
                        <div id = 'address-info' className = 'col span-1-of-3 personal-info'>
                            <ion-icon name="pin"  className = 'icon_info'></ion-icon> 
                            <h3 className = 'heading-info'>We catch you at</h3>
                            <div className = 'info'>
                                {this.state.address}
                            </div>
                        </div>
                        <div id = 'income-info' className = 'col span-1-of-3 personal-info'>
                            <ion-icon name="cash" className = 'icon_info'></ion-icon> 
                            <h3 className = 'heading-info'>You get around</h3>
                            <div className = 'info'>
                                {this.state.income}
                            </div>
                        </div>
                        
                        <div id = 'country-info' className = 'col span-2-of-4 personal-info lastRow'>
                            <ion-icon name="globe" className = 'icon_info'></ion-icon>
                            <h3 className = 'heading-info'>You are from</h3>
                            <div className = 'info'>
                                {this.state.country}
                            </div>
                        </div>
                        <div id = 'job-info' className = 'col span-2-of-4 personal-info lastRow'>
                            <ion-icon name="briefcase" className = 'icon_info'></ion-icon> 
                            <h3 className = 'heading-info'>You work as</h3>
                            <div className = 'info'>
                                {this.state.job}
                            </div>
                        </div>
    
                    </div>
                </div>
            );
        }
    }
}

export default Profile
// <ion-icon name="home"></ion-icon>