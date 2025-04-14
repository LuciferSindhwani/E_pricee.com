document.addEventListener('DOMContentLoaded', function() {
    const settingsOverlay = document.getElementById('settingsOverlay');
    const profileMenu = document.getElementById('profileMenu');
    const fileInput = document.getElementById('fileInput');
    const cameraInput = document.getElementById('cameraInput');
    const removePhoto = document.getElementById('removePhoto');
    const profilePic = document.getElementById('profilePic');
    const defaultImage = 'https://via.placeholder.com/150';

    // Toggle menu
    settingsOverlay.addEventListener('click', (e) => {
        e.stopPropagation();
        profileMenu.classList.toggle('show');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!profileMenu.contains(e.target) && !settingsOverlay.contains(e.target)) {
            profileMenu.classList.remove('show');
        }
    });

    // Handle file upload
    fileInput.addEventListener('change', handleImageSelect);
    cameraInput.addEventListener('change', handleImageSelect);

    function handleImageSelect(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePic.src = e.target.result;
                // Store in localStorage for persistence
                localStorage.setItem('profileImage', e.target.result);
            };
            reader.readAsDataURL(file);
        }
        profileMenu.classList.remove('show');
    }

    // Handle photo removal
    removePhoto.addEventListener('click', () => {
        profilePic.src = defaultImage;
        localStorage.removeItem('profileImage');
        profileMenu.classList.remove('show');
    });

    // Load saved image on page load
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
        profilePic.src = savedImage;
    }
});


document.addEventListener('DOMContentLoaded', function() {
    // Keep your existing profile picture related code

    // Profile editing functionality
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editButtons = document.getElementById('editButtons');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    
    const username = document.getElementById('username');
    const fullName = document.getElementById('fullName');
    const bio = document.getElementById('bio');

    let originalContent = {
        username: username.textContent,
        fullName: fullName.textContent,
        bio: bio.textContent
    };

    // Load saved profile content
    const savedProfile = localStorage.getItem('profileContent');
    if (savedProfile) {
        const content = JSON.parse(savedProfile);
        username.textContent = content.username;
        fullName.textContent = content.fullName;
        bio.textContent = content.bio;
        originalContent = content;
    }

    function createInput(element, placeholder) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'edit-input';
        input.value = element.textContent;
        input.placeholder = placeholder;
        input.style.fontSize = window.getComputedStyle(element).fontSize;
        input.style.fontWeight = window.getComputedStyle(element).fontWeight;
        return input;
    }

    function makeEditable(element, placeholder) {
        const input = createInput(element, placeholder);
        element.replaceWith(input);
        return input;
    }

    function saveContent(input, originalElement) {
        const newContent = input.value.trim();
        originalElement.textContent = newContent || originalElement.textContent;
        input.replaceWith(originalElement);
    }

    let currentInputs = [];

    editProfileBtn.addEventListener('click', function() {
        if (editProfileBtn.textContent === 'Edit profile') {
            editProfileBtn.textContent = 'Editing...';
            editButtons.classList.add('show');
            
            currentInputs = [
                { input: makeEditable(username, 'Username'), original: username },
                { input: makeEditable(fullName, 'Full Name'), original: fullName },
                { input: makeEditable(bio, 'Bio'), original: bio }
            ];
        } else {
            editProfileBtn.textContent = 'Edit profile';
            editButtons.classList.remove('show');
            
            currentInputs.forEach(({input, original}) => {
                saveContent(input, original);
            });
            originalContent = {
                username: username.textContent,
                fullName: fullName.textContent,
                bio: bio.textContent
            };
            localStorage.setItem('profileContent', JSON.stringify(originalContent));
            currentInputs = [];
        }
    });

    saveBtn.addEventListener('click', function() {
        editProfileBtn.textContent = 'Edit profile';
        editButtons.classList.remove('show');
        
        currentInputs.forEach(({input, original}) => {
            saveContent(input, original);
        });
        originalContent = {
            username: username.textContent,
            fullName: fullName.textContent,
            bio: bio.textContent
        };
        localStorage.setItem('profileContent', JSON.stringify(originalContent));
        currentInputs = [];
    });

    cancelBtn.addEventListener('click', function() {
        editProfileBtn.textContent = 'Edit profile';
        editButtons.classList.remove('show');
        
        username.textContent = originalContent.username;
        fullName.textContent = originalContent.fullName;
        bio.textContent = originalContent.bio;
        
        currentInputs.forEach(({input, original}) => {
            input.replaceWith(original);
        });
        currentInputs = [];
    });
});



  const storage = {
liked: new Set(JSON.parse(localStorage.getItem('likedImages') || '[]')),
saved: new Set(JSON.parse(localStorage.getItem('savedImages') || '[]')),

// Save to localStorage
save() {
localStorage.setItem('likedImages', JSON.stringify([...this.liked]));
localStorage.setItem('savedImages', JSON.stringify([...this.saved]));
}
};

// Initialize the UI state for all images in the gallery
function initializeGalleryActions() {
const images = document.querySelectorAll('.image');

images.forEach(imageContainer => {
const img = imageContainer.querySelector('img');
const imgSrc = img.src;

// Like button
const likeBtn = imageContainer.querySelector('.liked');
if (likeBtn) {
likeBtn.classList.toggle('active', storage.liked.has(imgSrc));

likeBtn.addEventListener('click', (e) => {
  e.preventDefault();
if (storage.liked.has(imgSrc)) {
  storage.liked.delete(imgSrc);
  likeBtn.classList.remove('active');
} else {
  storage.liked.add(imgSrc);
  likeBtn.classList.add('active');
}
storage.save();
updateProfileGalleries();
});
}

// Save button
const saveBtn = imageContainer.querySelector('.saved-icon');
if (saveBtn) {
saveBtn.classList.toggle('active', storage.saved.has(imgSrc));

saveBtn.addEventListener('click', (e) => {
e.preventDefault();
if (storage.saved.has(imgSrc)) {
  storage.saved.delete(imgSrc);
  saveBtn.classList.remove('active');
} else {
  storage.saved.add(imgSrc);
  saveBtn.classList.add('active');
}
storage.save();
updateProfileGalleries();
});
}

// Share button
const shareBtn = imageContainer.querySelector('.shared');
if (shareBtn) {
shareBtn.addEventListener('click', (e) => {
e.preventDefault();
if (navigator.share) {
  navigator.share({
    title: 'Check out this image!',
    url: imgSrc
  });
} else {
  navigator.clipboard.writeText(imgSrc).then(() => {
    alert('Image URL copied to clipboard!');
  });
}
});
}

// Download button
const downloadBtn = imageContainer.querySelector('.downloaded');
if (downloadBtn) {
downloadBtn.addEventListener('click', (e) => {
e.preventDefault();
const link = document.createElement('a');
link.href = imgSrc;
link.download = imgSrc.split('/').pop();
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
});
}
});
}

// Function to update both saved and liked galleries in the profile page
function updateProfileGalleries() {
const savedTab = document.getElementById('saved');
const likedTab = document.getElementById('tagged');

if (savedTab) {
updateGalleryTab(savedTab, storage.saved, 'saved-items');
}

if (likedTab) {
updateGalleryTab(likedTab, storage.liked, 'liked-items');
}
}

// Function to update a specific gallery tab
function updateGalleryTab(tabElement, imageSet, containerClass) {
// Create or get the posts container
let postsContainer = tabElement.querySelector('.posts-container');
if (!postsContainer) {
postsContainer = document.createElement('div');
postsContainer.className = 'posts-container';
tabElement.innerHTML = ''; // Clear existing content
tabElement.appendChild(postsContainer);
}

// Clear existing images
postsContainer.innerHTML = '';

// Add images to the container
imageSet.forEach(imgSrc => {
const postDiv = document.createElement('div');
postDiv.className = 'post-image';
postDiv.innerHTML = `
<img src="${imgSrc}" alt="Gallery Image">
<div class="image-actions">
<button class="remove-btn" data-src="${imgSrc}">
  <i class="bi bi-trash"></i>
</button>
</div>
`;

// Add remove functionality
const removeBtn = postDiv.querySelector('.remove-btn');
removeBtn.addEventListener('click', () => {
imageSet.delete(imgSrc);
storage.save();
updateProfileGalleries();
// Also update main gallery if we're on that page
if (document.querySelector('.image-container')) {
initializeGalleryActions();
}
});

postsContainer.appendChild(postDiv);
});

// Show message if no images
if (imageSet.size === 0) {
const emptyMessage = document.createElement('div');
emptyMessage.className = 'text-center p-4';
emptyMessage.textContent = No ${containerClass === 'saved-items' ? 'saved' : 'liked'} images yet;
tabElement.appendChild(emptyMessage);
}
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
initializeGalleryActions();
updateProfileGalleries();

// Add tab change listener to refresh galleries
const profileTabs = document.getElementById('profileTabs');
if (profileTabs) {
profileTabs.addEventListener('shown.bs.tab', updateProfileGalleries);
}
});

// Initialize the editor when the DOM is loaded
// document.addEventListener('DOMContentLoaded', () => {
// const imageEditor = new ImageEditor();
// });


// Function to get URL parameters
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// When the page loads, set the username
document.addEventListener('DOMContentLoaded', function() {
    const usernameElement = document.getElementById('username');
    
    // First try to get the username from localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser && currentUser.fullname) {
        usernameElement.textContent = currentUser.fullname;
    } else {
        usernameElement.textContent = 'User';
    }
});