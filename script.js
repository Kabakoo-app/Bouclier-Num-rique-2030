document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById('drawingCanvas');
    const context = canvas.getContext('2d');
    let isDrawing = false;
    let shape = 'circle';

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);

    // Événements tactiles pour les écrans tactiles
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);

    function startDrawing(event) {
        isDrawing = true;
        draw(event);
    }

    function draw(event) {
        if (!isDrawing) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (shape === 'circle') {
            drawCircle(x, y);
        } else if (shape === 'square') {
            drawSquare(x, y);
        } else if (shape === 'line') {
            drawLine(x, y);
        }
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
        context.rect(x - 10, y - 20, 40, 40);
        context.fillStyle = '#000';
        context.fill();
        context.closePath();
    }

    function drawLine(x, y) {
        context.lineWidth = 10;
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

    window.startCreation = function () {
        document.querySelector(".button").style.display = "none";
        document.getElementById("creationArea").style.display = "flex";
        document.getElementById("nameDescription").style.display = "block";
    };

    window.clearCanvas = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    window.submitCreation = async function () {
        const name = document.getElementById('objectName').value;
        const mainFunction = document.getElementById('mainFunction').value;
        const image = canvas.toDataURL('image/png');

        console.log(name);
        console.log(mainFunction);
        console.log(image);


        const response = await fetch('/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, mainFunction, image })
        });

        const data = await response.json();
        generateQRCode(data.qrCodeData);
    };

    function generateQRCode(data) {
        const qrCanvas = document.getElementById('qrCodeCanvas');
        const qrContext = qrCanvas.getContext('2d');
        qrCanvas.width = 200;
        qrCanvas.height = 200;

        QRCode.toCanvas(qrCanvas, data, function (error) {
            if (error) console.error(error);
            document.getElementById('qrCodeContainer').style.display = 'block';
        });
    }
});
