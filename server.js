var express = require('express');
var connectionsLimit = 2;

var obj = {
   table: []
  };

var app = express();
var server = app.listen(process.env.PORT || 3000);
var socket = require('socket.io');
var rough = require('roughjs');
var username = "user";

app.use(express.static('public'));

console.log("my socket is running");

var io = socket(server);

io.sockets.on('connection', newConnection);


function newConnection(socket){
	console.log('new connection : ' + socket.id);
	// console.log(socket);

	if(io.engine.clientsCount = 1){username = "dino"}
	if(io.engine.clientsCount = 2){username = "panda"}

	if (io.engine.clientsCount > connectionsLimit) {
    socket.emit('chat message', "Reached the limit of connections. Make sure you only have 1 window of the app open.");
    socket.disconnect();
    console.log('Disconnected...');
    return
  }

	socket.on('mouse', mouseMessage);
	socket.on('chat message', chatMessage);
	socket.on('part selected', partSelect);

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
		// socket.broadcast.emit('chat message', "Partner: " + socket.id.slice(17) + ":  " + msg);
		// socket.emit('chat message', "You: " + socket.id.slice(17) + ":  " + msg);
		socket.broadcast.emit('chat message', "Partner:  "  + msg);
		socket.emit('chat message', "You:  " + msg);

		console.log(msg);
		console.log(socket.id);

		// currently logging full json when a chat msg is sent
		console.log(obj);
	}

	function partSelect(part){
		socket.broadcast.emit('part selected', part);
	}
}


