// UI компонент достижений

class AchievementsUI {
    constructor(game) {
        this.game = game;
        this.screen = null;
    }
    
    init() {
        if (!document.getElementById('achievementsScreen')) {
            this.createScreen();
        }
        
        this.screen = document.getElementById('achievementsScreen');
        
        const closeBtn = this.screen.querySelector('[data-close="achievementsScreen"]');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }
    }
    
    createScreen() {
        const screen = document.createElement('div');
        screen.id = 'achievementsScreen';
        screen.className = 'screen overlay';
        screen.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h2>🏆 Достижения</h2>
                    <button class="close-btn" data-close="achievementsScreen">✕</button>
                </div>
                <div class="modal-content">
                    <div class="achievements-stats">
                        <span id="achievementsCount">0/0</span> разблокировано
                    </div>
                    <div id="achievementsContent"></div>
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
        const content = document.getElementById('achievementsContent');
        const achievements = this.game.achievementSystem.achievements;
        const unlocked = this.game.achievementSystem.unlockedAchievements;
        
        // Обновляем счётчик
        document.getElementById('achievementsCount').textContent = 
            `${unlocked.length}/${achievements.length}`;
        
        content.innerHTML = achievements.map(achievement => {
            const isUnlocked = unlocked.includes(achievement.id);
            return `
                <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">${isUnlocked ? achievement.icon : '🔒'}</div>
                    <div class="achievement-info">
                        <div class="achievement-name">${achievement.name}</div>
                        <div class="achievement-description">${achievement.description}</div>
                        ${isUnlocked ? `<div class="achievement-date">Получено: ${new Date(achievement.unlockedAt || Date.now()).toLocaleDateString('ru-RU')}</div>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    showNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-popup">
                <div class="achievement-popup-icon">${achievement.icon}</div>
                <div class="achievement-popup-text">
                    <div class="achievement-popup-title">Достижение разблокировано!</div>
                    <div class="achievement-popup-name">${achievement.name}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}
