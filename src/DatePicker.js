import React, { Component, PropTypes } from 'react'

import  './js/mui'
import './js/picker'
import DtPicker from './js/dtpicker'

class DatePicker extends Component{

    static defalutProps = {
        visible: false,
        options: {}
    };

    static propTypes = {
        visible: PropTypes.bool,
        getData: PropTypes.func,
        confirm: PropTypes.func,
        cancel: PropTypes.func,
        options: PropTypes.object
    };

    constructor(props){
        super(props)
        this.userPicker = {};
    }

    componentDidMount(){
        this.userPicker = new DtPicker(this.props.options);
        this.userPicker.ui.cancel.addEventListener('tap', event => {
            this.props.cancel();
        }, false);
        this.userPicker.ui.mask[0].addEventListener('tap', () =>  {
            this.props.cancel();
        }, false);
    }

    show(){
        this.userPicker.show(items => {
            this.props.getData(items.text);
            this.props.cancel && this.props.cancel();
        })
    }

    componentDidUpdate(){
        if(this.props.visible){
            this.show()
        }else{
            this.userPicker.hide();
        }
    }

    render(){
        return(
            <div style={{ display: 'none'}}></div>
        )
    }
}

export default DatePicker
