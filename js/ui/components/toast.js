/**
 * Toast Component
 * File: js/ui/components/toast.js
 */

class ToastComponent {
    constructor(uiManager) {
        this.ui = uiManager;
        this.activeToasts = [];
    }
    
    show(message, type = 'info', duration = 3000, actions = []) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toastId = `toast_${Date.now()}`;
        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = `toast toast-${type}`;
        
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
                ${actions.length > 0 ? `
                    <div class="toast-actions">
                        ${actions.map(action => 
                            `<button class="toast-action" onclick="${action.action}">${action.text}</button>`
                        ).join('')}
                    </div>
                ` : ''}
            </div>
        `;
        
        container.appendChild(toast);
        this.activeToasts.push(toastId);
        
        // Animate in
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Auto remove
        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => {
                toast.remove();
                this.activeToasts = this.activeToasts.filter(id => id !== toastId);
            }, 300);
        }, duration);
    }
    
    clear() {
        this.activeToasts.forEach(id => {
            const toast = document.getElementById(id);
            if (toast) toast.remove();
        });
        this.activeToasts = [];
    }
}
