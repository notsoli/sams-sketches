let circles = [];
const maxRadius = 20;
const maxAttempts = 1000;
const avoidedCircles = 10;
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;

// // blue and peach palette
// const colors = [
//     [0, 27, 46],
//     [41, 76, 96],
//     [173, 182, 196],
//     [255, 218, 183],
//     [255, 196, 155]
// ];
// const backgroundColor = [247, 238, 233];

// pink palette
const colors = [
		[215, 192, 208],
		[247, 199, 219],
		[247, 154, 211],
		[200, 111, 201],
		[142, 81, 141],
]
const backgroundColor = [247, 233, 240];

function setup() {
	createCanvas(canvasWidth, canvasHeight);
	addAvoidedCircles();

	strokeWeight(0);
}

let frame = 0;
function draw() {
	background(...backgroundColor);
	
	for (let i = avoidedCircles; i < circles.length; i++) {
		const c = circles[i];

		console.log(c.colorIndex);
		const opacity = Math.min(1, (frame - i - 5) / 60) * 255;
		fill(...colors[c.colorIndex], opacity);

		circle(c.x, c.y, c.radius * 2);
	}
	
	const radius = ((Math.random() ** 2) * maxRadius * 0.8) + maxRadius * 0.2;
	if (!addCircle(radius)) {
		circles = [];
		addAvoidedCircles();
		frame = -1;
	}

	frame++;
}

function addAvoidedCircles() {
	for (let i = 0; i < avoidedCircles; i++) {
		// // follows the same circle packing rules
		// 	const radius = Math.random() * 150 + 50;
		// 	addCircle(radius);

		// placement is unrestricted
		const x = Math.random() * canvasWidth;
		const y = Math.random() * canvasHeight;
		const radius = Math.random() * 150 + 50;
		circles.push({x, y, radius, colorIndex: 0});
	}
}

function addCircle(radius) {
	attempt: for (let i = 0; i < maxAttempts; i++) {
		const x = Math.random() * (canvasWidth - 2 * radius) + radius;
		const y = Math.random() * (canvasHeight - 2 * radius) + radius;
		
		for (const c of circles) {
			const dist = (x - c.x) ** 2 + (y - c.y) ** 2;
			if (dist < (c.radius + radius) ** 2) continue attempt;
		}
		
		const colorIndex = Math.floor(Math.random() * colors.length);
		circles.push({x, y, radius, colorIndex});
		return true;
	}
	
	return false;
}