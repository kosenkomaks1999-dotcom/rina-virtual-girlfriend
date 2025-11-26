// UI компонент чата

class ChatUI {
    constructor(game) {
        this.game = game;
        this.messagesContainer = null;
        this.choicesContainer = null;
        this.typingIndicator = null;
    }
    
    init() {
        this.messagesContainer = document.getElementById('chatMessages');
        this.choicesContainer = document.getElementById('choicesContainer');
        this.typingIndicator = document.getElementById('typingIndicator');
    }
    
    addMessage(text, type = 'anya', isGlitch = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}${isGlitch ? ' glitch' : ''}`;
        
        const timestamp = new Date().toTimeString().split(' ')[0];
        
        messageDiv.innerHTML = `
            <span class="timestamp">[${timestamp}]</span>
            <div class="message-text">${text}</div>
        `;
        
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        
        // Реакция аватара
        if (type === 'anya' && this.game.avatarSystem) {
            this.game.avatarSystem.blink();
        }
    }
    
    showTyping() {
        if (this.typingIndicator) {
            this.typingIndicator.classList.add('active');
        }
    }
    
    hideTyping() {
        if (this.typingIndicator) {
            this.typingIndicator.classList.remove('active');
        }
    }
    
    showChoices(choices) {
        this.choicesContainer.innerHTML = '';
        
        choices.forEach(choice => {
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.textContent = choice.text;
            button.addEventListener('click', () => {
                this.choicesContainer.innerHTML = '';
                if (choice.action) choice.action();
            });
            this.choicesContainer.appendChild(button);
        });
    }
    
    clearChoices() {
        this.choicesContainer.innerHTML = '';
    }
    
    async showMessages(messages, index = 0, callback = null) {
        if (index >= messages.length) {
            if (callback) callback();
            return;
        }
        
        const message = messages[index];
        const delay = message.delay || 1500;
        
        this.showTyping();
        
        setTimeout(() => {
            this.hideTyping();
            this.addMessage(message.text, message.type || 'anya', message.glitch);
            
            setTimeout(() => {
                this.showMessages(messages, index + 1, callback);
            }, 800);
        }, delay);
    }
}
