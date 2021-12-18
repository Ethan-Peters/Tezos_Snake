import React, { useEffect, useState } from 'react';
import App from './App';
import './App.css';
import TUVS from './TUVS/tuvs'

const welcomeMessage = <p className="subtitle">
  Welcome to Tez-Snake! This game uses
  the <a href="https://master.d173refua7xzyw.amplifyapp.com/">Tezos User Verification System (TUVS)</a> to
  create user profiles and store data securely on the blockchain. If you have
  already created a TUVS identity, you can continue to Tez-Snake by connecting
  your wallet below.
</p>

export function Menu() {

    const [gameState, setGameState] = useState("Menu");
    const [score, setScore] = useState(2);
    const [highScore, setHighScore] = useState(0);

    const entryData = {
        strings: [],
        nats: [
            ["High Score", Math.max(highScore, score)]
        ]
    }

    const gameOverFields = {
        strings: ["User Name", "Snake Color"],
        nats: []
    }

    const {
        idRecieved,
        getValueByKey,
        connectToContract,
        setApplicationTitle,
        setUserDataFields,
        TUVS_ConnectionInterface,
        TUVS_GameOverInterface
    } = TUVS();

    useEffect(() => {
        setApplicationTitle("Tez-Snake");
        setUserDataFields(entryData, gameOverFields);
        setHighScore(getValueByKey("High Score", 0));
    }, [gameState])

    function toMenu() {
        connectToContract();
        setGameState("Menu");
    }

    function toAbout() {
        setGameState("About");
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

    const header = 
    <header>
        <div class="headerContent">
        <div class="logo"></div>
        <div class="headerWrapper">
            <a class="navigation" onClick={toMenu}>Home</a>
            <a class="navigation" href="https://github.com/Ethan-Peters/Tezos_Snake" target="_empty">Source Code</a>
        </div>
        </div>
    </header>

    return (
        <div>
            { header }
            <div class="body">
                <div class="card"><div class="overlay"></div></div>
                { gameState === "About" &&
                    <h1>:)</h1>
                }
                { gameState === "Menu" &&
                    <div class="wrapper">
                        <div class="column">
                            <h1 class="title"><span class="heavy">Tez-Snake</span></h1>
                            {welcomeMessage}
                        </div>
                        {idRecieved && <div class="buttonContainer"><button onClick={playGame}>Play Game</button></div>}
                        <TUVS_ConnectionInterface/>
                    </div>
                }
                { gameState === "Running" &&
                    <div>
                        <h1>Score: {score}</h1>
                        <App gameOverCallback={gameOver} updateScoreCallback={updateScore} snakeColor={getValueByKey("Snake Color", "#FFFFFF")}/>
                    </div>
                }
                { gameState === "GameOver" &&
                    <div>
                        <TUVS_GameOverInterface score={score} highScore={highScore}/>
                        <div class="buttonContainer">
                            <button onClick={playGame}>Play Again</button>
                            <button onClick={toMenu}>Main Menu</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Menu;