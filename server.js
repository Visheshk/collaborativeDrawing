var express = require('express');
var connectionsLimit = 2;

var obj = {
   table: []
  };

var app = express();
var server = app.listen(process.env.PORT || 3000);
var socket = require('socket.io');
var rough = require('roughjs');

app.use(express.static('public'));

console.log("my socket is running");

var io = socket(server);

io.sockets.on('connection', newConnection);


function newConnection(socket){
	console.log('new connection : ' + socket.id);
	// console.log(socket);

	if (io.engine.clientsCount > connectionsLimit) {
    socket.emit('chat message', "Reached the limit of connections. Make sure you only have 1 window of the app open.");
    socket.disconnect();
    console.log('Disconnected...');
    return
  }

	socket.on('mouse', mouseMessage);
	socket.on('chat message', chatMessage);

	// emitting the drawing
	function mouseMessage (data) {
		socket.broadcast.emit('mouse', data);
		console.log(data);
		console.log(socket.id);
		obj.table.push(data);
  		// var dataString = JSON.stringify(obj);
	}

	// emitting chat msgs
	function chatMessage (msg) {
		io.emit('chat message', "Creator " + socket.id.slice(17) + ":  " + msg);
		console.log(msg);
		console.log(socket.id);

		// currently logging full json when a chat msg is sent
		console.log(obj);
	}
}


