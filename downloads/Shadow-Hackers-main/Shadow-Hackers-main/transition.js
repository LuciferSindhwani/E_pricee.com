// CSS for the transition (add this to your existing CSS)
const transitionCSS = `
/* Page transition container */
.page-transition-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* Warp speed effect container */
.warp-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
   
    overflow: hidden;
    background: #07041d;
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 9999;
}

.warp-container.active {
    opacity: 1;
}

/* Warp speed lines */
.warp-line {
    position: absolute;
    width: 2px;
    height: 2px;
    background: white;
    transform: translateZ(0);
    border-radius: 50%;
}

/* Portal effect */
.portal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: radial-gradient(
        circle at center,
        rgba(255, 255, 255, 0.8) 0%,
        rgba(138, 43, 226, 0.6) 30%,
        rgba(94, 96, 206, 0.4) 60%,
        transparent 100%
    );
    box-shadow: 
        0 0 30px rgba(138, 43, 226, 0.8),
        0 0 60px rgba(94, 96, 206, 0.6),
        0 0 100px rgba(86, 207, 225, 0.4);
    z-index: 10000;
    opacity: 0;
    transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.portal.active {
    transform: translate(-50%, -50%) scale(15);
    opacity: 1;
}

.portal.close {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
}

/* Cosmic particles */
.cosmic-particle {
    position: absolute;
    background: white;
    border-radius: 50%;
    pointer-events: none;
    z-index: 10001;
}

/* Page content container */
.page-content {
    transition: transform 0.5s ease, opacity 0.5s ease;
}

.page-content.fade-out {
    opacity: 0;
    transform: scale(0.95);
}

.page-content.fade-in {
    opacity: 0;
    transform: scale(1.05);
}

.page-content.visible {
    opacity: 1;
    transform: scale(1);
}

/* Small planets floating */
.floating-object {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    filter: blur(1px);
    opacity: 0;
    transition: opacity 0.5s ease;
}

.floating-object.active {
    opacity: 1;
}

/* Star flash effect */
.star-flash {
    position: absolute;
    width: 0px;
    height: 0px;
    background: white;
    border-radius: 50%;
    z-index: 10002;
    opacity: 0;
    transition: all 0.5s ease;
}

.star-flash.active {
    width: 2px;
    height: 2px;
    opacity: 1;
    box-shadow: 0 0 20px 2px white;
}

.star-flash.super-active {
    width: 4px;
    height: 4px;
    box-shadow: 0 0 40px 10px white, 0 0 80px 20px rgba(138, 43, 226, 0.8);
}
`;

// Add the CSS to the document
const styleElement = document.createElement('style');
styleElement.textContent = transitionCSS;
document.head.appendChild(styleElement);

// Main transition function
function cosmicTransition(targetPage) {
    // Elements to be added for transition
    const transitionContainer = document.createElement('div');
    transitionContainer.className = 'page-transition-container';
    document.body.appendChild(transitionContainer);
    
    // Create warp container
    const warpContainer = document.createElement('div');
    warpContainer.className = 'warp-container';
    transitionContainer.appendChild(warpContainer);
    
    // Create portal element
    const portal = document.createElement('div');
    portal.className = 'portal';
    transitionContainer.appendChild(portal);
    
    // Create star flash effect
    const starFlash = document.createElement('div');
    starFlash.className = 'star-flash';
    starFlash.style.top = '50%';
    starFlash.style.left = '50%';
    starFlash.style.transform = 'translate(-50%, -50%)';
    transitionContainer.appendChild(starFlash);
    
    // Add floating objects (small planets/stars)
    for (let i = 0; i < 10; i++) {
        const floatingObj = document.createElement('div');
        floatingObj.className = 'floating-object';
        const size = Math.random() * 30 + 10;
        const colorOption = Math.floor(Math.random() * 4);
        
        let color;
        switch (colorOption) {
            case 0:
                color = 'radial-gradient(circle at center, rgba(138, 43, 226, 0.7), rgba(94, 96, 206, 0.3))'; // Purple planet
                break;
            case 1:
                color = 'radial-gradient(circle at center, rgba(86, 207, 225, 0.7), rgba(0, 255, 255, 0.3))'; // Cyan planet
                break;
            case 2:
                color = 'radial-gradient(circle at center, rgba(255, 0, 128, 0.7), rgba(255, 150, 200, 0.3))'; // Pink planet
                break;
            case 3:
                color = 'radial-gradient(circle at center, rgba(255, 215, 0, 0.7), rgba(255, 165, 0, 0.3))'; // Gold planet
                break;
        }
        
        floatingObj.style.width = `${size}px`;
        floatingObj.style.height = `${size}px`;
        floatingObj.style.background = color;
        floatingObj.style.boxShadow = '0 0 20px rgba(125, 10, 10, 0.54)';
        floatingObj.style.top = `${Math.random() * 100}%`;
        floatingObj.style.left = `${Math.random() * 100}%`;
        
        // Random animation
        const duration = Math.random() * 2 + 1;
        const xMove = Math.random() * 100 - 50;
        const yMove = Math.random() * 100 - 50;
        
        floatingObj.style.transition = `all ${duration}s ease`;
        
        transitionContainer.appendChild(floatingObj);
        
        // Trigger floating animation
        setTimeout(() => {
            floatingObj.classList.add('active');
            floatingObj.style.transform = `translate(${xMove}px, ${yMove}px) scale(${Math.random() + 0.5})`;
        }, Math.random() * 300);
    }
    
    // Create warp speed effect lines
    for (let i = 0; i < 200; i++) {
        createWarpLine(warpContainer);
    }
    
    // Create cosmic particles for the portal effect
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createCosmicParticle(transitionContainer);
        }, Math.random() * 1000);
    }
    
    // Wrap current page content
    const currentContent = document.querySelector('.page-content') || document.body;
    if (!currentContent.classList.contains('page-content')) {
        // If page-content doesn't exist yet, wrap body content
        const wrapper = document.createElement('div');
        wrapper.className = 'page-content';
        
        // Move all body children to the wrapper except the transition container
        Array.from(document.body.children).forEach(child => {
            if (child !== transitionContainer && child !== warpContainer) {
                wrapper.appendChild(child);
            }
        });
        
        document.body.appendChild(wrapper);
    }
    
    // Start transition sequence
    const pageContent = document.querySelector('.page-content');
    pageContent.classList.add('fade-out');
    
    // Sequence timing
    setTimeout(() => {
        starFlash.classList.add('active');
    }, 200);
    
    setTimeout(() => {
        starFlash.classList.add('super-active');
    }, 500);
    
    setTimeout(() => {
        warpContainer.classList.add('active');
    }, 700);
    
    setTimeout(() => {
        portal.classList.add('active');
    }, 1000);
    
    // Navigate to target page after effect
    setTimeout(() => {
        window.location.href = targetPage;
    }, 2000);
}

// Function to create warp speed lines
function createWarpLine(container) {
    const line = document.createElement('div');
    line.className = 'warp-line';
    
    // Position in the center
    line.style.top = '50%';
    line.style.left = '50%';
    
    // Random length and angle
    const length = Math.random() * 100 + 50;
    const angle = Math.random() * Math.PI * 2;
    const delay = Math.random() * 2;
    const duration = Math.random() * 1 + 1;
    
    // Add to container
    container.appendChild(line);
    
    // Animate the line
    setTimeout(() => {
        line.style.transition = `all ${duration}s linear`;
        line.style.transform = `
            translate(${Math.cos(angle) * window.innerWidth}px, ${Math.sin(angle) * window.innerHeight}px)
            scale(${length})
        `;
        line.style.opacity = '0';
    }, delay * 1000);
    
    // Remove after animation
    setTimeout(() => {
        line.remove();
    }, (delay + duration + 0.5) * 1000);
}

// Function to create cosmic particles
function createCosmicParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'cosmic-particle';
    
    // Random size
    const size = Math.random() * 3 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Start at center
    particle.style.top = '50%';
    particle.style.left = '50%';
    
    // Random direction
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 100 + 50;
    const duration = Math.random() * 1.5 + 0.5;
    
    // Color options
    const colors = [
        'white', 
        'rgba(138, 43, 226, 0.8)', 
        'rgba(94, 96, 206, 0.8)', 
        'rgba(86, 207, 225, 0.8)'
    ];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.boxShadow = `0 0 ${Math.random() * 5 + 3}px ${particle.style.background}`;
    
    // Add to container
    container.appendChild(particle);
    
    // Animate the particle
    setTimeout(() => {
        particle.style.transition = `all ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
        particle.style.transform = `
            translate(
                calc(${Math.cos(angle) * distance}vw - 50%), 
                calc(${Math.sin(angle) * distance}vh - 50%)
            )
        `;
        particle.style.opacity = '0';
    }, 10);
    
    // Remove after animation
    setTimeout(() => {
        particle.remove();
    }, duration * 1000 + 100);
}

// Function to handle page load and receive transition
function handlePageReceiveTransition() {
    // Create transition elements for receiving page
    const transitionContainer = document.createElement('div');
    transitionContainer.className = 'page-transition-container';
    document.body.appendChild(transitionContainer);
    
    // Create portal element
    const portal = document.createElement('div');
    portal.className = 'portal active';
    transitionContainer.appendChild(portal);
    
    // Wrap page content if not already wrapped
    if (!document.querySelector('.page-content')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'page-content fade-in';
        
        // Move all body children to the wrapper except the transition container
        Array.from(document.body.children).forEach(child => {
            if (child !== transitionContainer) {
                wrapper.appendChild(child);
            }
        });
        
        document.body.appendChild(wrapper);
    } else {
        document.querySelector('.page-content').classList.add('fade-in');
    }
    
    // Reverse portal effect
    setTimeout(() => {
        portal.classList.add('close');
        document.querySelector('.page-content').classList.add('visible');
        document.querySelector('.page-content').classList.remove('fade-in');
    }, 100);
    
    // Clean up
    setTimeout(() => {
        transitionContainer.remove();
    }, 1500);
}

// Example usage
document.addEventListener('DOMContentLoaded', function() {
    // For receiving transition when page loads
    handlePageReceiveTransition();
    
    // Example: Add transition to login button or navigation links
    const addTransitionsToLinks = () => {
        // Add to navigation links or login buttons
        const links = document.querySelectorAll('a[href], button.nav-link');
        
        links.forEach(link => {
            if (link.dataset.transitionAdded) return;
            
            link.dataset.transitionAdded = 'true';
            
            link.addEventListener('click', function(e) {
                // Only apply to internal links
                const href = this.getAttribute('href');
                if (href && !href.startsWith('http') && !href.startsWith('#')) {
                    e.preventDefault();
                    cosmicTransition(href);
                }
                
                // For demo buttons without href
                if (!href && this.classList.contains('nav-link')) {
                    e.preventDefault();
                    cosmicTransition('login.html'); // Default to login page
                }
            });
        });
    };
    
    // Add transitions
    addTransitionsToLinks();
    
    // For dynamically added links
    const observer = new MutationObserver(function() {
        addTransitionsToLinks();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
});