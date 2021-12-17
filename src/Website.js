import React from 'react';
import './Website.css';

export default class Website extends React.Component{
    state = {
        vis1: 'visible',
        vis2: 'hidden',
        vis3: 'hidden'
    }
    changeToTab1 = () => {
        this.setState({
            vis1: 'visible',
            vis2: 'hidden',
            vis3: 'hidden'
        })
    }
    changeToTab2 = () => {
        this.setState({
            vis1: 'hidden',
            vis2: 'visible',
            vis3: 'hidden'
        })
    }
    changeToTab3 = () => {
        this.setState({
            vis1: 'hidden',
            vis2: 'hidden',
            vis3: 'visible'
        })
    }
    render(){
        let tab1 = {
            visibility: this.state.vis1
        }
        let tab2 = {
            visibility: this.state.vis2
        }
        let tab3 = {
            visibility: this.state.vis3
        }
        return (
        <div className = 'background'>
            <div className = 'window1'></div>
            <div className = 'tabController'>
                <button className = 'tabSelect' onClick={this.changeToTab1} >Make User</button>
                <button className = 'tabSelect' onClick={this.changeToTab2} >View Account</button>
                <button className = 'tabSelect' onClick={this.changeToTab3} >Something Else</button>
            </div>
            <div className='tab' style={tab1}>
                hello
            </div>
            <div className='tab' style={tab2}>
                there
            </div>
            <div className='tab' style={tab3}>
                general kenobi
            </div>
        </div>
        )
    }
};