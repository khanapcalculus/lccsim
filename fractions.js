const canvas = document.getElementById('fractionCanvas');
const ctx = canvas.getContext('2d');

const numerator1Input = document.getElementById('numerator1');
const denominator1Input = document.getElementById('denominator1');
const numerator2Input = document.getElementById('numerator2');
const denominator2Input = document.getElementById('denominator2');
const operationSelect = document.getElementById('operation');
const formulaDisplay = document.getElementById('formulaDisplay');
const resultText = document.getElementById('resultText');

let numerator1 = 3;
let denominator1 = 4;
let numerator2 = 2;
let denominator2 = 5;
let operation = 'compare';

function updateValues() {
    numerator1 = Math.max(0, Math.min(10, parseInt(numerator1Input.value) || 0));
    denominator1 = Math.max(1, Math.min(10, parseInt(denominator1Input.value) || 1));
    numerator2 = Math.max(0, Math.min(10, parseInt(numerator2Input.value) || 0));
    denominator2 = Math.max(1, Math.min(10, parseInt(denominator2Input.value) || 1));
    operation = operationSelect.value;
    
    if (numerator1 > denominator1) numerator1 = denominator1;
    if (numerator2 > denominator2) numerator2 = denominator2;
    
    numerator1Input.value = numerator1;
    denominator1Input.value = denominator1;
    numerator2Input.value = numerator2;
    denominator2Input.value = denominator2;
    
    draw();
    updateFormula();
    updateResult();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const spacing = 50;
    
    if (operation === 'compare') {
        drawFraction(centerX - 200, 100, numerator1, denominator1, 'Fraction 1');
        drawFraction(centerX + 200, 100, numerator2, denominator2, 'Fraction 2');
        
        // Comparison indicator
        const val1 = numerator1 / denominator1;
        const val2 = numerator2 / denominator2;
        let comparison = '';
        if (val1 > val2) comparison = '>';
        else if (val1 < val2) comparison = '<';
        else comparison = '=';
        
        ctx.fillStyle = '#4a90e2';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(comparison, centerX, 180);
    } else {
        const result = calculateOperation();
        drawFraction(centerX - 250, 100, numerator1, denominator1, 'Fraction 1');
        drawOperation(centerX - 50, 100);
        drawFraction(centerX + 150, 100, numerator2, denominator2, 'Fraction 2');
        ctx.fillStyle = '#4a90e2';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('=', centerX + 50, 180);
        drawFraction(centerX + 200, 100, result.num, result.den, 'Result', true);
    }
}

function drawFraction(x, y, numerator, denominator, label, isResult = false) {
    const circleRadius = 60;
    const circleSpacing = 20;
    const rows = Math.ceil(Math.sqrt(denominator));
    const cols = Math.ceil(denominator / rows);
    const totalWidth = cols * (circleRadius * 2 + circleSpacing) - circleSpacing;
    const startX = x - totalWidth / 2;
    
    let index = 0;
    for (let row = 0; row < rows && index < denominator; row++) {
        for (let col = 0; col < cols && index < denominator; col++) {
            const cx = startX + col * (circleRadius * 2 + circleSpacing) + circleRadius;
            const cy = y + row * (circleRadius * 2 + circleSpacing) + circleRadius;
            
            // Draw circle
            ctx.beginPath();
            ctx.arc(cx, cy, circleRadius, 0, Math.PI * 2);
            ctx.fillStyle = index < numerator ? '#50c878' : '#e1e8ed';
            ctx.fill();
            ctx.strokeStyle = '#2c3e50';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            index++;
        }
    }
    
    // Draw fraction notation
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${numerator}`, x, y + circleRadius * 2 + 40);
    ctx.fillText('─', x, y + circleRadius * 2 + 55);
    ctx.fillText(`${denominator}`, x, y + circleRadius * 2 + 75);
    
    // Draw label
    ctx.font = '16px Arial';
    ctx.fillText(label, x, y - 20);
}

function drawOperation() {
    const symbols = {
        'add': '+',
        'subtract': '−',
        'multiply': '×'
    };
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(symbols[operation], canvas.width / 2 - 50, 180);
}

function calculateOperation() {
    let num, den;
    switch (operation) {
        case 'add':
            den = denominator1 * denominator2;
            num = numerator1 * denominator2 + numerator2 * denominator1;
            break;
        case 'subtract':
            den = denominator1 * denominator2;
            num = numerator1 * denominator2 - numerator2 * denominator1;
            break;
        case 'multiply':
            num = numerator1 * numerator2;
            den = denominator1 * denominator2;
            break;
    }
    
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(Math.abs(num), den);
    return { num: num / divisor, den: den / divisor };
}

function updateFormula() {
    formulaDisplay.textContent = `Fraction 1: ${numerator1}/${denominator1} | Fraction 2: ${numerator2}/${denominator2}`;
}

function updateResult() {
    if (operation === 'compare') {
        const val1 = numerator1 / denominator1;
        const val2 = numerator2 / denominator2;
        let comparison = '';
        if (val1 > val2) {
            comparison = `${numerator1}/${denominator1} is greater than ${numerator2}/${denominator2}`;
        } else if (val1 < val2) {
            comparison = `${numerator1}/${denominator1} is less than ${numerator2}/${denominator2}`;
        } else {
            comparison = `${numerator1}/${denominator1} equals ${numerator2}/${denominator2}`;
        }
        resultText.textContent = comparison;
    } else {
        const result = calculateOperation();
        const decimal = (result.num / result.den).toFixed(3);
        resultText.textContent = `Result: ${result.num}/${result.den} = ${decimal}`;
    }
}

// Event listeners
numerator1Input.addEventListener('input', updateValues);
denominator1Input.addEventListener('input', updateValues);
numerator2Input.addEventListener('input', updateValues);
denominator2Input.addEventListener('input', updateValues);
operationSelect.addEventListener('change', updateValues);

// Initial draw
updateValues();

