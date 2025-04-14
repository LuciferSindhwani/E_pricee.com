document.addEventListener('DOMContentLoaded', function () {
    const starsContainer = document.getElementById('dynamic-stars-container');
    const starCount = 300;

    if (starsContainer) {
        for (let i = 0; i < starCount; i++) {
            createDynamicStar();
        }
    }

    function createDynamicStar() {
        const star = document.createElement('div');
        star.className = 'dynamic-star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        const size = 0.5 + Math.random() * 3;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        const brightness = 0.5 + Math.random() * 0.5;
        star.style.opacity = brightness;
        star.style.backgroundColor = `rgba(255, 255, 255, ${brightness})`;
        star.style.boxShadow = `0 0 ${size * 2}px rgba(255, 255, 255, ${brightness})`;
        const duration = 2 + Math.random() * 5;
        star.style.animation = `twinkle ${duration}s infinite ease-in-out`;
        star.style.animationDelay = `${Math.random() * duration}s`;
        starsContainer.appendChild(star);
    }

    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const parallaxLayers = document.querySelectorAll('.deep-space, .distant-stars, .nebula-extreme, .star-clusters, .cosmic-objects, .foreground');
        parallaxLayers.forEach(layer => {
            const transformZ = getComputedStyle(layer).transform.match(/matrix3d\(.*,\s*-?[\d\.]+\)/);
            if (transformZ) {
                const zValue = parseFloat(transformZ[0].split(',')[14]);
                const translateY = scrollTop * (zValue * -0.1);
                layer.style.transform = `translateZ(${zValue}px) scale(${1 - zValue * -1}) translateY(${translateY}px)`;
            }
        });
    });

    document.addEventListener('mousemove', function (e) {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        const parallaxElements = document.querySelectorAll('.mouse-parallax');
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.1;
            const x = mouseX * 100 * speed;
            const y = mouseY * 100 * speed;
            element.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        @keyframes twinkle {
            0%, 100% { opacity: 0.2; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
        }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
        window.scrollTo(0, 0);
        window.dispatchEvent(new Event('scroll'));
    }, 100);
});