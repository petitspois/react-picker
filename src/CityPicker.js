import React, { Component, PropTypes } from 'react'

import  './js/mui'
import './js/picker'
import PopPicker from './js/poppicker'

class CityPicker extends Component{

    static defalutProps = {
        visible: false
    };

    static propTypes = {
        visible: PropTypes.bool,
        setData: PropTypes.array,
        getData: PropTypes.func,
        confirm: PropTypes.func,
        cancel: PropTypes.func
    };

    constructor(props){
        super(props)
        this.userPicker = {};
    }

    componentDidMount(){
        this.userPicker = new PopPicker({layer: this.props.layer || '',defaultVal:this.props.defaultVal });
        this.userPicker.setData(this.props.setData);
        this.userPicker.cancel.addEventListener('tap', event => {
            this.props.cancel();
        }, false);
        this.userPicker.mask[0].addEventListener('tap', () => {
            this.props.cancel();
        }, false);
    }

    show(){
        this.userPicker.show(items => {
            this.props.getData(items);
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

export default CityPicker
