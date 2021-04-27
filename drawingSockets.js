var socket;
let button;

function setup() {

  createCanvas(800,600);
  background(51);

  socket = io.connect('http://localhost:3000');
  socket.on('mouse', newDrawing);


  button = createButton('click me');
    button.position(19, 19);
    button.mousePressed(changeBG);

}

function newDrawing(data){

  noStroke();
  fill(100, 0, 240);
  ellipse(data.x,data.y, 10, 10);


}



function mouseDragged() {
  console.log(mouseX + ',' + mouseY);

  var data = {
    x:mouseX,
    y:mouseY
  }

  socket.emit('mouse', data);

  noStroke();
  fill(255);
  ellipse(mouseX,mouseY, 10, 10);  

}

function draw() {


  
}

function changeBG() {
  let val = random(255);
  background(val);
}
