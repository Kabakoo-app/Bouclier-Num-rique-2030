  const popup = document.getElementById('popup');
        const closeBtn = document.getElementById('closeBtn');


        closeBtn.addEventListener('click', () => {
            popup.style.display = 'none';
            startScroll()
        });

        popup.addEventListener('click', (event) => {
            if (event.target === popup) {
                popup.style.display = 'none';
                startScroll()
            }
        });

        async function fetchImages() {
            try {
                const response = await fetch(`https://goapi.kabakoo.africa/media/get_sketches/`);
                if (!response.ok) {
                    throw new Error(`Erreur: ${response.status} - ${response.statusText}`);
                }
                const data = await response.json();
                console.log(data.data);
                populateGallery(data.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des images:', error);
            }
        }
        fetchImages()

        function populateGallery(images) {
            console.log(images);
            let galleryContainer = document.getElementById('image-container');
            images.forEach((image, index) => {
                console.log(image.sketch_name);
                const figureElement = document.createElement('figure');

                const imgElement = document.createElement('img');
                imgElement.src = `https://s3.us-east-2.amazonaws.com/files.kabakoo.africa/${image.enhanced_uri}`;
                imgElement.alt = image.sketch_name || 'Image sans légende';
                imgElement.classList.add('gallery-item');

                const figcaptionElement = document.createElement('figcaption');
                figcaptionElement.textContent = image.sketch_name || 'Image sans légende';

                figureElement.appendChild(imgElement);
                figureElement.appendChild(figcaptionElement);
                galleryContainer.appendChild(figureElement);
            });
            // startScroll()
            addEventListeners();
        }


        function addEventListeners() {
            const galleryItems = document.querySelectorAll('.gallery-item');
            galleryItems.forEach(item => {
                item.addEventListener('click', () => {
                    // stopScroll();
                    popupImg.src = item.src;
                    popupCaption.textContent = item.alt;
                    popup.style.display = 'flex';
                });
            });
        }

        function startScroll() {
            scrollInterval = setInterval(() => {
                galleryContainer.style.transform = `translateY(${galleryContainer.offsetTop - 1}px)`;
                if (galleryContainer.offsetTop + galleryContainer.offsetHeight < 0) {
                    galleryContainer.style.transform = 'translateY(100%)';
                }
            }, 50);
        }

        // function stopScroll() {
        //     clearInterval(scrollInterval);
        // }