import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import { subscribeToTimer } from './api';
//import { socket } from './api';
import socketIOClient from 'socket.io-client';
const socket2 = socketIOClient('http://localhost:8000');

//var cache = require('persistent-cache');
//var gameCache = cache();
/*
var storage = require('node-persist');
var http = require('http');
	storage.init({
	dir:'c:',
	stringify: JSON.stringify,
	parse: JSON.parse,
	encoding: 'utf8',
	logging: false,
	continuous: true,
	interval: false
});
*/
//  var dirty = require('dirty');
//  var db = dirty('user.db');
//const Store = require('data-store');
//const db = new Store({ path: 'config.json' });  
/*var cache = require('memory-cache');
var newCache = new cache.Cache();
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();*/
//var Redis = require('redis-stream');
//var client = new Redis(6379, 'localhost', 0);

//const fc = require('node-file-cache').create();
//var memoryCache = require('memory-cache-stream');
 

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
	socket2.customInfo = publicState;
    this.state = {
	  squares: Array(9).fill(null),
      stepNumber: 0,
      isFirstPlayer: true,
	  currentPlayer: "X"
    };
	subscribeToTimer((err, timestamp) => this.setState({ 
		timestamp 
    }));

   socket2.on('myData', (newState) => {
      
		// Same client, nothing to update

		if( (newState.currentPlayer===socket2.customInfo.currentPlayer) && (newState.stepNumber===socket2.customInfo.stepNumber) ) {
			return;
		}
		this.setState({
		  squares: newState.squares,
		  stepNumber: newState.stepNumber,
		  isFirstPlayer: !newState.isFirstPlayer		  
		});
	  
	  
    });		
 
  }
  /*
  	state = {
	  timestamp: 'no timestamp yet'
	};
*/

  
  handleClick(i) {
  
    
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
	this.forceUpdate();
	if(( ((isOdd(this.state.stepNumber))===true) && (this.state.currentPlayer==="X") ) ||  (((isEven(this.state.stepNumber))===true) && (this.state.currentPlayer==="O") ) ){
		alert('You need to wait for the second player move!');
		return;
	}
	
    const squares = this.state.squares;
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
	socket2.customInfo.currentPlayer=this.state.currentPlayer;
	socket2.customInfo.stepNumber=this.state.stepNumber+1;
    squares[i] = this.state.isFirstPlayer ? "X" : "O";
	/*this.state.squares = squares;
	this.state.stepNumber = this.state.stepNumber + 1;
	this.state.isFirstPlayer = !this.state.isFirstPlayer;
	*/
	this.setState({
		  squares: squares,
		  stepNumber: ++this.state.stepNumber //,
		  //isFirstPlayer: !this.state.isFirstPlayer,		  
	});
// 	const socket3 = socketIOClient('http://localhost:8000');
	socket2.emit('myData', this.state);
  }

 
  restartGame() {
    this.setState({
      stepNumber: 0,
	  squares: Array(9).fill(null),
      isFirstPlayer: true,
	  currentPlayer: "X"
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

function isEven(num) {
    return num % 2 === 0;
}

function isOdd(num) {
    return num % 2 === 1;
}


export default Game;
