const canvas = document.getElementById('lineCanvas');
const ctx = canvas.getContext('2d');

const slopeSlider = document.getElementById('slope');
const slopeValue = document.getElementById('slopeValue');
const interceptSlider = document.getElementById('intercept');
const interceptValue = document.getElementById('interceptValue');
const showGridSelect = document.getElementById('showGrid');
const showPointsSelect = document.getElementById('showPoints');
const formulaDisplay = document.getElementById('formulaDisplay');
const lineInfo = document.getElementById('lineInfo');

let slope = 1;
let intercept = 0;
let showGrid = true;
let showPoints = true;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const scale = 40; // pixels per unit

function updateValues() {
    slope = parseFloat(slopeSlider.value);
    intercept = parseFloat(interceptSlider.value);
    showGrid = showGridSelect.value === 'true';
    showPoints = showPointsSelect.value === 'true';
    
    slopeValue.value = slope;
    interceptValue.value = intercept;
    
    draw();
    updateFormula();
    updateInfo();
}

function syncSlope() {
    slope = parseFloat(slopeValue.value);
    slopeSlider.value = slope;
    updateValues();
}

function syncIntercept() {
    intercept = parseFloat(interceptValue.value);
    interceptSlider.value = intercept;
    updateValues();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (showGrid) {
        drawGrid();
    }
    
    drawAxes();
    drawLine();
    
    if (showPoints) {
        drawPoints();
    }
}

function drawGrid() {
    ctx.strokeStyle = '#e1e8ed';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = -10; x <= 10; x++) {
        const screenX = centerX + x * scale;
        ctx.beginPath();
        ctx.moveTo(screenX, 0);
        ctx.lineTo(screenX, canvas.height);
        ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = -10; y <= 10; y++) {
        const screenY = centerY - y * scale;
        ctx.beginPath();
        ctx.moveTo(0, screenY);
        ctx.lineTo(canvas.width, screenY);
        ctx.stroke();
    }
}

function drawAxes() {
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();
    
    // Arrow heads
    ctx.fillStyle = '#2c3e50';
    // X-axis arrow
    ctx.beginPath();
    ctx.moveTo(canvas.width - 10, centerY - 5);
    ctx.lineTo(canvas.width, centerY);
    ctx.lineTo(canvas.width - 10, centerY + 5);
    ctx.fill();
    
    // Y-axis arrow
    ctx.beginPath();
    ctx.moveTo(centerX - 5, 10);
    ctx.lineTo(centerX, 0);
    ctx.lineTo(centerX + 5, 10);
    ctx.fill();
    
    // Labels
    ctx.fillStyle = '#2c3e50';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    
    // X-axis labels
    for (let x = -10; x <= 10; x += 2) {
        if (x !== 0) {
            const screenX = centerX + x * scale;
            ctx.fillText(x.toString(), screenX, centerY + 20);
        }
    }
    
    // Y-axis labels
    for (let y = -10; y <= 10; y += 2) {
        if (y !== 0) {
            const screenY = centerY - y * scale;
            ctx.fillText(y.toString(), centerX - 20, screenY + 5);
        }
    }
    
    // Origin label
    ctx.fillText('0', centerX - 15, centerY + 20);
    
    // Axis labels
    ctx.font = 'bold 16px Arial';
    ctx.fillText('x', canvas.width - 20, centerY - 10);
    ctx.fillText('y', centerX + 15, 20);
}

function drawLine() {
    ctx.strokeStyle = '#4a90e2';
    ctx.lineWidth = 3;
    
    // Calculate two points on the line
    const x1 = -10;
    const y1 = slope * x1 + intercept;
    const x2 = 10;
    const y2 = slope * x2 + intercept;
    
    const screenX1 = centerX + x1 * scale;
    const screenY1 = centerY - y1 * scale;
    const screenX2 = centerX + x2 * scale;
    const screenY2 = centerY - y2 * scale;
    
    ctx.beginPath();
    ctx.moveTo(screenX1, screenY1);
    ctx.lineTo(screenX2, screenY2);
    ctx.stroke();
}

function drawPoints() {
    ctx.fillStyle = '#ff6b6b';
    
    // Draw y-intercept point
    const interceptX = centerX;
    const interceptY = centerY - intercept * scale;
    ctx.beginPath();
    ctx.arc(interceptX, interceptY, 6, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw a few more points on the line
    for (let x = -8; x <= 8; x += 2) {
        const y = slope * x + intercept;
        if (y >= -10 && y <= 10) {
            const screenX = centerX + x * scale;
            const screenY = centerY - y * scale;
            ctx.beginPath();
            ctx.arc(screenX, screenY, 4, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Label y-intercept
    ctx.fillStyle = '#2c3e50';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`(0, ${intercept.toFixed(1)})`, interceptX + 10, interceptY - 10);
}

function updateFormula() {
    let formula = 'y = ';
    if (slope === 0) {
        formula += intercept.toFixed(1);
    } else {
        if (slope === 1) {
            formula += 'x';
        } else if (slope === -1) {
            formula += '-x';
        } else {
            formula += `${slope.toFixed(1)}x`;
        }
        
        if (intercept !== 0) {
            if (intercept > 0) {
                formula += ` + ${intercept.toFixed(1)}`;
            } else {
                formula += ` - ${Math.abs(intercept).toFixed(1)}`;
            }
        }
    }
    formulaDisplay.textContent = formula;
}

function updateInfo() {
    const slopeDesc = slope > 0 ? 'positive' : slope < 0 ? 'negative' : 'zero';
    const steepness = Math.abs(slope) < 0.5 ? 'gentle' : Math.abs(slope) > 2 ? 'steep' : 'moderate';
    
    let info = `Slope: ${slope.toFixed(2)} (${slopeDesc}, ${steepness}) | `;
    info += `Y-Intercept: ${intercept.toFixed(2)} | `;
    info += `The line crosses the y-axis at (0, ${intercept.toFixed(2)})`;
    
    lineInfo.textContent = info;
}

// Event listeners
slopeSlider.addEventListener('input', updateValues);
slopeValue.addEventListener('input', syncSlope);
interceptSlider.addEventListener('input', updateValues);
interceptValue.addEventListener('input', syncIntercept);
showGridSelect.addEventListener('change', updateValues);
showPointsSelect.addEventListener('change', updateValues);

// Initial draw
updateValues();

