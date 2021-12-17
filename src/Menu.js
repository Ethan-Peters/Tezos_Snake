import React, { useEffect, useState } from 'react';
import App from './App';
import './index.css';
import TUVS from './TUVS/tuvs'

const welcomeMessage = <p>
  Welcome to Tez-Snake! This game uses the Tezos User Verification System (TUVS)
  to create user profiles and store data securely on the blockchain. If you have
  already created a TUVS identity, you can continue to Tez-Snake by connecting
  your wallet below.
</p>

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
            { gameState === "Menu" &&
                <div>
                    <h1>Tez-Snake</h1>
                    {welcomeMessage}
                    <TUVS_ConnectionInterface/>
                    {idRecieved && <button onClick={playGame}>Play Game</button>}
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
    )
}

export default Menu;