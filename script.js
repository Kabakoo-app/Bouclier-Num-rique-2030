
document.addEventListener("DOMContentLoaded", function () {

    let sketch_id = null
    let isloading = null
    const API_URL = "https://goapi.kabakoo.africa";
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const loader = document.querySelector(".loader")
    const loading = document.querySelector(".loading")
    const footer = document.querySelector('.footer');
    const canvas = document.getElementById('drawingCanvas');
    const generateImage = document.querySelector('.generateImage');
    const restartButton = document.querySelector('.restart');
    const imageGenerate = document.querySelector('.imageGenerate');
    const nameForObject = document.getElementById('nameForObject');
    const valideBtn = document.querySelector('.valider');

  
    // const modal = document.getElementById('modal');
    // const modalImage = document.getElementById('modal-image');
    // const modalTitle = document.getElementById('modal-title');

    canvas.width = windowWidth / 1.5;
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

    // fetch toutes les sketches pour les afficher dans les sidebar sur la page d'accueil
    fetch(`${API_URL}/media/get_sketches/`)
        .then(response => response.json())
        .then(response => {
            const { data } = response
            const container = document.querySelector('.side-content');
            data.forEach(image => {
                const sketchDiv = document.createElement('div');
                sketchDiv.className = 'sketch';
                const imgElement = document.createElement('img');
                imgElement.src = `https://s3.us-east-2.amazonaws.com/files.kabakoo.africa/${image.uri}`;
                imgElement.alt = image.title;
                imgElement.onclick = function () {
                    showModal(image.uri, image.title);
                };
                const titleElement = document.createElement('p');
                titleElement.textContent = image.title;
                sketchDiv.appendChild(imgElement);
                sketchDiv.appendChild(titleElement);
                container.appendChild(sketchDiv);
            });
        })
        .catch(error => console.error('Error fetching images:', error));

        function showModal(uri, title) {
        
            modalImage.src = `https://s3.us-east-2.amazonaws.com/files.kabakoo.africa/${uri}`;
            modalImage.style.borderRadius = '10px'
            modalTitle.textContent = title;

            modal.style.display = 'flex';
        }

        window.closeModal = function() {
            modalImage.src = ``;
            modalImage.style.borderRadius = '10px'
            modalTitle.textContent = '';
            modal.style.display = 'none';
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

    window.clearCanvas = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    window.setShape = function (newShape, button) {
        shape = newShape;
        const buttons = document.querySelectorAll('#creationArea button');
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    };

    window.startCreation = function () {
        document.querySelector(".home").style.display = "none";
        document.querySelector(".header").style.display = "none";
        document.querySelector(".button").style.display = "none";
        document.querySelector(".creation-area").style.marginTop = "0";
        document.getElementById("creationArea").style.display = "flex";
        document.getElementById("nameDescription").style.display = "flex";
    };

    window.restart = function () {
        window.location.reload();
    }

    window.submitCreation = async function () {
        const  description= document.getElementById('mainFunction').value;

        if (!description.length) {
            return alert(`Choisis le domaine d'action de ton objet...`)
        }

        loader.style.display = "flex";
        loading.style.display = "block"
        const sketch = canvas.toDataURL('image/png');

        const response = await fetch(`${API_URL}/media/enhance_sketch/`,  {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sketch, description })
        })
        if (!response.ok) {
            throw new Error('Network response was not ok for API 1: ' + response.statusText);
        }
        const responseJson = await response.json();
        const { data : { enhance_sketch_uri }} = responseJson
        sketch_id = responseJson.data.sketch_id
        loading.style.display = "none"
        generateImage.style.display = 'block';
        imageGenerate.src = `https://s3.us-east-2.amazonaws.com/files.kabakoo.africa/${enhance_sketch_uri}`
        footer.style.display = "none"
    };

    nameForObject.addEventListener('input', (event) => {
        event.preventDefault();
        const value = event.target.value;
        if (value.length > 0) {
            valideBtn.classList.add('activeForValide');
        } else {
            valideBtn.classList.remove('activeForValide');
        }
    });

    valideBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        if(isloading) return
        isloading = true
        const name = nameForObject.value;
        if (name.length > 0) {
            const response = await fetch(`${API_URL}/media/name_sketch/`,  {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    name,
                    sketch_id
                })
            })
            if (!response.ok) {
                isloading = false
                throw new Error('Network response was not ok for API 1: ' + response.statusText);
            }
            const { ok, message } = await response.json();
            if(ok){
                alert(`${name} de l'objet validé !`)
                restart()
            }
           
        } else {
           alert('Faut donner un nom a ton object!')
        }
    });

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

