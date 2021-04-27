var express = require('express');

var app = express();
var server = app.listen(3000);
var socket = require('socket.io');


var rough = require('roughjs');


app.use(express.static('public'));

console.log("my socket is running");

var io = socket(server);

io.sockets.on('connection', newConnection);


function newConnection(socket){
	console.log('new connection : ' + socket.id);
	// console.log(socket);


	socket.on('mouse', mouseMessage);

	function mouseMessage (data) {

		socket.broadcast.emit('mouse', data);
		console.log(data);
	}
}


