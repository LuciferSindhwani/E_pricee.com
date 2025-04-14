import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

def web_crawler(start_url, max_pages=5):
    visited = set()  
    to_visit = [start_url]  
    for _ in range(max_pages):
        if not to_visit:
            break

        
        current_url = to_visit.pop(0)
        if current_url in visited:
            continue

        print(f"Crawling: {current_url}")
        try:
            # Send a request and fetch the HTML content
            response = requests.get(current_url, headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
            })
            if response.status_code != 200:
                print(f"Failed to fetch {current_url}: {response.status_code}")
                continue
            
            # Parse the HTML
            soup = BeautifulSoup(response.text, "html.parser")
            
            # Extract and print page title
            title = soup.title.string if soup.title else "No Title"
            print(f"Title: {title}")
            
            # Extract all links on the page
            for link in soup.find_all("a", href=True):
                full_url = urljoin(current_url, link["href"])
                if full_url not in visited:
                    to_visit.append(full_url)
            
            visited.add(current_url)  # Mark this page as visited
        except Exception as e:
            print(f"Error crawling {current_url}: {e}")

# Start the crawler
start_url = "https://amazon.com"
web_crawler(start_url)