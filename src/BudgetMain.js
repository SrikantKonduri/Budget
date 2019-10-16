import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {Redirect} from 'react-router-dom'
import Cookies from 'universal-cookie'
import Income from './Income'
import Expense from './Expense'
import AddItem from './AddItem'
import './style_budgetMain.css'
import './Grid.css'
import { conditionalExpression } from '@babel/types'
const cookies = new Cookies();

class BudgetMain extends Component{
    constructor(props){
        super(props);
        this.state = {
            income: 0,
            expense: 0,
            incs: [],
            exps: [],
            totalAvail: 0.00,
            id: 0,
            tokenExpired: false,
            viewProfile: false,
            updateProfile: false,
            user: ''
        }
    }
    async componentWillMount(){
        if(!cookies.get('jwt_token')){this.setState({tokenExpired: true})}
        else{
            console.log('-------token-------');
            console.log('dfjk',cookies.get('jwt_token'));
            const token = cookies.get('jwt_token')
            const response = await fetch('http://localhost:8000/users',{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const user_data = await response.json();
            console.log('-----------user_data----------');
            console.log(user_data);
            if(user_data.message === 'success'){
                console.log('----------Incomes---------');
                let totalIncs = 0,totalExps = 0;
                user_data.incomes.forEach(element => {
                    this.state.incs.push(<AddItem description = {element.description} value = {element.value} 
                        valueType = {element.item_type} itemId = {element._id} remove = {this.removeItem.bind(this)}/>)
                    console.log(element);
                    totalIncs += element.value;
                });
                console.log('-----------Expenses-------');
                user_data.expenses.forEach(ele =>{
                    this.state.exps.push(<AddItem description = {ele.description} value = {ele.value}
                        valueType = {ele.item_type} itemId = {ele._id} remove = {this.removeItem.bind(this)}/>)
                    console.log(ele);
                    totalExps += ele.value;
                });
                this.setState({
                    incs: this.state.incs,
                    exps: this.state.exps,
                    totalAvail: totalIncs - totalExps,
                    income: totalIncs,
                    expense: totalExps
                });
            }else{
                alert('Buddy you are out of time,Please login to continue');
                this.setState({tokenExpired: true})
            }
        }
    }
    async addNewItemHandler(){
        console.log('--------Getting cookie----');
        console.log(cookies.get('jwt_token'));
        const add_newItem = {
            item_type: this.refs.valType.value,
            description: this.refs.desp.value,
            value: this.refs.val.value
        }
        const isValidItem = (add_newItem.description.length > 0 && add_newItem.value > 0);
        console.log('isValidItem',isValidItem);
        console.log(typeof(add_newItem.item_type))

        if(!cookies.get('jwt_token')){this.setState({tokenExpired: true})}
        else if(isValidItem){
            const add_status = await fetch('http://localhost:8000/users',{
                method: 'POST',
                headers:{
                    'Authorization': `Bearer ${cookies.get('jwt_token')}`,
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(add_newItem)
            })
            const status = await add_status.json();
            console.log('------------Item added----------');
            console.log(status);
            if(status.message === 'success'){
                if(this.refs.valType.value === '+'){
                    const add = parseFloat(parseFloat(this.refs.val.value).toFixed(2));
                    this.state.incs.push(<AddItem description = {this.refs.desp.value} value = {this.refs.val.value}
                        valueType = {this.refs.valType.value} remove = {this.removeItem.bind(this)} 
                        itemId = {status.id}/>)
                    this.setState({
                        incs: this.state.incs,
                        income: this.state.income + add,
                        totalAvail: this.state.totalAvail + add
                    });
                }    
                else if(this.refs.valType.value === '-'){
                    console.log(typeof(this.refs.val.value));
                    const sub = parseFloat(parseFloat(this.refs.val.value).toFixed(2));
                    this.state.exps.push(<AddItem description = {this.refs.desp.value} value = {this.refs.val.value}
                        valueType = {this.refs.valType.value} remove = {this.removeItem.bind(this)}
                        itemId = {status.id}/>)
                    this.setState({
                        exps: this.state.exps,
                        expense: this.state.expense + sub,
                        totalAvail: this.state.totalAvail - sub
                    });
                }
            }
            else if(status.message === 'JWT expired'){
                alert('Session Expired,Please login to continue...');
                this.setState({tokenExpired: true})
            }
            else{
                alert('Just login buddy');
                this.setState({tokenExpired: true})
            }
        }
        else{
            alert('Lol, i do not accept this item');
        }
    }
    async removeItem(id , type){
        console.log(id);
        if(!cookies.get('jwt_token')){this.setState({tokenExpired: true})}
        else{
            const res_for_del_req = await fetch('http://localhost:8000/users',{
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${cookies.get('jwt_token')}`
                },
                body: JSON.stringify({itemId: id})
            })
            console.log(res_for_del_req);
            if(res_for_del_req.status === 204){
                alert('Item Removed');
                if(type === '+'){
                    const removeableData = this.state.incs.find(el => el.props.itemId === id);
                    console.log('RData: ',removeableData);
                    const removeableDataIdx = this.state.incs.indexOf(removeableData);
                    this.state.incs.splice(removeableDataIdx,1);
                    console.log(removeableData.props.value);
                    this.setState({
                        incs: this.state.incs,
                        income: this.state.income - removeableData.props.value,
                        totalAvail: this.state.totalAvail - parseFloat(parseFloat(removeableData.props.value).toFixed(2))
                    });
                }
                else if(type === '-'){
                    const removeableData = this.state.exps.find(el => el.props.itemId === id);
                    const removeableDataIdx = this.state.exps.indexOf(removeableData);
                    this.state.exps.splice(removeableDataIdx,1);
                    this.setState({
                        exps: this.state.exps,
                        expense: this.state.expense - removeableData.props.value,
                        totalAvail: this.state.totalAvail + parseFloat(parseFloat(removeableData.props.value).toFixed(2))
                    });
                }
                console.log(`Item Type: ${type}, ID: ${id} removed`);
            }
            else{
                alert('Session expired, please login to continue...');
                this.setState({tokenExpired: true});
            }
        }
    }
    logoutHandler(){
        console.log('logged out!')
        cookies.remove('jwt_token');
        cookies.remove('user');
        cookies.remove('uid');
        this.setState({tokenExpired: true});
    }
    profileHandler(){
        this.setState({viewProfile: true})
    }
    updateProfileHandler(){
        this.setState({updateProfile: true})
    }
    render(){
        var income_symbol = '+';
        var expense_symbol = '-';
        var curr_budget_sign = (this.state.totalAvail > 0)?('+'):('');
        const i_addItem = this.state.incs.map(el => {
            return el
        });
        const e_addItem = this.state.exps.map(el => {
            return el
        })
        if(this.state.tokenExpired){
            return <Redirect 
                to = {{
                    pathname: '/'
                }}/>
        }
        else if(this.state.viewProfile){
            return <Redirect 
                to = {{
                    pathname: '/profile'
                }}/>
        }
        else if(this.state.updateProfile){
            return <Redirect 
                to = {{
                    pathname: '/updateProfile'
                }}/>
        }
        else{
            return(
                <section>
                <div id = 'options'>
                    <ion-icon name="create" id = 'edit-profile' title = 'Edit Profile' onClick = {this.updateProfileHandler.bind(this)}></ion-icon>
                    <ion-icon name="person" id = 'view-profile' title = 'View Profile'  onClick = {this.profileHandler.bind(this)}></ion-icon>
                </div>
                <button id = 'logout-btn' onClick = {this.logoutHandler.bind(this)}>Logout</button>
                <div id = 'month-summary'>
                    <h3>_______<b>Budget Available</b>_______</h3>
                    <h1 id = 'avail-budget'>{`${curr_budget_sign} ${this.state.totalAvail}`}
                    </h1>
                    <div id = 'inc-field'>
                        <h4 className = 'inc-exp-heading'>INCOME</h4>
                        <span className = 'value'>{this.state.income}</span>
                    </div>
                    <div id = 'exp-field'>
                        <h4 className = 'inc-exp-heading'>EXPENSE</h4>
                        <span className = 'value'>{this.state.expense}</span>
                    </div>
                </div>
                <hr></hr>
                <div>
                    <select className = 'input-budget' id = 'value-type' ref = 'valType'>
                        <option>{'+'}</option>
                        <option>{'-'}</option>
                    </select>
                    <input type = 'text' placeholder = 'Description' 
                    className = 'input-budget' id = 'description-field'
                    ref = 'desp'/>
                    <input type = 'number' placeholder = 'Value'
                    className = 'input-budget' id = 'value-field' ref = 'val'/>
                    <div id = 'icon' onClick = {() => this.addNewItemHandler()}>
                        <ion-icon name="checkmark-circle-outline" title = 'Add'/>
                    </div>
                </div>
                <div className = 'row'>
                    <Income id = 'inc' ref = 'addInc'>
                        {
                            i_addItem
                        }
                    </Income>
                    <Expense id = 'exp' ref = 'addExp'>
                        {
                            e_addItem
                        }                       
                    </Expense>
                </div>
            </section>);
        }   
    }   
}

export default BudgetMain


/* 
    <div className = 'type-field odd'>
        Income 1
        <span className = 'type-value'>2000</span>
        <div id = 'remove-icon'>
            <ion-icon name="close-circle"></ion-icon>
        </div>
    </div>
    <div className = 'type-field odd'>
        Expense 1
        <span className = 'type-value'>2000</span>
            <div id = 'remove-icon'>
            <ion-icon name="close-circle"></ion-icon>
        </div>
    </div>
*/