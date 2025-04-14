document.addEventListener('DOMContentLoaded', function() {
    // Get all necessary elements
    const chatBotButton = document.getElementById('chatBotButton');
    const chatContainer = document.getElementById('chatContainer');
    const closeChat = document.getElementById('closeChat');
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.getElementById('sendButton');
    const chatMessages = document.getElementById('chatMessages');
    const typingIndicator = document.getElementById('typingIndicator');
    
    // Sample responses for the chatbot
    const botResponses = [
        "I can help you find the best deals across different platforms!",
        "Looking for a specific product? Tell me what you need.",
        "You can browse through our categories for popular deals.",
        "We compare prices from Amazon, Flipkart, Myntra, and many more online stores.",
        "Not sure what to buy? I can recommend trending products in any category.",
        "Our price comparison tool can help you save up to 40% on your purchases.",
        "Would you like me to explain how our price comparison works?",
        "Feel free to ask about any product you're interested in!"
    ];
    
    // Ensure the chatbot button is visible when page loads
    window.addEventListener('load', function() {
        // Force display the chat button
        chatBotButton.style.display = 'flex';
    });
    
    // Handle window resize to ensure button stays visible
    window.addEventListener('resize', function() {
        // Make sure button is visible and properly positioned
        chatBotButton.style.display = 'flex';
        chatBotButton.style.position = 'fixed';
        chatBotButton.style.bottom = '30px';
        chatBotButton.style.right = '30px';
    });
    
    // Handle scroll events
    window.addEventListener('scroll', function() {
        // Ensure the button stays in position during scroll
        chatBotButton.style.position = 'fixed';
        chatBotButton.style.bottom = '18px';
        chatBotButton.style.right = '20px';
    });
    
    // Open chatbot
    chatBotButton.addEventListener('click', function() {
        chatContainer.style.display = 'flex'; // Show the chatbot
        chatBotButton.style.display = 'none'; // Hide the button
        // Focus on input when chat opens
        setTimeout(() => {
            chatInput.focus();
        }, 300);
    });
    
    // Close chatbot
    closeChat.addEventListener('click', function() {
        chatContainer.style.display = 'none'; // Hide the chatbot
        chatBotButton.style.display = 'flex'; // Show the button
    });
    
    // Handle user message submission
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message.length > 0) {
            // Add user message to chat
            addMessage(message, true);
            chatInput.value = '';
            
            // Show typing indicator
            typingIndicator.style.display = 'block';
            
            // Simulate bot thinking and responding
            setTimeout(() => {
                typingIndicator.style.display = 'none';
                // Get random response for demo purposes
                const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
                addMessage(randomResponse, false);
            }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
        }
    }
    
    // Add a message to the chat (user or bot)
    function addMessage(message, isUser) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(isUser ? 'user-message' : 'bot-message');
        messageElement.textContent = message;
        
        // Insert before typing indicator
        chatMessages.insertBefore(messageElement, typingIndicator);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Send message when send button is clicked
    sendButton.addEventListener('click', sendMessage);
    
    // Send message when Enter key is pressed
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Fix any potential issues with hiding/showing of elements
    // This runs periodically to ensure visibility
    setInterval(() => {
        // If chat is closed, make sure button is visible
        if (chatContainer.style.display === 'none' || 
            chatContainer.style.display === '') {
            chatBotButton.style.display = 'flex';
        }
    }, 1000);
});