import React from 'react';
import App from './App';
import './index.css';
export default class Menu extends React.Component {
    state = {
        gameIsRunning: false
    }
    runApp = ()=>{
        this.setState({gameIsRunning: true});
    }
    render() {
        if(this.state.gameIsRunning){
            return(<App />)
        }
        else {
            return (
            <div className = 'button-area'>
                <div className = 'button-container'>
                    <button>Link Wallet</button>
                </div>
                <div className = 'button-container2' onClick={this.runApp}>
                    <button>Play Game</button>
                </div>
            </div>
            )
        }
    }
}