
document.addEventListener("DOMContentLoaded", function () {

    const API_URL = "https://goapi.kabakoo.africa";
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const canvas = document.getElementById('drawingCanvas');
    const generateImage  = document.querySelector('.generateImage');
    canvas.width = windowWidth / 1.5 ;
    canvas.height = windowHeight - 200

    const context = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let shape = 'line';

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
        } else if (shape === 'eraser') {
            erase(x, y);
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

    function erase(x, y) {
        context.clearRect(x - 10, y - 10, 20, 20);
    }

    window.setShape = function (newShape, button) {
        shape = newShape;
        const buttons = document.querySelectorAll('.tools');
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    };

    window.startCreation = function() {
        document.querySelector(".home").style.display = "none";
        document.querySelector(".header").style.display = "none";
        document.querySelector(".button").style.display = "none";    
        document.querySelector(".creation-area").style.marginTop = "0";
        document.getElementById("creationArea").style.display = "flex";
        document.getElementById("nameDescription").style.display = "flex";
    };

    window.submitCreation = async function () {
        const  description= document.getElementById('mainFunction').value;
        document.querySelector(".loader").style.display = "flex";
        const sketch = canvas.toDataURL('image/png');

        console.log(description);
        console.log(sketch);

        const response = await fetch(`${API_URL}/media/enhance_sketch/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sketch, description })
        });

        const data = await response.json();
        console.log(data);
        requestEnhancedSketch()
        generateImage.style.display = 'block';
        // generateQRCode(data.qrCodeData);
    };

    window.clearCanvas = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
    };


    window.requestEnhancedSketch = async function () {
        const sketchId = "60d8e13d-d318-4f9c-b077-5e2e68ecf4aa"; // Remplace par l'ID réel de l'utilisateur ou de l'esquisse
        const response = await fetch(`${API_URL}/media/get_enhanced_sketch/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sketch_id: sketchId })
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            localStorage.setItem('img', data)
            // Traite les données reçues de l'API ici
        } else {
            console.error('Erreur lors de la récupération de l\'esquisse améliorée');
        }
    };

    // function generateQRCode(data) {
    //     const qrCanvas = document.getElementById('qrCodeCanvas');
    //     const qrContext = qrCanvas.getContext('2d');
    //     qrCanvas.width = 200;
    //     qrCanvas.height = 200;

    //     QRCode.toCanvas(qrCanvas, data, function (error) {
    //         if (error) console.error(error);
    //         document.getElementById('qrCodeContainer').style.display = 'block';
    //     });
    
});

