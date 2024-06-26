document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "https://goapi.kabakoo.africa";
    const canvas = document.getElementById('drawingCanvas');
    const context = canvas.getContext('2d');
    const loader = document.querySelector(".loader");
    const loading = document.querySelector(".loading");
    const generateImage = document.querySelector('.generateImage');
    const restartButton = document.querySelector('.restart');
    
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let shape = 'line';

    setupCanvas();

    function setupCanvas() {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);

        canvas.addEventListener('touchstart', startDrawing);
        canvas.addEventListener('touchmove', draw);
        canvas.addEventListener('touchend', stopDrawing);
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth / 1.5;
        canvas.height = window.innerHeight - 200;
    }

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

    window.startCreation = function() {
        document.querySelector(".home").style.display = "none";
        document.querySelector(".header").style.display = "none";
        document.querySelector(".button").style.display = "none";    
        document.querySelector(".creation-area").style.marginTop = "0";
        document.getElementById("creationArea").style.display = "flex";
        document.getElementById("nameDescription").style.display = "flex";
    };
    window.setShape = function (newShape, button) {
        shape = newShape;
        document.querySelectorAll('.tools').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    };

    window.restart = function () {
        loader.style.display = 'none';
        generateImage.style.display = 'none';
        restartButton.style.display = 'none';
    };

    window.submitCreation = async function () {
        const description = document.getElementById('mainFunction').value;
        loader.style.display = "flex";
        loading.style.display = "block";
        const sketch = canvas.toDataURL('image/png');

        try {
            const response = await fetch(`${API_URL}/media/enhance_sketch/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sketch, description })
            });

            if (!response.ok) {
                throw new Error(`Erreur: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            console.log(data);
            requestEnhancedSketch();

            loading.style.display = "none";
            generateImage.style.display = 'block';
            restartButton.style.display = 'block';
        } catch (error) {
            console.error('Erreur lors de la soumission:', error);
        }
    };

    const requestEnhancedSketch = async function () {
        try {
            const response = await fetch(`${API_URL}/media/get_enhanced_sketch?user_uid=60d8e13d-d318-4f9c-b077-5e2e68ecf4aa`);
            if (!response.ok) {
                throw new Error(`Erreur: ${response.status} - ${response.statusText}`);
            }

            const result = await response.json();
            console.log(result);
            render();
            localStorage.setItem('img', JSON.stringify(result));
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'esquisse améliorée:', error);
        }
    };

    function render() {
        const imageUrl = localStorage.getItem('img');
        if (imageUrl) {
            const imgElement = document.createElement('img');
            imgElement.height = '100px';
            imgElement.width = '100px';
            imgElement.src = `https://s3.us-east-2.amazonaws.com/files.kabakoo.africa/${imageUrl}`;

            const container = document.getElementById('generateImage');
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            container.appendChild(imgElement);
        } else {
            console.error('Aucune URL d\'image trouvée dans le localStorage.');
        }
    }
    window.clearCanvas = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    // Appel initial de la fonction requestEnhancedSketch
    // setInterval(requestEnhancedSketch, 3000);
});
