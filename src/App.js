import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
		<div id="logo" className="game-logo">
			<img src={logo} alt="Tic Tac Toe game"/>
		</div>
		
	  
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
		
			
      </div>

	  
	  
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
	  squares: Array(9).fill(null),
      stepNumber: 0,
      isFirstPlayer: true
    };
  }

  handleClick(i) {
    const squares = this.state.squares;
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.isFirstPlayer ? "X" : "O";
    this.setState({
	  squares: squares,
      stepNumber: this.state.stepNumber + 1,
      isFirstPlayer: !this.state.isFirstPlayer
    });
  }

 
  restartGame() {
    this.setState({
      stepNumber: 0,
	  squares: Array(9).fill(null),
      isFirstPlayer: true
    });
  }  

  render() {
    const winner = calculateWinner(this.state.squares);

    let status;
	let gameOverClass="game-info";
    if (winner) {
      status = "The Winner is: " + winner;
	  gameOverClass="game-over";
    } else if (this.state.stepNumber===9){
	  status = "Game Tie";
	  gameOverClass="game-over";
	}
	else {
      status = "Player " + (this.state.isFirstPlayer ? "X" : "O") + " move";
    }

    return (

	<div id="game" className="game">
		<div id="board" className="game-board">
          <Board
            squares={this.state.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div id="info" className="game-info">
          <div id="info-status" className={gameOverClass}>{status}</div>
		  <div id="info-restart" className="game-info"><button onClick={() => this.restartGame()}>Restart Game</button></div>
        </div>
		
	</div>
	  
    );
  }
}


ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const winningOptions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < winningOptions.length; i++) {
    const [a, b, c] = winningOptions[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


export default Game;
