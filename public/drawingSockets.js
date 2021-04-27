var socket;
let button, greeting, input;


function preload() {
  dyslexic = loadFont('assets/OpenDyslexic-Regular.otf');

}

function setup() {

	var cnv = createCanvas(800,600);
	cnv.center();
	background(100);

	socket = io.connect('http://localhost:3000');
	socket.on('mouse', newDrawing);

	textFont(dyslexic);
	greeting = createElement('h2', 'Collaborative Drawing Game');
	greeting.position(cnv.width/2, 10);


	buttonA = createButton('player 1');
	buttonA.position(cnv.x + cnv.width/2 - 60, cnv.y-40);
  	buttonA.mousePressed(playerA);

  	buttonB = createButton('player 2');
  	buttonB.position(cnv.x + cnv.width/2 + 30, cnv.y-40);	
  	buttonB.mousePressed(playerB);

  	textFont(dyslexic);

  	textSize(20);
  	fill(200, 200, 250);
  	var prompt = text('Prompt: ', 100 + 40, 30);


  	 input = createInput();
  	 input.position(cnv.x + 200, cnv.y+cnv.height+20);

  	 button = createButton('submit');
  	 button.position(input.x + input.width+40, input.y);
  	 button.mousePressed(result);
}

function newDrawing(data){

	// noStroke();
	fill(255);
	// ellipse(mouseX,mouseY, 10, 10);

	stroke(100,0,240);
	strokeWeight(3);
    line(data.x, data.y, data.px, data.py);

    



 //    const rc = rough.svg(svg);
	// let node = rc.line(data.x, data.y, data.px, data.py); // x1, y1, x2, y2
	// svg.appendChild(node);
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
	// ellipse(mouseX,mouseY, 10, 10);

	stroke(255);
	strokeWeight(4);
    line(mouseX, mouseY, pmouseX, pmouseY);


}

function draw() {	
}

function playerA() {
  // let val = random(255);
  background(50);
  fill(200, 200, 250);

  prompt = text('Prompt: ' + 'The quick brown fox ' + '________', 100 + 40, 30);
  buttonB.attribute('disabled', '');
}

function playerB() {
  // let val = random(255);
  background(50);
  fill(200, 200, 250);

  prompt = text('Prompt: ' + ' ________ ' + 'is dancing in the rain', 100 + 40, 30);
  buttonA.attribute('disabled', '');
}

function result() {
  // let val = random(255);
  background(50);
  fill(250, 100, 100);

  prompt = text('Incorrect!', 100 + 40, 30);
  buttonA.attribute('disabled', '');
}




