import React,{Component} from 'react'

class Expense extends Component{
    render(){
        return(
            <div className = 'col span-1-of-2' id = 'exp-section'>
                <h3 className = 'type-head' id = 'exp-head'>
                    EXPENSE
                </h3>
                {this.props.children}
            </div>
        );
    }
}

export default Expense;