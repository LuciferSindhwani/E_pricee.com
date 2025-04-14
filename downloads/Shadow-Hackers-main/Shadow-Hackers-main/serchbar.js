document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('searchButton');
    const searchContainer = document.querySelector('.search-container');

    // Define a mapping of search terms to URLs
    const searchMapping = {
        "iphone": "electronics.html",
        "laptop": "electronics.html",
        "fashion": "fashion.html",
        "jacket": "fashion.html",
        "watch": "watches.html",
        "headphones": "audio.html",
        "camera": "cameras.html",
        "gaming": "gaming.html",
        "travel": "travel.html",
        "furniture": "furniture.html",
        "kitchen": "kitchen-appliances.html",
        "health": "health.html",
        "beauty": "beauty.html"
    };

    // Function to toggle the search bar visibility
    function toggleSearchBar() {
        searchContainer.classList.toggle('active');
        searchInput.focus(); // Focus on the input when toggled open
    }

    // Function to handle search
    function handleSearch() {
        const query = searchInput.value.trim().toLowerCase();

        if (query in searchMapping) {
            // Redirect to the corresponding URL
            window.location.href = searchMapping[query];
        } else if (query) {
            // Perform a general search on Amazon if no match is found
            performSearch('amazon');
        } else {
            // Show an error message if no input is provided
            alert("Please enter a valid item.");
        }
    }

    // Add event listener to the search button for toggling and searching
    searchButton.addEventListener('click', function () {
        if (!searchContainer.classList.contains('active')) {
            toggleSearchBar(); // Open the search bar if it's not already open
        } else {
            handleSearch(); // Perform the search if the bar is already open
        }
    });

    // Add event listener for the "Enter" key
    searchInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission behavior
            handleSearch();
        }
    });

    // Perform search based on selected platform
    function performSearch(platform) {
        const query = searchInput.value.trim();
        if (query) {
            let url = '';
            switch (platform) {
                case 'amazon':
                    url = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
                    break;
                case 'flipkart':
                    url = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
                    break;
                case 'myntra':
                    url = `https://www.myntra.com/search?q=${encodeURIComponent(query)}`;
                    break;
                case 'meesho':
                    url = `https://www.meesho.com/search?q=${encodeURIComponent(query)}`;
                    break;
                default:
                    alert("Invalid platform selected.");
                    return;
            }
            window.location.href = url;
        } else {
            alert("Please enter a search query.");
        }
    }
});