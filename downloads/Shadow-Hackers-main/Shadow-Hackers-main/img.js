document.addEventListener('DOMContentLoaded', () => {
    const image = document.querySelector('.zoomable-image');

    image.addEventListener('click', () => {
        image.classList.toggle('zoom-out');
    });
});