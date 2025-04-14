let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    // Reset all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Activate the current slide and dot
    slides[index].classList.add('active');
    dots[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

function goToSlide(index) {
    currentSlide = index;
    showSlide(currentSlide);
}

// Optional: Auto-slide functionality
setInterval(nextSlide, 5000); // Change slide every 5 seconds

document.addEventListener('DOMContentLoaded', () => {
    const categoryGrid = document.querySelector('.category-grid');
    const groceryCard = document.querySelector('.category-card img[alt="Grocery"]').parentElement;

    if (groceryCard) {
        const groceryCardOffset = groceryCard.offsetLeft - (categoryGrid.offsetWidth / 2) + (groceryCard.offsetWidth / 2);
        categoryGrid.scrollTo({ left: groceryCardOffset, behavior: 'smooth' });
    }
});

// Scroll left and right buttons
const categoryGrid = document.querySelector('.category-grid');

function scrollLeft() {
    categoryGrid.scrollBy({ left: -300, behavior: 'smooth' });
}

function scrollRight() {
    categoryGrid.scrollBy({ left: 300, behavior: 'smooth' });
}

// Add hover effect to dynamically expand cards
const categoryCards = document.querySelectorAll('.category-card');
categoryCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        categoryCards.forEach(c => c.classList.remove('center'));
        card.classList.add('center');
    });
});