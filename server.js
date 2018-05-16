const io = require('socket.io')();
const port = process.env.PORT || 3000;
var socket=io.listen(port);
console.log('listening on port ', port);

io.on('connection', socket => {
  socket.on('myData', message => {
	console.log('myData ', message);
 	setTimeout(() => {
	  socket.broadcast.emit('myData',message);;
	}, 50);
  });
});
