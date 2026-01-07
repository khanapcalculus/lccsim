const canvas = document.getElementById('integrationCanvas');
const ctx = canvas.getContext('2d');

const functionInput = document.getElementById('functionInput');
const lowerBoundInput = document.getElementById('lowerBound');
const upperBoundInput = document.getElementById('upperBound');
const numIntervalsSlider = document.getElementById('numIntervals');
const numIntervalsValue = document.getElementById('numIntervalsValue');
const methodSelect = document.getElementById('method');
const formulaDisplay = document.getElementById('formulaDisplay');
const integrationInfo = document.getElementById('integrationInfo');

let funcString = 'x^2';
let lowerBound = 0;
let upperBound = 4;
let numIntervals = 10;
let method = 'left';

const padding = 60;
const graphWidth = canvas.width - 2 * padding;
const graphHeight = canvas.height - 2 * padding;
const centerY = canvas.height / 2;

// Simple function parser and evaluator
function parseFunction(str) {
    // Replace common math functions
    str = str.replace(/\s/g, ''); // Remove spaces
    str = str.replace(/sin\(/g, 'Math.sin(');
    str = str.replace(/cos\(/g, 'Math.cos(');
    str = str.replace(/tan\(/g, 'Math.tan(');
    str = str.replace(/exp\(/g, 'Math.exp(');
    str = str.replace(/ln\(/g, 'Math.log(');
    str = str.replace(/log\(/g, 'Math.log10(');
    str = str.replace(/sqrt\(/g, 'Math.sqrt(');
    str = str.replace(/abs\(/g, 'Math.abs(');
    str = str.replace(/\^/g, '**'); // Replace ^ with **
    
    return str;
}

function evaluateFunction(x) {
    try {
        const parsed = parseFunction(funcString);
        // Replace x with the actual value
        const expression = parsed.replace(/x/g, `(${x})`);
        // Evaluate safely
        return Function('"use strict"; return (' + expression + ')')();
    } catch (e) {
        return 0;
    }
}

function updateValues() {
    funcString = functionInput.value || 'x^2';
    lowerBound = parseFloat(lowerBoundInput.value) || 0;
    upperBound = parseFloat(upperBoundInput.value) || 4;
    numIntervals = parseInt(numIntervalsSlider.value) || 10;
    method = methodSelect.value;
    
    // Ensure bounds are valid
    if (lowerBound >= upperBound) {
        upperBound = lowerBound + 1;
        upperBoundInput.value = upperBound;
    }
    
    numIntervalsValue.value = numIntervals;
    
    draw();
    updateFormula();
    updateInfo();
}

function syncNumIntervals() {
    numIntervals = parseInt(numIntervalsValue.value) || 10;
    numIntervalsSlider.value = numIntervals;
    updateValues();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Find function range for scaling
    const range = findFunctionRange();
    const minY = range.min;
    const maxY = range.max;
    const yRange = maxY - minY || 1;
    
    // Add padding to y-range
    const yPadding = yRange * 0.1;
    const displayMinY = minY - yPadding;
    const displayMaxY = maxY + yPadding;
    const displayYRange = displayMaxY - displayMinY;
    
    // Draw axes and grid
    drawAxesAndGrid(displayMinY, displayMaxY, displayYRange);
    
    // Draw the function
    drawFunction(displayMinY, displayMaxY, displayYRange);
    
    // Draw the integration approximation
    drawIntegration(displayMinY, displayMaxY, displayYRange);
}

function findFunctionRange() {
    let minY = Infinity;
    let maxY = -Infinity;
    const step = (upperBound - lowerBound) / 200;
    
    for (let x = lowerBound; x <= upperBound; x += step) {
        try {
            const y = evaluateFunction(x);
            if (isFinite(y)) {
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
            }
        } catch (e) {
            // Skip invalid points
        }
    }
    
    // If function is constant or invalid, set default range
    if (!isFinite(minY) || !isFinite(maxY)) {
        minY = -5;
        maxY = 5;
    }
    
    return { min: minY, max: maxY };
}

function drawAxesAndGrid(minY, maxY, yRange) {
    const xRange = upperBound - lowerBound;
    const xScale = graphWidth / xRange;
    const yScale = graphHeight / yRange;
    
    // Draw grid
    ctx.strokeStyle = '#e1e8ed';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let x = Math.ceil(lowerBound); x <= Math.floor(upperBound); x++) {
        const screenX = padding + (x - lowerBound) * xScale;
        ctx.beginPath();
        ctx.moveTo(screenX, padding);
        ctx.lineTo(screenX, canvas.height - padding);
        ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = Math.ceil(minY); y <= Math.floor(maxY); y++) {
        const screenY = canvas.height - padding - (y - minY) * yScale;
        ctx.beginPath();
        ctx.moveTo(padding, screenY);
        ctx.lineTo(canvas.width - padding, screenY);
        ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    
    // X-axis
    const xAxisY = canvas.height - padding - (0 - minY) * yScale;
    if (xAxisY >= padding && xAxisY <= canvas.height - padding) {
        ctx.beginPath();
        ctx.moveTo(padding, xAxisY);
        ctx.lineTo(canvas.width - padding, xAxisY);
        ctx.stroke();
    }
    
    // Y-axis
    const yAxisX = padding - lowerBound * xScale;
    if (yAxisX >= padding && yAxisX <= canvas.width - padding) {
        ctx.beginPath();
        ctx.moveTo(yAxisX, padding);
        ctx.lineTo(yAxisX, canvas.height - padding);
        ctx.stroke();
    }
    
    // Draw axis labels
    ctx.fillStyle = '#2c3e50';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    // X-axis labels
    for (let x = Math.ceil(lowerBound); x <= Math.floor(upperBound); x++) {
        const screenX = padding + (x - lowerBound) * xScale;
        ctx.fillText(x.toString(), screenX, canvas.height - padding + 20);
    }
    
    // Y-axis labels
    ctx.textAlign = 'right';
    for (let y = Math.ceil(minY); y <= Math.floor(maxY); y++) {
        const screenY = canvas.height - padding - (y - minY) * yScale;
        ctx.fillText(y.toString(), padding - 10, screenY + 4);
    }
}

function drawFunction(minY, maxY, yRange) {
    const xRange = upperBound - lowerBound;
    const xScale = graphWidth / xRange;
    const yScale = graphHeight / yRange;
    
    ctx.strokeStyle = '#4a90e2';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const step = xRange / 500;
    let firstPoint = true;
    
    for (let x = lowerBound; x <= upperBound; x += step) {
        try {
            const y = evaluateFunction(x);
            if (isFinite(y)) {
                const screenX = padding + (x - lowerBound) * xScale;
                const screenY = canvas.height - padding - (y - minY) * yScale;
                
                if (screenY >= padding && screenY <= canvas.height - padding) {
                    if (firstPoint) {
                        ctx.moveTo(screenX, screenY);
                        firstPoint = false;
                    } else {
                        ctx.lineTo(screenX, screenY);
                    }
                }
            }
        } catch (e) {
            // Skip invalid points
        }
    }
    
    ctx.stroke();
}

function drawIntegration(minY, maxY, yRange) {
    const xRange = upperBound - lowerBound;
    const xScale = graphWidth / xRange;
    const yScale = graphHeight / yRange;
    const deltaX = xRange / numIntervals;
    
    ctx.fillStyle = 'rgba(255, 107, 107, 0.4)';
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2;
    
    switch (method) {
        case 'left':
            drawLeftRiemann(minY, maxY, yRange, xScale, yScale, deltaX);
            break;
        case 'right':
            drawRightRiemann(minY, maxY, yRange, xScale, yScale, deltaX);
            break;
        case 'midpoint':
            drawMidpointRule(minY, maxY, yRange, xScale, yScale, deltaX);
            break;
        case 'trapezoidal':
            drawTrapezoidalRule(minY, maxY, yRange, xScale, yScale, deltaX);
            break;
    }
}

function drawLeftRiemann(minY, maxY, yRange, xScale, yScale, deltaX) {
    const xAxisY = canvas.height - padding - (0 - minY) * yScale;
    
    for (let i = 0; i < numIntervals; i++) {
        const x = lowerBound + i * deltaX;
        const y = evaluateFunction(x);
        
        if (isFinite(y)) {
            const screenX1 = padding + (x - lowerBound) * xScale;
            const screenX2 = padding + (x + deltaX - lowerBound) * xScale;
            const screenY = canvas.height - padding - (y - minY) * yScale;
            
            // Draw rectangle
            ctx.beginPath();
            ctx.rect(screenX1, Math.min(screenY, xAxisY), screenX2 - screenX1, Math.abs(screenY - xAxisY));
            ctx.fill();
            ctx.stroke();
        }
    }
}

function drawRightRiemann(minY, maxY, yRange, xScale, yScale, deltaX) {
    const xAxisY = canvas.height - padding - (0 - minY) * yScale;
    
    for (let i = 0; i < numIntervals; i++) {
        const x = lowerBound + (i + 1) * deltaX;
        const y = evaluateFunction(x);
        
        if (isFinite(y)) {
            const screenX1 = padding + (x - deltaX - lowerBound) * xScale;
            const screenX2 = padding + (x - lowerBound) * xScale;
            const screenY = canvas.height - padding - (y - minY) * yScale;
            
            // Draw rectangle
            ctx.beginPath();
            ctx.rect(screenX1, Math.min(screenY, xAxisY), screenX2 - screenX1, Math.abs(screenY - xAxisY));
            ctx.fill();
            ctx.stroke();
        }
    }
}

function drawMidpointRule(minY, maxY, yRange, xScale, yScale, deltaX) {
    const xAxisY = canvas.height - padding - (0 - minY) * yScale;
    
    for (let i = 0; i < numIntervals; i++) {
        const x = lowerBound + (i + 0.5) * deltaX;
        const y = evaluateFunction(x);
        
        if (isFinite(y)) {
            const screenX1 = padding + (lowerBound + i * deltaX - lowerBound) * xScale;
            const screenX2 = padding + (lowerBound + (i + 1) * deltaX - lowerBound) * xScale;
            const screenY = canvas.height - padding - (y - minY) * yScale;
            
            // Draw rectangle
            ctx.beginPath();
            ctx.rect(screenX1, Math.min(screenY, xAxisY), screenX2 - screenX1, Math.abs(screenY - xAxisY));
            ctx.fill();
            ctx.stroke();
        }
    }
}

function drawTrapezoidalRule(minY, maxY, yRange, xScale, yScale, deltaX) {
    const xAxisY = canvas.height - padding - (0 - minY) * yScale;
    
    for (let i = 0; i < numIntervals; i++) {
        const x1 = lowerBound + i * deltaX;
        const x2 = lowerBound + (i + 1) * deltaX;
        const y1 = evaluateFunction(x1);
        const y2 = evaluateFunction(x2);
        
        if (isFinite(y1) && isFinite(y2)) {
            const screenX1 = padding + (x1 - lowerBound) * xScale;
            const screenX2 = padding + (x2 - lowerBound) * xScale;
            const screenY1 = canvas.height - padding - (y1 - minY) * yScale;
            const screenY2 = canvas.height - padding - (y2 - minY) * yScale;
            
            // Draw trapezoid
            ctx.beginPath();
            ctx.moveTo(screenX1, xAxisY);
            ctx.lineTo(screenX1, screenY1);
            ctx.lineTo(screenX2, screenY2);
            ctx.lineTo(screenX2, xAxisY);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }
}

function calculateIntegration() {
    const deltaX = (upperBound - lowerBound) / numIntervals;
    let sum = 0;
    
    switch (method) {
        case 'left':
            for (let i = 0; i < numIntervals; i++) {
                const x = lowerBound + i * deltaX;
                sum += evaluateFunction(x) * deltaX;
            }
            break;
        case 'right':
            for (let i = 0; i < numIntervals; i++) {
                const x = lowerBound + (i + 1) * deltaX;
                sum += evaluateFunction(x) * deltaX;
            }
            break;
        case 'midpoint':
            for (let i = 0; i < numIntervals; i++) {
                const x = lowerBound + (i + 0.5) * deltaX;
                sum += evaluateFunction(x) * deltaX;
            }
            break;
        case 'trapezoidal':
            for (let i = 0; i < numIntervals; i++) {
                const x1 = lowerBound + i * deltaX;
                const x2 = lowerBound + (i + 1) * deltaX;
                sum += (evaluateFunction(x1) + evaluateFunction(x2)) * deltaX / 2;
            }
            break;
    }
    
    return sum;
}

function updateFormula() {
    const result = calculateIntegration();
    const methodNames = {
        'left': 'Left Riemann Sum',
        'right': 'Right Riemann Sum',
        'midpoint': 'Midpoint Rule',
        'trapezoidal': 'Trapezoidal Rule'
    };
    
    formulaDisplay.textContent = `∫${lowerBound}${upperBound} ${funcString} dx ≈ ${result.toFixed(4)} (${methodNames[method]}, n=${numIntervals})`;
}

function updateInfo() {
    const descriptions = {
        'left': 'Left Riemann Sum: Uses the left endpoint of each subinterval to determine the height of rectangles.',
        'right': 'Right Riemann Sum: Uses the right endpoint of each subinterval to determine the height of rectangles.',
        'midpoint': 'Midpoint Rule: Uses the midpoint of each subinterval to determine the height of rectangles. Often more accurate than left/right sums.',
        'trapezoidal': 'Trapezoidal Rule: Approximates the area using trapezoids. Generally more accurate than rectangle methods.'
    };
    
    integrationInfo.textContent = descriptions[method];
}

// Event listeners
functionInput.addEventListener('input', updateValues);
lowerBoundInput.addEventListener('input', updateValues);
upperBoundInput.addEventListener('input', updateValues);
numIntervalsSlider.addEventListener('input', updateValues);
numIntervalsValue.addEventListener('input', syncNumIntervals);
methodSelect.addEventListener('change', updateValues);

// Initial draw
updateValues();

