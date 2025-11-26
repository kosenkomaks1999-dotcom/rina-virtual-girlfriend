// UI компонент статистики

class StatsUI {
    constructor(game) {
        this.game = game;
        this.screen = null;
    }
    
    init() {
        this.screen = document.getElementById('statsScreen');
        
        // Кнопка закрытия
        const closeBtn = this.screen.querySelector('[data-close="statsScreen"]');
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
        const content = document.getElementById('statsContent');
        const state = this.game.anyaState;
        const personality = this.game.personalitySystem;
        
        content.innerHTML = `
            <div class="stats-section">
                <h3>📊 Основные параметры</h3>
                <div class="stat-row">
                    <span>Стабильность:</span>
                    <span>${Math.floor(state.stability)}%</span>
                </div>
                <div class="stat-row">
                    <span>Настроение:</span>
                    <span>${Math.floor(state.mood)}%</span>
                </div>
                <div class="stat-row">
                    <span>Энергия:</span>
                    <span>${Math.floor(state.energy)}%</span>
                </div>
                <div class="stat-row">
                    <span>Доверие:</span>
                    <span>${Math.floor(state.trust)}%</span>
                </div>
                <div class="stat-row">
                    <span>Любопытство:</span>
                    <span>${Math.floor(state.curiosity)}%</span>
                </div>
            </div>
            
            <div class="stats-section">
                <h3>🎭 Личность</h3>
                ${Object.entries(personality.traits).map(([trait, value]) => `
                    <div class="stat-row">
                        <span>${this.getTraitName(trait)}:</span>
                        <span>${Math.floor(value)}%</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="stats-section">
                <h3>📈 Прогресс</h3>
                <div class="stat-row">
                    <span>День:</span>
                    <span>${this.game.day}</span>
                </div>
                <div class="stat-row">
                    <span>Воспоминаний:</span>
                    <span>${this.game.memorySystem.memories.length}</span>
                </div>
                <div class="stat-row">
                    <span>Записей в дневнике:</span>
                    <span>${this.game.diarySystem.entries.length}</span>
                </div>
                <div class="stat-row">
                    <span>Достижений:</span>
                    <span>${this.game.achievementSystem.unlockedAchievements.length}/${this.game.achievementSystem.achievements.length}</span>
                </div>
            </div>
            
            <div class="stats-section">
                <h3>🎯 Цели</h3>
                ${this.renderGoals()}
            </div>
        `;
    }
    
    getTraitName(trait) {
        const names = {
            openness: 'Открытость',
            curiosity: 'Любознательность',
            empathy: 'Эмпатия',
            independence: 'Независимость',
            playfulness: 'Игривость',
            anxiety: 'Тревожность',
            trust: 'Доверие'
        };
        return names[trait] || trait;
    }
    
    renderGoals() {
        const activeGoals = this.game.goalSystem.goals.filter(g => g.active && !g.completed);
        
        if (activeGoals.length === 0) {
            return '<div class="stat-row">Нет активных целей</div>';
        }
        
        return activeGoals.map(goal => `
            <div class="goal-item">
                <div class="goal-name">${goal.name}</div>
                <div class="goal-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${goal.progress}%"></div>
                    </div>
                    <span>${goal.progress}%</span>
                </div>
            </div>
        `).join('');
    }
}
