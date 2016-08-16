# react-picker
datapicker and citypicker base on MUI of picker

<img src="/src/images/show.png" width="320" />

### Installation

Using [npm](https://www.npmjs.com/):

    $ npm install --save react-pickers


Then with a module bundler like [webpack](https://webpack.github.io/) that supports either CommonJS or ES2015 modules, use as you would anything else:


```js

// using an ES6 transpiler, like babel
import { DatePicker, CityPicker } from 'react-pickers'

// not using an ES6 transpiler
var DatePicker = require('react-pickers').DatePicker
var CityPicker = require('react-pickers').CityPicker


```

### What's it look like?

```js
import React, { Component } from 'react';
import { render } from 'react-dom';

import 'react-pickers/lib/css/picker.css'
import { CityPicker, DatePicker } from 'react-picker'


import city2 from '../lib/city-data'
import city3 from '../lib/city-data-3'

class App extends Component{

    state = {
        showCityPicker: false,
        showCity2Picker:false,
        showCity3Picker:false,
        showDatePicker:false,
        showDatePicker2:false,
        singleData : [{
			value: 'ywj',
			text: '董事长 叶文洁'
		}, {
			value: 'aaa',
			text: '总经理 艾AA'
		}, {
			value: 'lj',
			text: '罗辑'
		}, {
			value: 'ymt',
			text: '云天明'
		}, {
			value: 'shq',
			text: '史强'
		}, {
			value: 'zhbh',
			text: '章北海'
		}, {
			value: 'zhy',
			text: '庄颜'
		}, {
			value: 'gyf',
			text: '关一帆'
		}, {
			value: 'zhz',
			text: '智子'
		}, {
			value: 'gezh',
			text: '歌者'
		}],
        city2: city2,
        city3: city3
    }

    showCityPicker(){
        this.setState({showCityPicker: true })
    }

    showCity2Picker(){
        this.setState({showCity2Picker: true })
    }

    showCity3Picker(){
        this.setState({showCity3Picker: true })
    }

    ok(){
        this.setState({showCityPicker: false })
    }

    cl(){
        this.setState({showCityPicker: false })
    }


    ok2(){
        this.setState({showCity2Picker: false })
    }

    cl2(){
        this.setState({showCity2Picker: false })
    }

    ok3(){
        this.setState({showCity3Picker: false })
    }

    cl3(){
        this.setState({showCity3Picker: false })
    }

    ok4(){
        this.setState({showDatePicker: false })
    }

    cl4(){
        this.setState({showDatePicker: false })
    }

    ok5(){
        this.setState({showDatePicker2: false })
    }

    cl5(){
        this.setState({showDatePicker2: false })
    }

    getData(ret){
        console.log(ret);
    }

    getData2(ret){
        console.log("你选择的城市是:" + ret[0].text + " " + ret[1].text);
    }

    getData3(ret){
        console.log("你选择的城市是:" + (ret[0] || {}).text + " " + (ret[1] || {}).text + " " + (ret[2] || {}).text);
    }

    getData4(ret){
        console.log('选择结果: ' + ret);
    }

    getData5(ret){
        console.log('选择结果: ' + ret);
    }

    selectDate(){
        this.setState({showDatePicker: true })
    }

    selectDate2(){
        this.setState({showDatePicker2: true })
    }

    render(){
        return (
            <div>
                <h5 className="mui-content-padded">普通示例</h5>
                <button id='showUserPicker' className="mui-btn mui-btn-block" type='button' onClick={ this::this.showCityPicker  }>一级选择示例 ...</button>
                <CityPicker visible={ this.state.showCityPicker } setData={this.state.singleData} getData={ this::this.getData } confirm={ this::this.ok } cancel={ this::this.cl } />
                <h5 className="mui-content-padded">级联示例</h5>
				<button id='showCityPicker' className="mui-btn mui-btn-block" type='button' onClick={ this::this.showCity2Picker  }>二级联动示例 ...</button>
                <CityPicker visible={ this.state.showCity2Picker } layer='2' setData={this.state.city2} getData={ this::this.getData2 } confirm={ this::this.ok2 } cancel={ this::this.cl2 } />
                <div style={{ marginTop: '30px'}}></div>
                <button id='showCityPicker3' className="mui-btn mui-btn-block" type='button' onClick={ this::this.showCity3Picker  }>三级联动示例 ...</button>
                <CityPicker visible={ this.state.showCity3Picker } layer='3' setData={this.state.city3} getData={ this::this.getData3 } confirm={ this::this.ok3 } cancel={ this::this.cl3 } />
                <div className="mui-content-padded">
    				<h5 className="mui-content-padded">常规示例</h5>
    				<button id='demo1' className="btn mui-btn mui-btn-block" onClick={ this::this.selectDate }>选择日期时间 ...</button>
                    <DatePicker visible={ this.state.showDatePicker }  getData={ this::this.getData4 } confirm={ this::this.ok4 } cancel={ this::this.cl4 } />
    				<h5 className="mui-content-padded">设定年份区间</h5>
    				<button id='demo2' className="btn mui-btn mui-btn-block" onClick={ this::this.selectDate2 }>选择日期 ...</button>
                    <DatePicker visible={ this.state.showDatePicker2 } options={{"type":"date","beginYear":2014,"endYear":2016}}  getData={ this::this.getData5 } confirm={ this::this.ok5 } cancel={ this::this.cl5 } />
    			</div>
            </div>
        )
    }
}


render(
    <App />,
    document.querySelector('#root')
)

```

See more in the [mui-picker](http://dev.dcloud.net.cn/mui/ui/#picker)


### example

```js

npm install

cd example

node server.js

```
