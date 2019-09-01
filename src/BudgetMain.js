import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Income from './Income'
import Expense from './Expense'
import AddItem from './AddItem'
import './style_budgetMain.css'
import './Grid.css'

class BudgetMain extends Component{
    constructor(props){
        super(props);
        this.state = {
            income: 0,
            expense: 0,
            incs: [],
            exps: [],
            totalAvail: 0.00,
            id: 0
        }
    }
    addNewItemHandler(){
        if(this.refs.valType.value === '+'){
            const add = parseFloat(parseFloat(this.refs.val.value).toFixed(2));
            this.state.incs.push(<AddItem description = {this.refs.desp.value} value = {this.refs.val.value}
                valueType = {this.refs.valType.value} remove = {this.removeItem.bind(this)} 
                itemId = {this.state.id + 1}/>)
            this.setState({
                incs: this.state.incs,
                id: this.state.id + 1,
                totalAvail: this.state.totalAvail + add
            });
        }
        else if(this.refs.valType.value === '-'){
            console.log(typeof(this.refs.val.value));
            const sub = parseFloat(parseFloat(this.refs.val.value).toFixed(2));
            this.state.exps.push(<AddItem description = {this.refs.desp.value} value = {this.refs.val.value}
                valueType = {this.refs.valType.value} remove = {this.removeItem.bind(this)}
                itemId = {this.state.id + 1}/>)
            this.setState({
                exps: this.state.exps,
                id: this.state.id + 1,
                totalAvail: this.state.totalAvail - sub
            });
        }
        
    }
    removeItem(id , type){
        
        if(type === '+'){
            const removeableData = this.state.incs.find(el => el.props.itemId === id);
            const removeableDataIdx = this.state.incs.indexOf(removeableData);
            this.state.incs.splice(removeableDataIdx,1);
            this.setState({
                incs: this.state.incs,
                totalAvail: this.state.totalAvail - parseFloat(parseFloat(removeableData.props.value).toFixed(2))
            });
            
        }
        else if(type === '-'){
            const removeableData = this.state.exps.find(el => el.props.itemId === id);
            const removeableDataIdx = this.state.exps.indexOf(removeableData);
            this.state.exps.splice(removeableDataIdx,1);
            this.setState({
                exps: this.state.exps,
                totalAvail: this.state.totalAvail + parseFloat(parseFloat(removeableData.props.value).toFixed(2))
            });
        }
        
        console.log(`Item Type: ${type}, ID: ${id} removed`);
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
        return(
            <section>
                <div id = 'month-summary'>
                    <h3>Budget Available in <b>August 2019:</b></h3>
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
                        <ion-icon name="checkmark-circle-outline"/>
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
            </section>
        );
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