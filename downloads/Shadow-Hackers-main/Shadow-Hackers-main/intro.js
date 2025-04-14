document.addEventListener('DOMContentLoaded', function () {
  console.log('Intro.js loaded and running');

  // Create stars
  function createStars() {
    const starsContainer = document.getElementById('starsContainer');
    if (!starsContainer) {
      console.error('Stars container not found');
      return;
    }

    const count = 150;

    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.classList.add('star');

      // Random position
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;

      // Random size
      const size = Math.random() * 2.5;

      // Random duration
      const duration = 2 + Math.random() * 6;

      // Random delay
      const delay = Math.random() * 5;

      star.style.left = `${x}px`;
      star.style.top = `${y}px`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.setProperty('--duration', `${duration}s`);
      star.style.animationDelay = `${delay}s`;

      starsContainer.appendChild(star);
    }
  }

  // Start everything when page loads
  createStars();
});

document.addEventListener('DOMContentLoaded', function () {
    const introContainer = document.getElementById('introContainer');
    const mainContent = document.getElementById('mainContent');

    // Simulate intro animation duration
    setTimeout(() => {
        introContainer.style.opacity = '0';
        introContainer.style.transition = 'opacity 1s ease-in-out';

        // After fade-out, hide intro and show main content
        setTimeout(() => {
            introContainer.style.display = 'none';
            mainContent.style.display = 'block';
            mainContent.style.opacity = '1';
            mainContent.style.transition = 'opacity 1s ease-in-out';
        }, 1000);
    }, 5000); // Adjust duration as needed
});
document.addEventListener('DOMContentLoaded', function () {
  const introContainer = document.getElementById('introContainer');
  const mainContent = document.getElementById('mainContent');
  const profileContainer = document.getElementById('profileContainer');

  // Wait for the intro animation to complete
  setTimeout(() => {
      // Hide the intro animation
      introContainer.style.display = 'none';

      // Show the main content
      mainContent.style.display = 'block';
      mainContent.style.opacity = '1';

      // Show the profile bar
      profileContainer.classList.remove('hidden');
  }, 3000); // Adjust the timeout to match the duration of your intro animation
});