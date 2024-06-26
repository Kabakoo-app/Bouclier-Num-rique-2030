document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById('drawingCanvas');
    canvas.width = windowWidth / 1.5 ;
    canvas.height = windowHeight - 200

    const context = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let shape = 'circle';

    // Écouteurs d'événements pour la souris
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);

    // Événements tactiles pour les écrans tactiles
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);

    function startDrawing(event) {
        isDrawing = true;
        [lastX, lastY] = [event.offsetX, event.offsetY];
        draw(event);
    }

    function draw(event) {
        event.preventDefault();
        if (!isDrawing) return;

        let x, y;
        if (event.type === 'touchmove' || event.type === 'touchstart') {
            const touch = event.touches[0];
            x = touch.clientX - canvas.offsetLeft;
            y = touch.clientY - canvas.offsetTop;
        } else {
            x = event.offsetX;
            y = event.offsetY;
        }

        if (shape === 'circle') {
            drawCircle(x, y);
        } else if (shape === 'square') {
            drawSquare(x, y);
        } else if (shape === 'line') {
            drawLine(x, y);
        }

        lastX = x;
        lastY = y;
    }

    function handleTouchStart(event) {
        event.preventDefault();
        const touch = event.touches[0];
        isDrawing = true;
        [lastX, lastY] = [touch.clientX - canvas.offsetLeft, touch.clientY - canvas.offsetTop];
        draw(event);
    }

    function handleTouchMove(event) {
        event.preventDefault();
        const touch = event.touches[0];
        draw(event);
    }

    function stopDrawing() {
        isDrawing = false;
        context.beginPath();
    }

    function drawCircle(x, y) {
        context.beginPath();
        context.arc(x, y, 10, 0, Math.PI * 2);
        context.fillStyle = '#000';
        context.fill();
        context.closePath();
    }

    function drawSquare(x, y) {
        context.beginPath();
        context.rect(x - 10, y - 10, 20, 20);
        context.fillStyle = '#000';
        context.fill();
        context.closePath();
    }

    function drawLine(x, y) {
        context.lineWidth = 5;
        context.lineCap = 'round';
        context.strokeStyle = '#000';
        context.lineTo(x, y);
        context.stroke();
        context.beginPath();
        context.moveTo(x, y);
    }

    window.setShape = function (newShape) {
        shape = newShape;
    };

    window.startCreation = function() {
        document.querySelector(".home").style.display = "none";
        document.querySelector(".header").style.display = "none";
        document.querySelector(".button").style.display = "none";
        document.querySelector(".creation-area").style.marginTop = "0";
        document.getElementById("creationArea").style.display = "flex";
        document.getElementById("nameDescription").style.display = "flex";
    };
});
