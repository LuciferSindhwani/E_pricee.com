
document.addEventListener('DOMContentLoaded', function () {
    const link = document.getElementById('dynamicLink');
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    function updateLink() {
        if (isLoggedIn === 'true') {
            link.textContent = 'Profile';
            link.href = 'profile.html'; // Redirect to profile page
            link.className = 'profile';
        } else {
            link.textContent = 'Login';
            link.href = 'login1.html'; // Redirect to login page
            link.className = 'login';
        }
    }

    updateLink(); // Set initial state

    // Example to toggle login status for testing
    link.addEventListener('click', function (e) {
        if (link.textContent === 'Logout') {
            localStorage.removeItem('isLoggedIn');
        } else {
            localStorage.setItem('isLoggedIn', 'true');
        }
        updateLink();
        e.preventDefault();
    });
});