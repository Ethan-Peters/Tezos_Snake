import './index.css';
import Snake from './Snake';
import React from 'react';
import Food from './Food';

const getRandomCoordinates = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random()*(max-min+1)+min)/2)*2;
  let y =  Math.floor((Math.random()*(max-min+1)+min)/2)*2;
  return [x,y];
}
const initialState = {
  snakeDots:[
    [0, 0],
    [2, 0]
  ],
  food: getRandomCoordinates(),
  direction: 'RIGHT',
  speed: 200
};

class App extends React.Component {
  state = initialState

  componentDidMount() {
    setInterval(this.moveSnake, this.state.speed);
    document.onkeydown = this.onKeyDown;
  }

  moveSnake = () =>{
    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];
    switch (this.state.direction) {
      case 'RIGHT':
        head = [head[0] + 2, head[1]];
        break;
      case 'LEFT':
        head = [head[0] - 2, head[1]];
        break;
      case 'DOWN':
        head = [head[0], head[1] + 2];
        break;
      case 'UP':
        head = [head[0], head[1] - 2];
        break;
    }
    dots.push(head);
      dots.shift();
      this.setState({
        snakeDots: dots
      })
    this.checkIfOutOfBounds();
    if(this.checkIfFood()){
      this.setState({
        food: this.getNewFood()
      });
      this.enlargeSnake();
      if(this.state.speed > 50){
        this.setState({speed: this.state.speed -10});
      }
    }
    this.checkIfColliding();
  }
  onKeyDown = (e) => {
    e = e || window.event;
    switch (e.keyCode) {
      case 38:
        if(this.state.direction != 'DOWN')
          this.setState({direction: 'UP'});
        break;
      case 40:
        if(this.state.direction != 'UP')
          this.setState({direction: 'DOWN'});
        break;
      case 37:
        if(this.state.direction != 'RIGHT')
          this.setState({direction: 'LEFT'});
        break;
      case 39:
        if(this.state.direction != 'LEFT')
          this.setState({direction: 'RIGHT'});
        break;
    }
  }

  checkIfOutOfBounds=()=>{
    let head = this.state.snakeDots[this.state.snakeDots.length - 1];
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      this.onGameOver();
    }
  }
  checkIfFood=()=>{
    let head = this.state.snakeDots;
    let food = this.state.food;
    if(food[0] == head[head.length-1][0] && food[1] == head[head.length-1][1]){
      return true;
    }
    else{
      return false;
    }
  }

  onGameOver=()=>{
    // alert(`GAME OVER! Your score was ${this.state.snakeDots.length}`);
    this.setState(initialState);
    this.props.gameOverCallback();
  }

  enlargeSnake=()=>{
    let newSnake = this.state.snakeDots;
    newSnake.unshift([]);
    this.setState({
      snakeDots: newSnake
    });
    this.props.updateScoreCallback(this.state.snakeDots.length);
  }

  checkIfColliding=()=>{
    let head = this.state.snakeDots[this.state.snakeDots.length-1];
    let snake = this.state.snakeDots;
    for(let x = 0; x < snake.length -1; x++){
      if(snake[x][0] ==head[0] && snake[x][1] == head[1]){
        this.onGameOver();
      }
    }
  }
  getNewFood=()=>{
    let flag = true;
    let coordinates = getRandomCoordinates();
    let snake = this.state.snakeDots;
    for(let x = 0; x < snake.length; x++){
      if(snake[x][0] ==coordinates[0] && snake[x][1] == coordinates[1]){
        flag = false;
      }
    }
    if(flag){
      return coordinates;
    }
    else{
      this.getNewFood();
    }
  }
  render() {
    return (
        <div className = "game-area">
          <Snake snakeDots={this.state.snakeDots} snakeColor={this.props.snakeColor}/>
          <Food dot={this.state.food}/>
        </div>
      );
  }
}

export default App;
