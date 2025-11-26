// UI компонент воспоминаний

class MemoriesUI {
    constructor(game) {
        this.game = game;
        this.screen = null;
    }
    
    init() {
        if (!document.getElementById('memoriesScreen')) {
            this.createScreen();
        }
        
        this.screen = document.getElementById('memoriesScreen');
        
        const closeBtn = this.screen.querySelector('[data-close="memoriesScreen"]');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hide());
        }
    }
    
    createScreen() {
        const screen = document.createElement('div');
        screen.id = 'memoriesScreen';
        screen.className = 'screen overlay';
        screen.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h2>💭 Воспоминания</h2>
                    <button class="close-btn" data-close="memoriesScreen">✕</button>
                </div>
                <div class="modal-content">
                    <div id="memoriesContent"></div>
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
        const content = document.getElementById('memoriesContent');
        const memories = this.game.memorySystem.getRecentMemories(20);
        
        if (memories.length === 0) {
            content.innerHTML = '<div class="empty-state">Воспоминаний пока нет...</div>';
            return;
        }
        
        content.innerHTML = memories.map(memory => `
            <div class="memory-card">
                <div class="memory-header">
                    <span class="memory-type">${this.getMemoryIcon(memory.type)}</span>
                    <span class="memory-importance">${'⭐'.repeat(Math.min(5, Math.floor(memory.importance / 2)))}</span>
                </div>
                <div class="memory-text">${memory.text}</div>
                <div class="memory-date">${new Date(memory.timestamp).toLocaleDateString('ru-RU')}</div>
            </div>
        `).join('');
    }
    
    getMemoryIcon(type) {
        const icons = {
            talk: '💬',
            play: '🎮',
            learn: '📚',
            create: '🎨',
            rest: '😴',
            explore: '🔍',
            help: '🤝'
        };
        return icons[type] || '💭';
    }
}
