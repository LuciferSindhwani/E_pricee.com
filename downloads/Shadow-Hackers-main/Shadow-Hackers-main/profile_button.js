  // Easter Egg: Double-click on profile avatar to change its gradient
  document.addEventListener('DOMContentLoaded', function() {
    const avatar = document.querySelector('.details-avatar');
    const gradients = [
        'linear-gradient(135deg, #6e8efb, #a777e3)',
        'linear-gradient(135deg, #ff9966, #ff5e62)',
        'linear-gradient(135deg, #00f2fe, #4facfe)',
        'linear-gradient(135deg, #f093fb, #f5576c)',
        'linear-gradient(135deg, #43e97b, #38f9d7)'
    ];
    let currentGradient = 0;
    
    avatar.addEventListener('dblclick', function() {
        currentGradient = (currentGradient + 1) % gradients.length;
        avatar.style.background = gradients[currentGradient];
        
        // Show a little message
        const message = document.createElement('div');
        message.textContent = "Avatar changed!";
        message.style.position = 'absolute';
        message.style.bottom = '10px';
        message.style.left = '50%';
        message.style.transform = 'translateX(-50%)';
        message.style.color = '#fff';
        message.style.fontSize = '0.8rem';
        message.style.padding = '5px 10px';
        message.style.background = 'rgba(93, 93, 255, 0.3)';
        message.style.borderRadius = '4px';
        message.style.opacity = '0';
        message.style.transition = 'opacity 0.3s ease';
        
        document.querySelector('.profile-details').appendChild(message);
        
        setTimeout(() => {
            message.style.opacity = '1';
            
            setTimeout(() => {
                message.style.opacity = '0';
                setTimeout(() => message.remove(), 300);
            }, 1500);
        }, 100);
    });
});