import React,{Component} from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie'
import './style_updateProfile.css';
import {Redirect} from 'react-router-dom';
const cookies = new Cookies();

class UpdateProfile extends Component{
    constructor(props){
        super(props);
        this.state = {
            avatar: null,
            tokenExpired: false,
            redirectProfile: false,
            redirectHome: false
        }
    }
    componentWillMount(){
        if(!cookies.get('jwt_token')){this.setState({tokenExpired: true})}
    }
    onChange(e){
        // console.log(e.target.files[0]);
        this.setState({
            avatar: e.target.files[0]
        });
    }
    async onUpload(){
        if(cookies.get('jwt_token')){
            if(this.state.avatar){
                console.log('------Photo Uploaded-------',this.state.avatar);
                const form_data = new FormData();
                form_data.append('avatar',this.state.avatar,`${cookies.get('uid')}.${this.state.avatar.name.split('.')[1]}`);
                const upload_status = await axios.post('http://localhost:8000/upload',form_data,{
                    headers: {
                        'Authorization': `Bearer ${cookies.get('jwt_token')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log('-------upload status------',upload_status);
                if(upload_status.data.status === 'success'){
                    alert('Photo uploaded successfully');
                    this.setState({redirectProfile: true})
                }
                else{
                    alert('Please login to continue...');
                    this.setState({tokenExpired: true});
                }
            }
            else{
                alert('No file choosen');
            }
        }
        else {
            this.setState({tokenExpired: true});
        }
    }
    async onSubmit(){
        console.log('---------Uploaded avatar------',this.state.avatar);
        var updateInfo = {};
        console.log(this.refs.name.value.trim().length);
        
        if(this.refs.name.value.trim().length>0){updateInfo.name = this.refs.name.value.trim()}
        if(this.refs.job.value.trim().length>0){updateInfo.job = this.refs.job.value.trim()}
        if(this.refs.address.value.trim().length>0){updateInfo.address = this.refs.address.value.trim()}
        if(this.refs.country.value.trim().length>0){updateInfo.country = this.refs.country.value.trim()}
        if(this.refs.income.value>0){updateInfo.income = this.refs.income.value}
        if(this.refs.phone.value.trim().length === 10 && !isNaN(this.refs.phone.value.trim())){
            updateInfo.phone = this.refs.phone.value.trim();
        }
        console.log('TOken: ',cookies.get('jwt_token'));
        const updateInfo_status = await fetch(`http://localhost:8000/profile/${cookies.get('uid')}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookies.get('jwt_token')}`
            },
            body: JSON.stringify(updateInfo)
        });
        const result = await updateInfo_status.json();
        console.log(result);
        if(result.status === 'success'){
            alert('Profile updated successfully');
            this.setState({redirectProfile: true});
        }else{
            alert('Please Login to continue');
            this.setState({tokenExpired: true})
        }
        
    }
    homeHandler(){
        this.setState({redirectHome: true})
    }
    render(){
        if(this.state.tokenExpired){
            return <Redirect 
                to = {{
                    pathname: '/'
                }}/>
        }
        else if(this.state.redirectProfile){
            return <Redirect 
                to = {{
                    pathname: '/profile'
                }}/>
        }
        else if(this.state.redirectHome){
            return <Redirect 
                to = {{
                    pathname: '/home'
                }}/>
        }
        else{
            return(
                <div id = 'update_profile_component'>
                    <nav>
                        <ion-icon name="home" title = 'Home' id = 'home' onClick = {this.homeHandler.bind(this)}></ion-icon>
                    </nav>
                    <h1 id = 'heading_updateProfile'>Update Profile</h1>
                    <div id = 'profile_section'>
                        {/* <input type = 'file' placeholder = 'Upload profile picture' className = 'info-field field'/> */}
                        <input type = 'file' onChange = {this.onChange.bind(this)} 
                            id = 'pro_pic' className = 'info-field' accept = 'image/jpg,image/jpeg,image/png'/>
                        <button id = 'upload-btn' onClick = {this.onUpload.bind(this)}>Upload</button>
                        <input type = 'text' placeholder = 'What should we call you?' 
                            id = 'Name' className = 'info-field' ref = 'name'/>
                        <input type = 'text' placeholder = 'What do you do?' 
                            className = 'info-field field' ref = 'job'/>
                        <input type = 'text' placeholder = 'You stay at?' 
                            className = 'info-field field' ref = 'address'/>
                        <input type = 'text' placeholder = 'You belong to which Country?' 
                            className = 'info-field field' ref = 'country'/>
                        <input type = 'test' placeholder = 'We can talk to you on?' 
                            className = 'info-field field' ref = 'phone'/>
                        <input type = 'number' placeholder = 'You earn?' 
                            className = 'info-field field' ref = 'income'/>
                        <div>
                            <button id = 'updatePro_btn' onClick = {this.onSubmit.bind(this)}>Update profile</button>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default UpdateProfile;