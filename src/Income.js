import React,{Component} from 'react';

class Income extends Component{
    render(){
        return(
            <div className = 'col span-1-of-2' id = 'inc-section'>
                <h3 className = 'type-head' id = 'inc-head'>
                    INCOME
                </h3>
                {this.props.children}
            </div>
        )
    }
}
export default Income;