var socket;
let button, greeting, input;
var turn=0;
var currentTurn = true;
var playerNumber = -1;
var done = [false, false];

var obj = {
   table: []
  };

var cnv;
const sessionID = JSON.parse(localStorage.getItem("sessionID"));

function preload() {
  // drawingData = loadJSON("drawingData.json");
  
  console.log(sessionID);
  if (!sessionID) {
    // Simulate a mouse click:
    window.location.href = "/login.html";
  }
}

function setup() {
  // look for recorded room name and authenticated session id
  // if not found, redirect to login.html
  // else do the rest
  
  // else {
	cnv = createCanvas(600,600);
	cnv.position((windowWidth*2/3)-300, windowHeight/2-250);
  background(170);

	socket = io.connect('http://localhost:3000');
  try {
    // socket.playerID = sessionID.playerID;
    // socket.room = sessionID.room;
    // socket.connect();
    socket.emit("attach info", sessionID);
  }
  catch (err) {
    // console.log(err);
    window.location.href = "/login.html";
  }
  // socket = io.connect('https://afternoon-mountain-70127.herokuapp.com/');
  
	socket.on('mouse', newDrawing);

  textSize(20);
  fill(200, 200, 250);

  var messages = document.getElementById('messages');
  var form = document.getElementById('form');
  var input = document.getElementById('input');
  var parts = document.getElementById('parts');
  var instruction = document.getElementById('instruction');
  var switchButton = document.getElementById('switchButton');
  var turn = true;
  var doneButton = document.getElementById('done');

  // chat form. form input is put into chat msg
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', input.value);
      input.value = '';
    }
  });

  socket.on('chat message', sendMessage);

  socket.on('connect fail', () => {
    localStorage.removeItem("sessionID");
    window.href.location="/";
  })

  socket.on('player number', function (n) {    
    playerNumber = n;
    console.log("player number is: " + playerNumber);
  });

  doneButton.addEventListener("click", function(d){
    done[playerNumber] = true;
    socket.emit('done round', playerNumber);
    doneButton.disabled = true;
  });

  switchButton.addEventListener("click", function(e){
    e.preventDefault();
    
    socket.emit('finish turn', playerNumber);
    // socket.emit('finish turn', {"playerNumber": playerNumber});

  });

  socket.on('done round', (pno) => {
    console.log(pno + " " + playerNumber);
    if (playerNumber == pno){
      console.log("your turn just ended");
     if (done[1 - playerNumber]){alert("everyone is done");}
    }
    else {
     console.log("it's your turn now!!");
     if (done[playerNumber]){alert("everyone is done");}
     else {
      alert("other person is done");
      done[(1 - playerNumber)] = true;
    }
     // instruction.innerHTML = "&#128339;  " + "It is your partner's turn."  
    }


  });

  socket.on('turn set', (pno) => {
    console.log(pno + " " + playerNumber);
    if (playerNumber == pno){
      console.log("your turn just ended");
      currentTurn = false;
      parts.disabled = true;
      switchButton.disabled = true;
      instruction.innerHTML = "&#128339;  " + "It is your partner's turn."  
    }
    else {
      // parts.enabled = true;
      // switchButton.enabled = true;
      console.log("it's your turn now!!");
      currentTurn = true;
      parts.disabled = false;
      switchButton.disabled = false;
      instruction.innerHTML = "&#9997;  " + "It is your turn now. Pick a part: "  
      // instruction.innerHTML = "&#128339;  " + "It is your partner's turn."  
    }

  });

  // took input from dropdown and emitted
  parts.addEventListener("change", function() {
  // console.log("part selection");
  socket.emit('part selected', parts.value);
  
  });

  socket.on('part selected', partSelected);
  // }
}


function partSelected(part){
  // change the instruction text to part
  instruction.innerHTML = part;
}

// creating the list of messages
function sendMessage(msg){
  var item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
}

// creating the drawing in the new page
function newDrawing(data){
	fill(255);
	stroke(100,0,240);
	strokeWeight(6);
  line(data.x, data.y, data.px, data.py);
}

function mouseDragged() {

	var data = {
    pno: playerNumber,
		x:mouseX,
		y:mouseY,
		px: pmouseX,
		py: pmouseY
	}

	socket.emit('mouse', data);

	// noStroke();
	fill(255);
	stroke(255);
	strokeWeight(6);
  line(mouseX, mouseY, pmouseX, pmouseY);

  // json file write
  obj.table.push(data);
  var dataString = JSON.stringify(obj);
}

function draw() {	
}

function result() {
  // let val = random(255);
  background(50);
  fill(250, 100, 100);
}

// function windowResized() {
//   resizeCanvas(500,500,windowWidth/2 +100, windowHeight/2-300);
//   cnv.position(windowWidth/2 +100, windowHeight/2-300);
// }

