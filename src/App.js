import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import socketIOClient from 'socket.io-client';
const remoteSocket = socketIOClient("https://glacial-caverns-87661.herokuapp.com/");//'http://localhost:8000');

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
 var publicState = {
      stepNumber: 0,
 	  currentPlayer: "X"  
  }  
  
 
class Game extends React.Component {

  constructor(props) {
    super(props);
	remoteSocket.customInfo = publicState;
    this.state = {
		squares: Array(9).fill(null),
		stepNumber: 0,
		isFirstPlayer: true,
		currentPlayer: "X"
    };

   remoteSocket.on('myData', (newState) => {
 		// Same client, nothing to update
		if( (newState.currentPlayer===remoteSocket.customInfo.currentPlayer) && (newState.stepNumber===remoteSocket.customInfo.stepNumber) ) {
			return;
		}
		// Restart game request
		if( (newState.currentPlayer!==remoteSocket.customInfo.currentPlayer) && (newState.stepNumber===0)) {
			this.setState({
				squares: Array(9).fill(null),
				stepNumber: 0,
				isFirstPlayer: true,
				currentPlayer: "X"	  
			});		
		}
		else {
			this.setState({
				squares: newState.squares,
				stepNumber: newState.stepNumber,
				isFirstPlayer: !newState.isFirstPlayer		  
			});
		}
    });		
   }
  
  handleClick(i) {
    const squares = this.state.squares;
    if (calculateWinner(squares)) {
      return;
    }   
	// The only valid situation in which player 'Key' is set
	if( (this.state.stepNumber===1) && (this.state.isFirstPlayer===false) ){
		//this.state.currentPlayer = this.state.isFirstPlayer ? "X" : "O";
		var player="O";
		if(this.state.isFirstPlayer===true) {
			player="X";
		}
		this.state.currentPlayer=player;
		this.setState({
			squares: this.state.squares,
			stepNumber: this.state.stepNumber,
			isFirstPlayer: this.state.isFirstPlayer,			
			currentPlayer: player
		});
		
	}
	//this.forceUpdate();
	if(( ((isOdd(this.state.stepNumber))===true) && (this.state.currentPlayer==="X") ) ||  (((isEven(this.state.stepNumber))===true) && (this.state.currentPlayer==="O") ) ){
		alert('You need to wait for the second player move!');
		return;
	}
	

	remoteSocket.customInfo.currentPlayer=this.state.currentPlayer;
	remoteSocket.customInfo.stepNumber=this.state.stepNumber+1;
	squares[i] = this.state.isFirstPlayer ? "X" : "O";
	this.setState({
		squares: squares,
		stepNumber: ++this.state.stepNumber 	  
	});
	remoteSocket.emit('myData', this.state);
  }

 
  restartGame() {
    this.setState({
		stepNumber: 0,
		squares: Array(9).fill(null),
		isFirstPlayer: true,
		currentPlayer: "X"
    });
	this.state.stepNumber=0;
	remoteSocket.customInfo.currentPlayer="X";
	remoteSocket.customInfo.stepNumber=0;
	remoteSocket.emit('myData', this.state);		
  }  

  render() {

    const winner = calculateWinner(this.state.squares);
    let status;
    let gameOverClass="game-info";
    if (winner) {
		status = "The Winner is: " + winner;
		gameOverClass="game-over";
    } else if (this.state.stepNumber===9) {
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

function isEven(num) {
    return num % 2 === 0;
}

function isOdd(num) {
    return num % 2 === 1;
}

export default Game;
