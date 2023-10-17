const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 600;

const shapes = [];
let shapeCount = 0;
let surfaceArea = 0;
let shapeFrequency = 1;
let gravity = 1;
let isPaused = false;

const shapeSizeMultiplier = 3; // Increase shape size 

function adjustShapeFrequency(adjustment) {
    shapeFrequency += adjustment;
    if (shapeFrequency < 1) shapeFrequency = 1;
    document.getElementById('shapeFrequency').textContent = shapeFrequency;
}

function adjustGravity(adjustment) {
    if (adjustment < 0 && gravity === 0) {
        return;
    }
    gravity += adjustment;
    if (gravity < 0) gravity = 0;
    document.getElementById('gravity').textContent = gravity;
    if (gravity === 0) {
        isPaused = true;
    } else {
        isPaused = false;
    }
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function createRandomShape(x) {
    const shapeTypes = ['circle', 'square', 'triangle', 'pentagon', 'hexagon', 'ellipse'];
    const randomType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    const color = getRandomColor();
    const size = 25 * shapeSizeMultiplier; // Adjust size

    return {
        type: randomType,
        x: x,
        y: -size,
        color: color,
        area: 0,
        size: size,
    };
}

function calculateShapeArea(shape) {
    if (shape.type === 'circle') {
        return Math.PI * Math.pow(shape.size / 2, 2);
    } else if (shape.type === 'square') {
        return Math.pow(shape.size / 2, 2);
    } else if (shape.type === 'triangle') {
        return 0.5 * Math.pow(shape.size / 2, 2); // Adjust for different shapes
    } else if (shape.type === 'pentagon') {
        return 1.7205 * Math.pow(shape.size / 2, 2); // Adjust for different shapes
    } else if (shape.type === 'hexagon') {
        return 2.5981 * Math.pow(shape.size / 2, 2); // Adjust for different shapes
    } else if (shape.type === 'ellipse') {
        return Math.PI * (shape.size / 2) * (shape.size / 4);
    }
    return 0;
}

function updateShapes() {
    if (!isPaused) {
        for (let i = shapes.length - 1; i >= 0; i--) {
            const shape = shapes[i];
            shape.y += gravity;

            if (shape.y > canvas.height) {
                shapes.splice(i, 1);
                shapeCount--;
            }
            shape.area = calculateShapeArea(shape);
        }
    }
}

function drawShapes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const shape of shapes) {
        ctx.fillStyle = shape.color;

        if (shape.type === 'circle') {
            ctx.beginPath();
            ctx.arc(shape.x, shape.y, shape.size / 2, 0, Math.PI * 2);
            ctx.fill();
        } else if (shape.type === 'square') {
            ctx.fillRect(shape.x - shape.size / 2, shape.y - shape.size / 2, shape.size, shape.size);
        } else if (shape.type === 'triangle') {
            ctx.beginPath();
            ctx.moveTo(shape.x, shape.y - shape.size / 2);
            ctx.lineTo(shape.x - shape.size / 2, shape.y + shape.size / 2);
            ctx.lineTo(shape.x + shape.size / 2, shape.y + shape.size / 2);
            ctx.fill();
        } else if (shape.type === 'pentagon') {
            ctx.beginPath();
            const x = shape.x;
            const y = shape.y;
            const size = shape.size / 2;
            ctx.moveTo(x, y - size);
            for (let i = 1; i <= 5; i++) {
                const angle = (i * 2 * Math.PI) / 5;
                const xOffset = size * Math.sin(angle);
                const yOffset = -size * Math.cos(angle);
                ctx.lineTo(x + xOffset, y + yOffset);
            }
            ctx.fill();
        } else if (shape.type === 'hexagon') {
            ctx.beginPath();
            const x = shape.x;
            const y = shape.y;
            const size = shape.size / 2;
            ctx.moveTo(x + size, y);
            for (let i = 1; i <= 6; i++) {
                const angle = (i * Math.PI) / 3;
                const xOffset = size * Math.cos(angle);
                const yOffset = size * Math.sin(angle);
                ctx.lineTo(x + xOffset, y + yOffset);
            }
            ctx.fill();
        } else if (shape.type === 'ellipse') {
            ctx.beginPath();
            const x = shape.x;
            const y = shape.y;
            const xRadius = shape.size / 2;
            const yRadius = shape.size / 4;
            ctx.ellipse(x, y, xRadius, yRadius, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function drawText() {
    document.getElementById('shapeCount').textContent = shapeCount;
    document.getElementById('surfaceArea').textContent = surfaceArea.toFixed(2) + ' px^2';
}

function gameLoop() {
    if (Math.random() < 1 / (shapeFrequency * 60)) {
        const x = Math.random() * canvas.width;
        const shape = createRandomShape(x);
        shapes.push(shape);
        shapeCount++;
    }

    updateShapes();
    drawShapes();
    drawText();

    requestAnimationFrame(gameLoop);
}

canvas.addEventListener('click', (e) => {
    const x = e.clientX - canvas.getBoundingClientRect().left;
    let clickedShape = null;

    for (const shape of shapes) {
        if (
            Math.abs(x - shape.x) <= shape.size / 2 &&
            Math.abs(e.clientY - shape.y) <= shape.size / 2
        ) {
            clickedShape = shape;
            break;
        }
    }

    if (clickedShape) {
        if (clickedShape.clickCount === undefined) {
            const shapeTypes = ['circle', 'square', 'triangle', 'pentagon', 'hexagon', 'ellipse']; // Star removed
            const randomType = shapeTypes.filter(type => type !== clickedShape.type);
            const newType = randomType[Math.floor(Math.random() * randomType.length)];
            clickedShape.type = newType;
        } else {
            const index = shapes.indexOf(clickedShape);
            shapes.splice(index, 1);
            if (gravity !== 0) {
                shapeCount--;
            }
        }

        clickedShape.clickCount = clickedShape.clickCount === undefined ? 1 : 2;
    }
});

gameLoop();
