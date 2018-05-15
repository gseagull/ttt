const io = require('socket.io')();
const express = require('express')();
const port = process.env.PORT || 3000;
var socket=io.listen(port);
console.log('listening on port ', port);


const server = express()
  .listen(port, () => console.log(`Listening on ${ port }`));
 
const io2 = socketIO(server);
 io2.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});
io.on('connection', (client) => {
  client.on('subscribeToTimer', (interval) => {
    console.log('client is subscribing to timer with interval ', interval);
    setInterval(() => {
      client.emit('timer', new Date());
    }, interval);
  });
  client.on('myData', (message) => {
    console.log('client message ', message);
	console.log('client.id ', client.id);
	
	//socket.broadcast.emit('myData',message); 
    //io.emit('myData',message,include_self=false); 
	//io.emit('myData',message); 
  });
  
});

io.on('connection', socket => {

  socket.on('myData', boardId => {
	console.log('aaa ', boardId);
    socket.join(`board${boardId}`);
  });

  socket.on('myData', message => {
	console.log('44444444444444 ', message);
    //const room = `board${card.board}`;
    //socket.broadcast.to(room).emit('card/create', card);
	 
	
	setTimeout(() => {
	  socket.broadcast.emit('myData',message);;
	}, 50);
  });
});




/*
socket.sockets.on('connection', function (socket) {
    console.log('A client is connected!');
  socket.on('myData', message => {
	console.log('bbb ', message);
    //const room = `board${card.board}`;
    //socket.broadcast.emit('myData',message);
	//socket.broadcast.to(room).emit('card/create', card);
  });	
});
*/