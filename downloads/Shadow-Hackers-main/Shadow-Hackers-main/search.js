 // Perform search on the selected platform
 function performSearch(platform) {
  const query = document.getElementById('search-input').value.trim();
  if (query) {
      let url = '';
      switch(platform) {
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