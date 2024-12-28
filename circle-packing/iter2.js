// preset 1
let circles = [];
const maxRadius = 10;
const maxAttempts = 100;
const avoidedCircles = 2;
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
const rotationSpeed = 0.02;
const deathRate = 0.002;
const newCirclesPerFrame = 10;
const avoidedCircleRadius = 100;
const distanceToEdge = 0.5;

// // preset 2
// let circles = [];
// const maxRadius = 20;
// const maxAttempts = 1000;
// const avoidedCircles = 3;
// const canvasWidth = window.innerWidth;
// const canvasHeight = window.innerHeight;
// const rotationSpeed = 0.01;
// const deathRate = 0.002;
// const newCirclesPerFrame = 3;
// const avoidedCircleRadius = 75;
// const distanceToEdge = 0.7;

// pink palette
const colors = [
		[215, 192, 208],
		[247, 199, 219],
		[247, 154, 211],
		[200, 111, 201],
		[142, 81, 141],
]
const backgroundColor = [247, 233, 240];

// runs once
function setup() {
	createCanvas(canvasWidth, canvasHeight);
	strokeWeight(0);

	// initialize avoided circles
	for (let i = 0; i < avoidedCircles; i++) {
		circles.push({x: 0, y: 0, radius: avoidedCircleRadius});
	}

	// "seed" the simulation with a number of circles
	for (let i = 0; i < 1000; i++) {
		const radius = ((Math.random() ** 2) * maxRadius * 0.8) + maxRadius * 0.2;
		addCircle(radius);
	}
}

// runs every frame
function draw() {
	// clear the screen
	background(...backgroundColor);

	// update the positions of the avoided circles
	for (let i = 0; i < avoidedCircles; i++) {
		const coords = generateCircleCoordinates(i);
		circles[i] = {x: coords.x, y: coords.y, radius: circles[i].radius};
	}

	// render circles and adjust their age
	for (let i = avoidedCircles; i < circles.length; i++) {
		const c = circles[i];

		if (!c.dying) {
			// advance circle age
			if (c.age < 1) c.age += 0.02;

			// make circles die at a random rate
			if (Math.random() < deathRate) c.dying = true;
		} else {
			// reduce circle age
			c.age -= 0.1;

			// if age reaches zero, "kill" (delete) the circle
			if (c.age <= 0) {
				circles.splice(i, 1);
				i--;
			}
		}

		// transparent at age = 0, opaque at age = 1
		const opacity = c.age * 255;

		// set the fill color based on the circle's color index
		fill(...colors[c.colorIndex], opacity);

		// draw the circle
		circle(c.x, c.y, c.radius * 2);
	}
	
	// attempt to add new circles
	for (let i = 0; i < newCirclesPerFrame; i++) {
		const radius = ((Math.random() ** 2) * maxRadius * 0.8) + maxRadius * 0.2;
		addCircle(radius);
	}

	// prune circles that are within the circles to be avoided
	for (let i = avoidedCircles; i < circles.length; i++) {
		const circ = circles[i];
		for (let j = 0; j < avoidedCircles; j++) {
			const avoid = circles[j];
			if (testIntersection(circ, avoid)) {
				circ.dying = true;
				break; // only breaks out of the outer for loop
			}
		}
	}
}

// generates points around a circle that rotate over time
function generateCircleCoordinates(idx) {
	const theta = idx * 2 * Math.PI / avoidedCircles + frameCount * rotationSpeed;
	return {
		x: canvasWidth / 2 + Math.sin(theta) * canvasWidth / 2 * distanceToEdge,
		y: canvasHeight / 2 + Math.cos(theta) * canvasHeight / 2  * distanceToEdge,
	}
}

// attempts to find a circle placement that doesn't overlap any other circle
// returns true if a circle placement was found, and false if it wasn't
function addCircle(radius) {
	attempt: for (let i = 0; i < maxAttempts; i++) {
		// generate a random coordinate and use them to create a test circle object
		const x = Math.random() * (canvasWidth - 2 * radius) + radius;
		const y = Math.random() * (canvasHeight - 2 * radius) + radius;
		const newCircle = {x, y, radius, colorIndex: 0, age: 0, dying: false};
		
		// check to see if the circle overlaps any other circle
		// skips to the next attempt if it does
		for (const c of circles) {
			if (testIntersection(newCircle, c)) continue attempt;
		}
		
		// generate a random color for the new circle
		newCircle.colorIndex = Math.floor(Math.random() * colors.length);

		// add the new circle to the list of circles
		circles.push(newCircle);
		return true;
	}
	
	// maxAttempts was reached without a valid placement
	return false;
}

// tests to see if two circles intersect by calculating the distance
// between them and comparing it to their summed radii
function testIntersection(c1, c2) {
	// bounding box test (less computationally intensive)
	if (Math.abs(c1.x - c2.x) > c1.radius + c2.radius &&
		Math.abs(c1.y - c2.y) > c1.radius + c2.radius) return false;
	
	// distance test
	const dist = (c1.x - c2.x) ** 2 + (c1.y - c2.y) ** 2;
	if (dist < (c1.radius + c2.radius) ** 2) return true;
	else return false;
}