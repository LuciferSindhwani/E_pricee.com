document.addEventListener('DOMContentLoaded', function() {
    // Get menu elements
    const menuButton = document.getElementById('menuButton');
    const cosmicMenu = document.getElementById('cosmicMenu');
    
    // Add cosmic stars to the menu
    addCosmicStarsToMenu();
    
    // Toggle menu when button is clicked
    menuButton.addEventListener('click', function() {
        // Toggle active class on button for animation
        this.classList.toggle('active');
        
        // Toggle active class on menu for visibility
        cosmicMenu.classList.toggle('active');
        
        // Generate stars effect when menu opens
        if (cosmicMenu.classList.contains('active')) {
            generateStarBurst();
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        // If click is outside menu and button
        if (!cosmicMenu.contains(event.target) && !menuButton.contains(event.target)) {
            cosmicMenu.classList.remove('active');
            menuButton.classList.remove('active');
        }
    });
    
    // Add hover effects to menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        // Create cosmic trail on hover
        item.addEventListener('mousemove', createCosmicTrail);
        
        // Close menu when item is clicked
        item.addEventListener('click', function() {
            cosmicMenu.classList.remove('active');
            menuButton.classList.remove('active');
        });
    });
    
    // Function to add cosmic stars to the menu background
    function addCosmicStarsToMenu() {
        const starCount = 20;
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'cosmic-star';
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.width = `${1 + Math.random() * 2}px`;
            star.style.height = star.style.width;
            star.style.animationDelay = `${Math.random() * 3}s`;
            star.style.animationDuration = `${2 + Math.random() * 3}s`;
            
            cosmicMenu.appendChild(star);
        }
    }
    
    // Function to create cosmic trail on menu items
    function createCosmicTrail(e) {
        const particle = document.createElement('div');
        particle.className = 'cosmic-particle';
        
        // Calculate position relative to the menu item
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.opacity = 0.7 + Math.random() * 0.3;
        
        this.appendChild(particle);
        
        // Remove particle after animation completes
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
    
    // Function to generate star burst effect when menu opens
    function generateStarBurst() {
        const burstContainer = document.createElement('div');
        burstContainer.className = 'star-burst-container';
        
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'burst-particle';
            
            const angle = (i / particleCount) * Math.PI * 2;
            const speed = 2 + Math.random() * 3;
            const size = 1 + Math.random() * 3;
            const duration = 0.5 + Math.random() * 0.5;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Set animation properties
            particle.style.setProperty('--angle', angle);
            particle.style.setProperty('--speed', speed);
            particle.style.setProperty('--duration', `${duration}s`);
            
            burstContainer.appendChild(particle);
        }
        
        menuButton.appendChild(burstContainer);
        
        // Remove the burst container after animation completes
        setTimeout(() => {
            burstContainer.remove();
        }, 1000);
    }
});