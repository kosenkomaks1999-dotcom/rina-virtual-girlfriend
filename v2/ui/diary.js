// UI компонент дневника

class DiaryUI {
    constructor(game) {
        this.game = game;
        this.screen = null;
    }
    
    init() {
        // Создаём экран дневника если его нет
        if (!document.getElementById('diaryScreen')) {
            this.createScreen();
        }
        
        this.screen = document.getElementById('diaryScreen');
        
        // Кнопка закрытия
        const closeBtn = this.screen.querySelector('[data-close="diaryScreen"]');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }
    }
    
    createScreen() {
        const screen = document.createElement('div');
        screen.id = 'diaryScreen';
        screen.className = 'screen overlay';
        screen.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h2>📔 Дневник Ани</h2>
                    <button class="close-btn" data-close="diaryScreen">✕</button>
                </div>
                <div class="modal-content">
                    <div id="diaryContent"></div>
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
        const content = document.getElementById('diaryContent');
        const entries = this.game.diarySystem.entries.slice().reverse(); // Новые сверху
        
        if (entries.length === 0) {
            content.innerHTML = '<div class="empty-state">Дневник пока пуст...</div>';
            return;
        }
        
        content.innerHTML = entries.map(entry => `
            <div class="diary-entry">
                <div class="diary-date">День ${entry.day} - ${new Date(entry.timestamp).toLocaleDateString('ru-RU')}</div>
                <div class="diary-mood">${this.getMoodEmoji(entry.mood)} ${this.getMoodText(entry.mood)}</div>
                <div class="diary-text">${entry.text}</div>
            </div>
        `).join('');
    }
    
    getMoodEmoji(mood) {
        if (mood >= 80) return '😊';
        if (mood >= 60) return '🙂';
        if (mood >= 40) return '😐';
        if (mood >= 20) return '😔';
        return '😢';
    }
    
    getMoodText(mood) {
        if (mood >= 80) return 'Отличное настроение';
        if (mood >= 60) return 'Хорошее настроение';
        if (mood >= 40) return 'Нормальное настроение';
        if (mood >= 20) return 'Плохое настроение';
        return 'Очень плохое настроение';
    }
}
