var socket;
let button, greeting, input;


function preload() {
  nunito = loadFont('assets/Nunito-Bold.ttf');
}

function setup() {

  var cnv = createCanvas(600,600);
  cnv.center();
  background(170);

  socket = io.connect('http://localhost:3000');
  // socket = io.connect('https://afternoon-mountain-70127.herokuapp.com/');
  
  socket.on('mouse', newDrawing);


  textFont(nunito);
  textSize(20);
  fill(200, 200, 250);

  var messages = document.getElementById('messages');
  var form = document.getElementById('form');
  var input = document.getElementById('input');

  // chat form
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', input.value);
      input.value = '';
    }
  });

  // broadcasting chat
  socket.on('chat message', function(msg) {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });
}

function newDrawing(data){
  // noStroke();
  fill(255);
  stroke(100,0,240);
  strokeWeight(3);
  line(data.x, data.y, data.px, data.py);
}


function mouseDragged() {
  console.log(mouseX + ',' + mouseY);

  var data = {
    x:mouseX,
    y:mouseY,
    px: pmouseX,
    py: pmouseY
  }

  socket.emit('mouse', data);

  // noStroke();
  fill(255);
  stroke(255);
  strokeWeight(4);
  line(mouseX, mouseY, pmouseX, pmouseY);
}

function draw() { 
}


function result() {
  // let val = random(255);
  background(50);
  fill(250, 100, 100);
}




