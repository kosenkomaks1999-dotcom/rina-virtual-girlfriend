// UI компонент активностей

class ActivitiesUI {
    constructor(game) {
        this.game = game;
        this.screen = null;
    }
    
    init() {
        this.screen = document.getElementById('activitiesScreen');
        
        // Кнопка закрытия
        const closeBtn = this.screen.querySelector('[data-close="activitiesScreen"]');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }
    }
    
    show() {
        this.render();
        this.screen.classList.add('active');
    }
    
    hide() {
        this.screen.classList.remove('active');
    }
    
    render() {
        const grid = document.getElementById('activityGrid');
        const activities = this.game.activitySystem.getAvailableActivities();
        
        grid.innerHTML = activities.map(activity => `
            <button class="activity-card" data-activity="${activity.id}">
                <div class="activity-icon">${activity.icon}</div>
                <div class="activity-name">${activity.name}</div>
                <div class="activity-effects">
                    ${this.renderEffects(activity.effects)}
                </div>
                <div class="activity-energy">⚡ ${activity.energyCost}</div>
            </button>
        `).join('');
        
        // Добавляем обработчики
        grid.querySelectorAll('.activity-card').forEach(card => {
            card.addEventListener('click', () => {
                const activityId = card.dataset.activity;
                this.executeActivity(activityId);
            });
        });
    }
    
    renderEffects(effects) {
        const icons = {
            mood: '😊',
            energy: '⚡',
            stability: '🔧',
            trust: '❤️',
            curiosity: '🔍'
        };
        
        return Object.entries(effects)
            .filter(([key, value]) => value !== 0)
            .map(([key, value]) => {
                const sign = value > 0 ? '+' : '';
                return `<span class="effect ${value > 0 ? 'positive' : 'negative'}">${icons[key] || ''}${sign}${value}</span>`;
            })
            .join(' ');
    }
    
    executeActivity(activityId) {
        // Особая обработка для разговора
        if (activityId === 'talk') {
            this.hide();
            this.game.startConversation();
            return;
        }
        
        const result = this.game.activitySystem.executeActivity(activityId);
        
        if (result.success) {
            // Добавляем сообщение в чат
            this.game.chatUI.addMessage(result.message, 'system');
            
            // Создаём воспоминание
            this.game.memorySystem.createMemory(activityId, result.message, 5);
            
            // Реакция аватара
            if (result.effects && result.effects.mood > 0) {
                this.game.avatarSystem.playReaction('happy');
            } else if (result.effects && result.effects.mood < 0) {
                this.game.avatarSystem.playReaction('sad');
            }
            
            // Обновляем UI
            this.game.updateUI();
            
            // Сохраняем
            this.game.saveSystem.save();
            
            // Закрываем экран активностей
            this.hide();
            
            // Показываем реакцию Ани через секунду
            setTimeout(() => {
                const response = this.game.dialogueGenerator.generateResponse('activity', {
                    activity: activityId,
                    mood: this.game.anyaState.mood
                });
                this.game.chatUI.addMessage(response, 'anya');
            }, 1000);
        } else {
            // Показываем ошибку
            this.game.chatUI.addMessage(result.message, 'system');
        }
    }
}
