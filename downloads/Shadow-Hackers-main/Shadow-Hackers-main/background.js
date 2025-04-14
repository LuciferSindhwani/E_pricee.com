document.addEventListener('DOMContentLoaded', function () {
    const starsContainer = document.getElementById('stars-container');
    const starCount = 150;
    const constellationCount = 10;
    const starsInConstellation = 4;
    const stars = [];
    const constellationLines = [];
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Create individual stars
    for (let i = 0; i < starCount; i++) {
        createStar(Math.random() * 100, Math.random() * 100, 0.5 + Math.random() * 1.5);
    }

    // Create constellations
    for (let i = 0; i < constellationCount; i++) {
        createConstellation();
    }

    function createStar(x, y, size) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDelay = `${Math.random() * 4}s`;
        star.style.animationDuration = `${3 + Math.random() * 3}s`;
        starsContainer.appendChild(star);
        stars.push({ element: star, x, y, size });
    }

    function createConstellation() {
        const baseX = 10 + Math.random() * 80;
        const baseY = 10 + Math.random() * 80;
        const nearbyStars = findNearbyStars(baseX, baseY, 10);

        if (nearbyStars.length >= starsInConstellation) {
            const constellationStars = nearbyStars.slice(0, starsInConstellation);
            constellationStars.forEach(star => {
                star.element.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                star.element.style.boxShadow = '0 0 2px #fff';
            });

            for (let i = 0; i < constellationStars.length - 1; i++) {
                connectStars(
                    constellationStars[i].x,
                    constellationStars[i].y,
                    constellationStars[i + 1].x,
                    constellationStars[i + 1].y
                );
            }
        }
    }

    function findNearbyStars(x, y, maxDistance) {
        return stars.filter(star => {
            const distance = Math.sqrt(Math.pow(star.x - x, 2) + Math.pow(star.y - y, 2));
            return distance < maxDistance;
        });
    }

    function connectStars(x1, y1, x2, y2) {
        const line = document.createElement('div');
        line.className = 'constellation-line';
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
        line.style.width = `${length}%`;
        line.style.height = '1px';
        line.style.left = `${x1}%`;
        line.style.top = `${y1}%`;
        line.style.transform = `rotate(${angle}deg)`;
        line.style.opacity = 0.3 + Math.random() * 0.4;
        starsContainer.appendChild(line);
    }
});