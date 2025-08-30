/**
 * Celebration Modal Component
 * File: js/ui/components/celebration-modal.js
 */

class CelebrationModal {
    show(title, message, rewards = []) {
        const modal = document.getElementById('modal-container');
        if (!modal) return;
        
        modal.innerHTML = `
            <div class="modal-backdrop celebration-backdrop">
                <div class="celebration-modal">
                    <div class="celebration-icon">🎉</div>
                    <h2 class="celebration-title">${title}</h2>
                    <p class="celebration-message">${message}</p>
                    
                    ${rewards.length > 0 ? `
                        <div class="celebration-rewards">
                            ${rewards.map(reward => `
                                <div class="reward-item">
                                    <span class="reward-icon">${reward.icon}</span>
                                    <span class="reward-text">${reward.text}</span>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    <button class="btn btn-primary" onclick="UI.closeModal()">
                        Awesome!
                    </button>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
        
        // Add confetti effect
        this.createConfetti();
        
        // Auto close after 5 seconds
        setTimeout(() => {
            if (modal.style.display === 'block') {
                UI.closeModal();
            }
        }, 5000);
    }
    
    createConfetti() {
        const colors = ['#4ade80', '#22d3ee', '#a78bfa', '#fbbf24', '#ef4444'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 3000);
            }, i * 30);
        }
    }
}
