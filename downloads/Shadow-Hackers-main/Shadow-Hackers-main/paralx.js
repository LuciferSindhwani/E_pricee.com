// parallax-integration.js
// Add this to a new JS file or incorporate into your existing scripts

// Function to integrate parallax with the existing site
function initParallaxIntegration() {
    // Get elements from original site
    const introContainer = document.getElementById('introContainer');
    const mainContent = document.getElementById('mainContent');
    
    // Create wrapper for everything
    const body = document.body;
    const parallaxWrapper = document.createElement('div');
    parallaxWrapper.className = 'parallax-wrapper';
    
    // Move intro container inside parallax wrapper if it exists
    if (introContainer) {
      // Keep the intro animation as is
      body.insertBefore(parallaxWrapper, introContainer.nextSibling);
    } else {
      // If intro container doesn't exist, add wrapper at the beginning
      body.insertBefore(parallaxWrapper, body.firstChild);
    }
    
    // Set up the transition
    document.addEventListener('DOMContentLoaded', function() {
      // If intro animation exists, wait for it to finish
      if (introContainer) {
        setTimeout(() => {
          // Hide intro
          introContainer.style.display = 'none';
          
          // Show parallax effect
          parallaxWrapper.style.opacity = '1';
          
          // After parallax intro, show main content
          setTimeout(() => {
            mainContent.style.display = 'block';
            mainContent.style.opacity = '1';
          }, 1500);
        }, 3000); // Match your existing intro animation time
      } else {
        // No intro animation, show parallax right away
        parallaxWrapper.style.opacity = '1';
        
        // Then show main content
        setTimeout(() => {
          mainContent.style.display = 'block';
          mainContent.style.opacity = '1';
        }, 1500);
      }
    });
    
    // Enhanced scroll handling for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          updateParallaxEffect();
          ticking = false;
        });
        ticking = true;
      }
    });
    
    // Function to update parallax effect based on scroll position
    function updateParallaxEffect() {
      const scrollPosition = window.pageYOffset;
      const windowHeight = window.innerHeight;
      
      // Calculate how far down the page we've scrolled
      const scrollRatio = scrollPosition / windowHeight;
      
      // Apply different transformations based on scroll position
      document.querySelector('.deep-space').style.transform = 
        `translateZ(-10px) scale(11) translateY(${scrollPosition * 0.02}px)`;
        
      document.querySelector('.distant-stars').style.transform = 
        `translateZ(-8px) scale(9) translateY(${scrollPosition * 0.04}px)`;
        
      document.querySelectorAll('.nebula-extreme').forEach(nebula => {
        nebula.style.transform = 
          `translateZ(-6px) scale(7) translateY(${scrollPosition * 0.06}px)`;
      });
      
      document.querySelector('.star-clusters').style.transform = 
        `translateZ(-4px) scale(5) translateY(${scrollPosition * 0.08}px)`;
        
      document.querySelector('.cosmic-objects').style.transform = 
        `translateZ(-2px) scale(3) translateY(${scrollPosition * 0.1}px)`;
        
      document.querySelector('.foreground').style.transform = 
        `translateZ(-0.5px) scale(1.5) translateY(${scrollPosition * 0.15}px)`;
        
      // Fade out parallax effect as you scroll down
      if (scrollPosition > windowHeight) {
        parallaxWrapper.style.opacity = Math.max(0, 2 - (scrollPosition / windowHeight));
      } else {
        parallaxWrapper.style.opacity = 1;
      }
    }
    
    // Create and add celestial objects dynamically
    function createCelestialElements() {
      // Create all the parallax layers
      const layers = [
        'deep-space',
        'distant-stars',
        'nebula-extreme nebula-extreme-1',
        'nebula-extreme nebula-extreme-2',
        'star-clusters',
        'cosmic-objects',
        'foreground'
      ];
      
      // Add each layer to the wrapper
      layers.forEach(layerClass => {
        const layer = document.createElement('div');
        layer.className = layerClass;
        parallaxWrapper.appendChild(layer);
      });
      
      // Add a stars container to the star-clusters layer
      const starClusters = parallaxWrapper.querySelector('.star-clusters');
      const starsContainer = document.createElement('div');
      starsContainer.id = 'dynamic-stars-container';
      starClusters.appendChild(starsContainer);
      
      // Add planets to cosmic objects layer
      const cosmicObjects = parallaxWrapper.querySelector('.cosmic-objects');
      
      for (let i = 1; i <= 3; i++) {
        const planet = document.createElement('div');
        planet.className = `planet planet-${i} mouse-parallax`;
        planet.setAttribute('data-speed', ((Math.random() * 0.1) - 0.05).toFixed(2));
        cosmicObjects.appendChild(planet);
      }
      
      // Add shooting stars to foreground
      const foreground = parallaxWrapper.querySelector('.foreground');
      
      for (let i = 0; i < 3; i++) {
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';
        foreground.appendChild(shootingStar);
      }
    }
    
    // Initialize everything
    createCelestialElements();
    updateParallaxEffect();
  }
  
  // Run the initialization
  document.addEventListener('DOMContentLoaded', initParallaxIntegration);