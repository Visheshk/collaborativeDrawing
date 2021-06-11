var express = require('express');
var connectionsLimit = 2;
const crypto = require("crypto");
// const { InMemorySessionStore } = require("./server/sessionStore");
// const sessionStore = new InMemorySessionStore();

let players = [];
let current_turn = 0;
let timeOut;
let _turn = 0;
const MAX_WAITING = 5000;
const randomId = () => crypto.randomBytes(8).toString("hex");
const roomCodes = ["234", "543", "342", "152", "342"];

let roomPlayers = {};
for (rc in roomCodes) {
	roomPlayers[roomCodes[rc]] = [];
}
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
 	// console.log("userDeet" in socket);
	players.push(socket.id);
	// console.log(players);

	// if (io.engine.clientsCount > connectionsLimit) {

	socket.on('mouse', mouseMessage);
	socket.on('chat message', chatMessage);
	socket.on('part selected', partSelect);

  socket.on('room in', (roomCode) => {
  	//check roomCode is in list of rooms
  	console.log(roomCode);
  	let rcCheck = false;
  	rcs = String(roomCode);
  	console.log(roomPlayers);
  	if (roomCodes.indexOf(rcs) > -1 ) {
  		if (roomPlayers[rcs].length < 2){
  			rcCheck = true;
  			let sessObj = {
  				sessionID: randomId(),
  				userID: randomId(),
  				room: roomCode,
  				playerNumber: roomPlayers[rcs].length
  			};
  			roomPlayers[rcs].push(sessObj);
  			socket.userDeet = sessObj;
  			socket.join(rcs);

			  socket.emit("login session", sessObj);
  		}
		}
		if (rcCheck == false) {
			console.log("invalid rc");
			socket.emit("login fail");
		}
  });

  socket.on("attach info", (sessObj) => {
  	try{
	  	socket.join(sessObj.room);
	  	socket.auth = sessObj;
	  }
	  catch(err) {
	  	console.log(err);
	  	socket.emit("connect fail");
	  }
  })

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


	socket.on('done round', (pno) => {
    	console.log("turn finished by " + pno);
    	// console.log(socket);
    	console.log(socket.auth);
    	io.to(socket.auth.room).emit('done round', (pno));
    });

    socket.on('finish turn', (pno) => {
    	// console.log("room" in socket);
    	// console.log(socket);
    	console.log("turn finished by " + socket.auth.playerNumber);
    	// console.log(socket);
    	// console.log(socket.auth);
    	// var i = 0;
    	// for (var c in io.engine.clients) {
    	// 	io.to(c).emit("player number", i);		
    	// 	i = i + 1;
    	// }
    	io.to(socket.auth.room).emit('turn set', pno);
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
		socket.broadcast.to(socket.auth.room).emit('mouse', data);
		console.log(data);
		// console.log(socket.id);
		obj.table.push(data);
  		// var dataString = JSON.stringify(obj);
	}

	// emitting chat msgs
	function chatMessage (msg) {
		// console.log(socket.auth);
		try{
			socket.broadcast.to(socket.auth.room).emit('chat message', "Partner:  "  + msg);
		}
		catch (err) {
			console.log("socket didn't have room info??");
		}
		socket.emit('chat message', "You:  " + msg);
		console.log(msg);
		// console.log(socket.id);

		// currently logging full json when a chat msg is sent
		console.log(obj);
	}

	function partSelect(part){
		// console.log(socket.auth);
		socket.broadcast.to(socket.auth.room).emit('part selected', "&#128339;  Partner is drawing the: " + part);
		socket.emit('part selected', "&#9997;  It is your turn to draw. You chose the: " );
	}

}


