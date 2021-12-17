import React from 'react';
import App from './App';
import './index.css';
import TUVS from './TUVS/tuvs'

const welcomeMessage = <p>
  Welcome to Tez-Snake! This game uses the Tezos User Verification System (TUVS)
  to create user profiles and store data securely on the blockchain. If you have
  already created a TUVS identity, you can continue to Tez-Snake by connecting
  your wallet below.
</p>

export default class Menu extends React.Component {
    state = {
        gameState: "Menu",
        idRecieved: false
    }

    recieveId = () => {
        this.setState({idRecieved: true});
    }

    runApp = ()=>{
        this.setState({gameState: "Running"});
    }

    killApp = () => {
        this.setState({gameState: "Menu"});
    }

    render() {
        if(this.state.gameState === "Running"){
            return(<App callback={this.killApp}/>)
        }
        else {
            return (
            <div>
                <h1>Tez-Snake</h1>
                <div>{welcomeMessage}</div>
                <TUVS title={"Tez-Snake"} callback={this.recieveId} interface={"Connect"}/>
                {this.state.idRecieved && <button onClick={this.runApp}>Play Game</button>}
            </div>
            )
        }
    }
}