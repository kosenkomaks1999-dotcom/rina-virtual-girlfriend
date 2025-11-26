// UI компонент секретов

class SecretsUI {
    constructor(game) {
        this.game = game;
        this.screen = null;
    }
    
    init() {
        if (!document.getElementById('secretsScreen')) {
            this.createScreen();
        }
        
        this.screen = document.getElementById('secretsScreen');
        
        const closeBtn = this.screen.querySelector('[data-close="secretsScreen"]');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }
    }
    
    createScreen() {
        const screen = document.createElement('div');
        screen.id = 'secretsScreen';
        screen.className = 'screen overlay';
        screen.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h2>🔐 Секреты Ани</h2>
                    <button class="close-btn" data-close="secretsScreen">✕</button>
                </div>
                <div class="modal-content">
                    <div class="secrets-info">
                        Аня раскрывает секреты по мере роста доверия
                    </div>
                    <div id="secretsContent"></div>
                </div>
            </div>
        `;
        document.getElementById('app').appendChild(screen);
    }
    
    show() {
        this.render();
        this.screen.classList.add('active');
    }
    
    hide() {
        this.screen.classList.remove('active');
    }
    
    render() {
        const content = document.getElementById('secretsContent');
        const secrets = this.game.secretSystem.secrets;
        const revealed = this.game.secretSystem.revealedSecrets;
        const currentTrust = this.game.anyaState.trust;
        
        content.innerHTML = secrets.map(secret => {
            const isRevealed = revealed.includes(secret.id);
            const canReveal = currentTrust >= secret.trustRequired && !isRevealed;
            
            return `
                <div class="secret-card ${isRevealed ? 'revealed' : canReveal ? 'available' : 'locked'}">
                    <div class="secret-header">
                        <span class="secret-icon">${isRevealed ? '🔓' : canReveal ? '🔑' : '🔒'}</span>
                        <span class="secret-trust">Доверие: ${secret.trustRequired}%</span>
                    </div>
                    ${isRevealed ? `
                        <div class="secret-title">${secret.title}</div>
                        <div class="secret-text">${secret.text}</div>
                    ` : canReveal ? `
                        <div class="secret-title">Новый секрет доступен!</div>
                        <button class="reveal-btn" data-secret="${secret.id}">Узнать секрет</button>
                    ` : `
                        <div class="secret-title">???</div>
                        <div class="secret-text">Требуется больше доверия</div>
                    `}
                </div>
            `;
        }).join('');
        
        // Добавляем обработчики для кнопок раскрытия
        content.querySelectorAll('.reveal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const secretId = btn.dataset.secret;
                this.revealSecret(secretId);
            });
        });
    }
    
    revealSecret(secretId) {
        const secret = this.game.secretSystem.revealSecret(secretId);
        
        if (secret) {
            // Показываем секрет в чате
            this.hide();
            
            setTimeout(() => {
                this.game.chatUI.addMessage('Аня хочет рассказать тебе что-то важное...', 'system');
                
                setTimeout(() => {
                    this.game.chatUI.addMessage(secret.text, 'anya');
                    
                    // Создаём важное воспоминание
                    this.game.memorySystem.createMemory('secret', secret.text, 10);
                    
                    // Сохраняем
                    this.game.saveSystem.save();
                }, 2000);
            }, 500);
        }
    }
}
