 const allAnimals = [
            { name: 'Nile Crocodile', index: 0 },
            { name: 'Saltwater Crocodile', index: 1 },
            { name: 'Gharial', index: 2 },
            { name: 'American Crocodile', index: 3 },
            { name: 'Great White Shark', index: 4 },
            { name: 'Bengal Tiger', index: 5 },
            { name: 'African Lion', index: 6 },
            { name: 'Grizzly Bear', index: 7 },
            { name: 'Komodo Dragon', index: 8 },
            { name: 'King Cobra', index: 9 },
            { name: 'African Elephant', index: 10 },
            { name: 'Cape Buffalo', index: 11 },
            { name: 'Box Jellyfish', index: 12 },
            { name: 'Polar Bear', index: 13 }
        ];

        let currentIndex = 0;
        const items = document.querySelectorAll('.carousel .list .item');
        const searchBox = document.getElementById('searchBox');
        const searchBtn = document.getElementById('searchBtn');
        const searchResults = document.getElementById('searchResults');

        // Search button click
        searchBtn.addEventListener('click', function() {
            performSearch();
        });

        // Enter key on search box
        searchBox.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        function performSearch() {
            const searchTerm = searchBox.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                alert('Please enter an animal name to search');
                return;
            }
            
            const found = allAnimals.find(animal => 
                animal.name.toLowerCase() === searchTerm || 
                animal.name.toLowerCase().includes(searchTerm)
            );
            
            if (found) {
                showSlide(found.index);
                searchBox.value = '';
                searchResults.style.display = 'none';
            } else {
                alert('Animal not found! Try: Tiger, Lion, Shark, Crocodile, etc.');
            }
        }

        // Search functionality
        searchBox.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            
            if (searchTerm === '') {
                searchResults.style.display = 'none';
                return;
            }
            
            const filtered = allAnimals.filter(animal => 
                animal.name.toLowerCase().includes(searchTerm)
            );
            
            if (filtered.length > 0) {
                searchResults.innerHTML = filtered.map(animal => 
                    `<div class="search-result-item" data-index="${animal.index}">${animal.name}</div>`
                ).join('');
                searchResults.style.display = 'block';
            } else {
                searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
                searchResults.style.display = 'block';
            }
        });

        // Click on search result
        searchResults.addEventListener('click', function(e) {
            if (e.target.classList.contains('search-result-item')) {
                const index = e.target.getAttribute('data-index');
                if (index !== null) {
                    showSlide(parseInt(index));
                    searchBox.value = '';
                    searchResults.style.display = 'none';
                }
            }
        });

        // Close search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchBox.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });

        function showSlide(index) {
            items.forEach(item => item.classList.remove('active'));
            items[index].classList.add('active');
            currentIndex = index;
            updateDangerMeter();
            updateThumbnails();
        }
        
        function updateThumbnails() {
            const thumbnail = document.querySelector('.thumbnail');
            thumbnail.innerHTML = '';
            
            // Show 4 thumbnails starting from current index
            for (let i = 0; i < 4; i++) {
                const thumbIndex = (currentIndex + i) % items.length;
                const item = items[thumbIndex];
                const imgSrc = item.querySelector('img').src;
                const title = item.querySelector('.title').textContent;
                const dangerLevel = parseInt(item.getAttribute('data-danger'));
                
                let description = '';
                if (dangerLevel <= 60) description = 'Moderate Risk';
                else if (dangerLevel <= 80) description = 'High Danger';
                else description = 'Extreme Danger';
                
                const thumbDiv = document.createElement('div');
                thumbDiv.className = 'item';
                thumbDiv.setAttribute('data-index', thumbIndex);
                thumbDiv.innerHTML = `
                    <img src="${imgSrc}">
                    <div class="content">
                        <div class="title">${title}</div>
                        <div class="description">${description}</div>
                    </div>
                `;
                
                thumbDiv.addEventListener('click', function() {
                    const idx = parseInt(this.getAttribute('data-index'));
                    showSlide(idx);
                });
                
                thumbnail.appendChild(thumbDiv);
            }
        }

        function updateDangerMeter() {
            const activeItem = items[currentIndex];
            const dangerLevel = parseInt(activeItem.getAttribute('data-danger'));
            const progressFill = document.getElementById('progressFill');
            const dangerPercent = document.getElementById('dangerPercent');
            const dangerText = document.getElementById('dangerText');
            
            progressFill.style.height = dangerLevel + '%';
            dangerPercent.textContent = dangerLevel + '%';
            
            if (dangerLevel <= 30) {
                progressFill.style.background = 'linear-gradient(to top, #00ff88, #00cc6a)';
                dangerText.textContent = 'LOW RISK';
            } else if (dangerLevel <= 60) {
                progressFill.style.background = 'linear-gradient(to top, #ffeb3b, #ffc107)';
                dangerText.textContent = 'MODERATE';
            } else if (dangerLevel <= 80) {
                progressFill.style.background = 'linear-gradient(to top, #ff9800, #ff5722)';
                dangerText.textContent = 'HIGH DANGER';
            } else {
                progressFill.style.background = 'linear-gradient(to top, #ff1744, #d50000)';
                dangerText.textContent = 'EXTREME';
            }
        }

        setTimeout(() => {
            updateDangerMeter();
            updateThumbnails();
        }, 500);

        document.getElementById('next').onclick = function() {
            currentIndex = (currentIndex + 1) % items.length;
            showSlide(currentIndex);
        };

        document.getElementById('prev').onclick = function() {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            showSlide(currentIndex);
        };

        // Auto slide
        let autoSlide = setInterval(() => {
            document.getElementById('next').click();
        }, 7000);