import React,{Component} from 'react'

class AddItem extends Component{
    render(){
        return(
            <div className = 'type-field odd'>
                <div className = 'type-desc'>{this.props.description}</div>
                <div className = 'type-value'>{this.props.value}</div>
                <div className = 'remove-item'>
                    <button className = 'remove-btn' onClick = {() => {this.props.remove(this.props.itemId,this.props.valueType)}}>
                        <ion-icon name="close-circle"></ion-icon>
                    </button>
                </div>
            </div>
        );
    }
}

export default AddItem;