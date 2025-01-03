const canvasWidth = Math.min(window.innerWidth, window.innerHeight);
const canvasHeight = Math.min(window.innerWidth, window.innerHeight);

const ROTATION = 20;
const STRANDS = 10;
const STRAND_LENGTH = 8;
const BORDER_WIDTH = 0.2;
const BORDER_HEIGHT = 0.05;
const MAX_AREA = 0.02;

// runs once
function setup() {
	createCanvas(canvasWidth, canvasHeight);
    background(255);
    stroke(201, 70, 22, 124);
    strokeWeight(1);

    for (let j = 0; j < STRANDS; j++) {
        let startCoord = [
            Math.random() * 0.6 + 0.2,
            Math.random() * 0.6 + 0.2,
        ];
        for (let i = 0; i < STRAND_LENGTH; i++) {
            let endCoord = [0, 0];
            while (true) {
                endCoord = [
                    startCoord[0] + Math.random() * 0.6 - 0.3,
                    startCoord[1] + Math.random() * 0.6 - 0.3, 
                ];

                // test to see if all points in the rectangle stay in bounds if rotated
                const rotatedCoords = [
                    rotatePoint(0.5, 0.5, endCoord[0], endCoord[1], ROTATION),
                    rotatePoint(0.5, 0.5, endCoord[0], startCoord[1], ROTATION),
                    rotatePoint(0.5, 0.5, startCoord[0], endCoord[1], ROTATION),
                ];

                let inBounds = true;
                for (const coord of rotatedCoords) {
                    if (coord[0] < BORDER_WIDTH || coord[0] > 1 - BORDER_WIDTH ||
                        coord[1] < BORDER_HEIGHT || coord[1] > 1 - BORDER_HEIGHT) inBounds = false;
                }

                const area = Math.abs(endCoord[0] - startCoord[0]) *
                             Math.abs(endCoord[1] - startCoord[1]);
                
                if (inBounds && area < MAX_AREA) break;
            }

            const newRect = [...startCoord, ...endCoord];
            drawRect(newRect, Math.random() * 0.002 + 0.002);
            startCoord = endCoord;
        }
    }
}

/**
 * Draws a given rectangle using individual lines at a given density.
 * @param {number[]} rect the rectangle to draw, in the form [x1, y1, x2, y2]
 * @param {number} density how many pixels between each line (1..*)
 */
function drawRect(rect, density) {
    // determine if the width or height is larger
    const width = Math.abs(rect[2]-rect[0]);
    const height = Math.abs(rect[3]-rect[1]);

    // determine if lines should be drawn forwards or backwards
    const positiveStride = width > height ? rect[3] > rect[1] : rect[2] > rect[0];
    
    // draw lines along the larger axis
    const smallerLength = width > height ? height : width;
    for (let i = 0; i < smallerLength; i += density) {
        const stride = positiveStride ? i : -i;
        let newLine = width > height ? 
            [rect[0], rect[1] + stride, rect[2], rect[1] + stride] :
            [rect[0] + stride, rect[1], rect[0] + stride, rect[3]];

        // rotate line around origin
        newLine = [
            ...rotatePoint(0.5, 0.5, newLine[0], newLine[1], ROTATION),
            ...rotatePoint(0.5, 0.5, newLine[2], newLine[3], ROTATION)
        ];

        // scale line to screen coords and draw line
        for (let i = 0; i < 4; i++) newLine[i] *= canvasWidth;
        line(...newLine);
    }
}

/**
 * Rotates a point in 2D space a certain number
 * of degrees around another point.
 * 
 * @param {number} cx center x-coordinate
 * @param {number} cy center y-coordinate
 * @param {number} x x-coordinate of point to rotate
 * @param {number} y y-coordinate of point to rotate
 * @param {number} angle angle to rotate (in degrees)
 * 
 * @returns A rotated point.
 */
function rotatePoint(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}