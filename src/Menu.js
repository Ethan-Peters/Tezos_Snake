import React, { useEffect, useState } from 'react';
import App from './App';
import './App.css';
import TUVS from './TUVS/tuvs'

const welcomeMessage = <p className="subtitle">
  Welcome to Tez-Snake! This game uses the Tezos User Verification System (TUVS)
  to create user profiles and store data securely on the blockchain. If you have
  already created a TUVS identity, you can continue to Tez-Snake by connecting
  your wallet below.
</p>

const header = 
    <header>
    <div class="headerContent">
    <div class="logo">Logo</div>
    <div class="headerWrapper">
        <a class="navigation">Home</a>
        <a class="navigation">About</a>
        <a class="navigation">Source</a>
    </div>
    </div>
    </header>

export function Menu() {

    const [gameState, setGameState] = useState("Menu");
    const [score, setScore] = useState(2);

    const entryData = {
        strings: [],
        nats: [
            ["High Score", score]
        ]
    }

    const gameOverFields = {
        strings: ["User Name"],
        nats: ["R", "G", "B"]
    }

    const {
        idRecieved,
        connectToContract,
        setApplicationTitle,
        setUserDataFields,
        TUVS_ConnectionInterface,
        TUVS_GameOverInterface
    } = TUVS();

    useEffect(() => {
        setApplicationTitle("Tez-Snake");
        setUserDataFields(entryData, gameOverFields);
    }, [gameState])

    function toMenu() {
        connectToContract();
        setGameState("Menu");
    }

    function playGame() {
        updateScore(2);
        setGameState("Running");
    }

    function gameOver() {
        setGameState("GameOver");
    }

    function updateScore(newScore) {
        setScore(newScore);
    }

    return (
        <div>
            { header }
            <div class="body">
                <div class="card"><div class="overlay"></div></div>
                { gameState === "Menu" &&
                    <div class="wrapper">
                        <div class="column">
                            <h1 class="title"><span class="heavy">Tez-Snake</span></h1>
                            {welcomeMessage}
                        </div>
                        <TUVS_ConnectionInterface/>
                        {idRecieved && <div class="buttonContainer"><button onClick={playGame}>Play Game</button></div>}
                    </div>
                }
                { gameState === "Running" &&
                    <div>
                        <h1>Score: {score}</h1>
                        <App gameOverCallback={gameOver} updateScoreCallback={updateScore}/>
                    </div>
                }
                { gameState === "GameOver" &&
                    <div>
                        <TUVS_GameOverInterface/>
                        <button onClick={playGame}>Play Again</button>
                        <button onClick={toMenu}>Main Menu</button>
                    </div>
                }
            </div>
        </div>
    )
}

export default Menu;