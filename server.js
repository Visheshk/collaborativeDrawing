var express = require('express');
var connectionsLimit = 2;

let players = [];
let current_turn = 0;
let timeOut;
let _turn = 0;
const MAX_WAITING = 5000;


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
	// console.log('new connection : ' + socket.id);
	// console.log(socket);
	players.push(socket.id);
	console.log(players);

	if (io.engine.clientsCount > connectionsLimit) {
		socket.emit('chat message', "Reached the limit of connections. Make sure you only have 1 window of the app open.");
		socket.disconnect();
	    console.log('Disconnected...');
	    return
	}
	else {
		setPlayerNumbers(players);
		// socket.emit('player number', players.indexOf(socket.id));
		// socket.broadcast.emit('playerInfo')
	}


	socket.on('mouse', mouseMessage);
	socket.on('chat message', chatMessage);
	socket.on('part selected', partSelect);

	socket.on('disconnect', function(){
	    console.log('A player disconnected');
	    players.splice(players.indexOf(socket),1);
	    _turn--;
	    console.log("The number of players now ", players.length);
	    setPlayerNumbers(players);
	});

	// socket.on('play turn', function(turn){
	// 	socket.broadcast.emit('play turn', turn);
	// 	socket.emit('play turn', turn);
	// 	// _turn++;
	// 	// console.log('Turn just switched' + _turn);
	// 	// console.log(players.indexOf(socket.id));
	// })

	// emit turn is player to the other person
	socket.on('play turn', (son) => {
        // socket.broadcast.emit('turnPlayed', {

        // });
        socket.emit('play turn', currentturn);
        socket.broadcast.emit('play turn', !currentturn);
        console.log(currentturn);
    });

    socket.on('finish turn', (pno) => {
    	console.log("turn finished by " + pno);
    	// var i = 0;
    	// for (var c in io.engine.clients) {
    	// 	io.to(c).emit("player number", i);		
    	// 	i = i + 1;
    	// }
    	io.emit('turn set', (pno));
    });

    function setPlayerNumbers(players) {
    	// console.log(io.engine.clients);
    	var i = 0;
    	for (var c in io.engine.clients) {
    		console.log(i + " " + c);
    		io.to(c).emit("player number", i);		
    		i = i + 1;
    	}
    }

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
		socket.broadcast.emit('chat message', "Partner:  "  + msg);
		socket.emit('chat message', "You:  " + msg);
		console.log(msg);
		console.log(socket.id);

		// currently logging full json when a chat msg is sent
		console.log(obj);
	}

	function partSelect(part){
		socket.broadcast.emit('part selected', "&#128339;  Partner is drawing the: " + part);
		socket.emit('part selected', "&#9997;  It is your turn to draw. You chose the: " );
	}

}


