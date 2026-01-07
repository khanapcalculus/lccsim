const canvas = document.getElementById('areaCanvas');
const ctx = canvas.getContext('2d');

const shapeTypeSelect = document.getElementById('shapeType');
const dimension1Slider = document.getElementById('dimension1');
const dimension1Value = document.getElementById('dimension1Value');
const dimension2Slider = document.getElementById('dimension2');
const dimension2Value = document.getElementById('dimension2Value');
const dimension3Slider = document.getElementById('dimension3');
const dimension3Value = document.getElementById('dimension3Value');
const dimension1Group = document.getElementById('dimension1Group');
const dimension2Group = document.getElementById('dimension2Group');
const dimension3Group = document.getElementById('dimension3Group');
const formulaDisplay = document.getElementById('formulaDisplay');
const areaInfo = document.getElementById('areaInfo');

let shapeType = 'rectangle';
let dim1 = 5;
let dim2 = 4;
let dim3 = 3;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const scale = 25; // pixels per unit

function updateValues() {
    shapeType = shapeTypeSelect.value;
    dim1 = parseFloat(dimension1Slider.value);
    dim2 = parseFloat(dimension2Slider.value);
    dim3 = parseFloat(dimension3Slider.value);
    
    dimension1Value.value = dim1;
    dimension2Value.value = dim2;
    dimension3Value.value = dim3;
    
    updateLabels();
    draw();
    updateFormula();
    updateInfo();
}

function updateLabels() {
    const labels = {
        'rectangle': { d1: 'Width', d2: 'Height' },
        'triangle': { d1: 'Base', d2: 'Height' },
        'circle': { d1: 'Radius', d2: '' },
        'trapezoid': { d1: 'Base 1', d2: 'Height' }
    };
    
    const label = labels[shapeType];
    dimension1Group.querySelector('label').textContent = label.d1 + ':';
    dimension2Group.querySelector('label').textContent = label.d2 + ':';
    
    if (shapeType === 'circle') {
        dimension2Group.style.display = 'none';
        dimension3Group.style.display = 'none';
    } else if (shapeType === 'trapezoid') {
        dimension2Group.style.display = 'flex';
        dimension3Group.style.display = 'flex';
    } else {
        dimension2Group.style.display = 'flex';
        dimension3Group.style.display = 'none';
    }
}

function syncDimension1() {
    dim1 = parseFloat(dimension1Value.value);
    dimension1Slider.value = dim1;
    updateValues();
}

function syncDimension2() {
    dim2 = parseFloat(dimension2Value.value);
    dimension2Slider.value = dim2;
    updateValues();
}

function syncDimension3() {
    dim3 = parseFloat(dimension3Value.value);
    dimension3Slider.value = dim3;
    updateValues();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    drawGrid();
    
    switch (shapeType) {
        case 'rectangle':
            drawRectangle();
            break;
        case 'triangle':
            drawTriangle();
            break;
        case 'circle':
            drawCircle();
            break;
        case 'trapezoid':
            drawTrapezoid();
            break;
    }
}

function drawGrid() {
    ctx.strokeStyle = '#e1e8ed';
    ctx.lineWidth = 1;
    
    for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function drawRectangle() {
    const width = dim1 * scale;
    const height = dim2 * scale;
    const x = centerX - width / 2;
    const y = centerY - height / 2;
    
    ctx.fillStyle = 'rgba(74, 144, 226, 0.3)';
    ctx.fillRect(x, y, width, height);
    
    ctx.strokeStyle = '#4a90e2';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);
    
    // Labels
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${dim1.toFixed(1)}`, centerX, y - 10);
    ctx.save();
    ctx.translate(x - 20, centerY);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${dim2.toFixed(1)}`, 0, 0);
    ctx.restore();
}

function drawTriangle() {
    const base = dim1 * scale;
    const height = dim2 * scale;
    const x = centerX - base / 2;
    const y = centerY + height / 2;
    
    ctx.beginPath();
    ctx.moveTo(centerX, y - height);
    ctx.lineTo(x, y);
    ctx.lineTo(x + base, y);
    ctx.closePath();
    
    ctx.fillStyle = 'rgba(74, 144, 226, 0.3)';
    ctx.fill();
    
    ctx.strokeStyle = '#4a90e2';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${dim1.toFixed(1)}`, centerX, y + 20);
    ctx.save();
    ctx.translate(x - 20, centerY);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${dim2.toFixed(1)}`, 0, 0);
    ctx.restore();
}

function drawCircle() {
    const radius = dim1 * scale;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    
    ctx.fillStyle = 'rgba(74, 144, 226, 0.3)';
    ctx.fill();
    
    ctx.strokeStyle = '#4a90e2';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw radius line
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + radius, centerY);
    ctx.stroke();
    
    // Label
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`r = ${dim1.toFixed(1)}`, centerX + radius / 2, centerY - 10);
}

function drawTrapezoid() {
    const base1 = dim1 * scale;
    const base2 = dim3 * scale;
    const height = dim2 * scale;
    const offset = (base1 - base2) / 2;
    
    const x1 = centerX - base1 / 2;
    const x2 = centerX - base2 / 2;
    const y = centerY + height / 2;
    
    ctx.beginPath();
    ctx.moveTo(x1, y - height);
    ctx.lineTo(x1 + base1, y - height);
    ctx.lineTo(x2 + base2, y);
    ctx.lineTo(x2, y);
    ctx.closePath();
    
    ctx.fillStyle = 'rgba(74, 144, 226, 0.3)';
    ctx.fill();
    
    ctx.strokeStyle = '#4a90e2';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${dim1.toFixed(1)}`, centerX, y - height - 10);
    ctx.fillText(`${dim3.toFixed(1)}`, centerX, y + 20);
    ctx.save();
    ctx.translate(x1 - 20, centerY);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${dim2.toFixed(1)}`, 0, 0);
    ctx.restore();
}

function calculateArea() {
    switch (shapeType) {
        case 'rectangle':
            return dim1 * dim2;
        case 'triangle':
            return (dim1 * dim2) / 2;
        case 'circle':
            return Math.PI * dim1 * dim1;
        case 'trapezoid':
            return ((dim1 + dim3) * dim2) / 2;
    }
}

function updateFormula() {
    let formula = '';
    const area = calculateArea();
    
    switch (shapeType) {
        case 'rectangle':
            formula = `Area = Width × Height = ${dim1.toFixed(1)} × ${dim2.toFixed(1)} = ${area.toFixed(2)}`;
            break;
        case 'triangle':
            formula = `Area = (Base × Height) / 2 = (${dim1.toFixed(1)} × ${dim2.toFixed(1)}) / 2 = ${area.toFixed(2)}`;
            break;
        case 'circle':
            formula = `Area = π × r² = π × ${dim1.toFixed(1)}² = ${area.toFixed(2)}`;
            break;
        case 'trapezoid':
            formula = `Area = (Base₁ + Base₂) × Height / 2 = (${dim1.toFixed(1)} + ${dim3.toFixed(1)}) × ${dim2.toFixed(1)} / 2 = ${area.toFixed(2)}`;
            break;
    }
    
    formulaDisplay.textContent = formula;
}

function updateInfo() {
    const formulas = {
        'rectangle': 'Area = length × width',
        'triangle': 'Area = (base × height) / 2',
        'circle': 'Area = π × radius²',
        'trapezoid': 'Area = (base₁ + base₂) × height / 2'
    };
    
    areaInfo.textContent = `${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)}: ${formulas[shapeType]}`;
}

// Event listeners
shapeTypeSelect.addEventListener('change', updateValues);
dimension1Slider.addEventListener('input', updateValues);
dimension1Value.addEventListener('input', syncDimension1);
dimension2Slider.addEventListener('input', updateValues);
dimension2Value.addEventListener('input', syncDimension2);
dimension3Slider.addEventListener('input', updateValues);
dimension3Value.addEventListener('input', syncDimension3);

// Initial draw
updateValues();

