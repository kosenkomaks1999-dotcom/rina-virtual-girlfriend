// Система воспоминаний

class MemorySystem {
    constructor(state) {
        this.state = state;
        this.memories = [];
        this.nextId = 1;
    }
    
    // Создать воспоминание
    createMemory(type, description, importance = 5) {
        const memory = {
            id: `memory_${this.nextId++}`,
            day: window.game?.day || 1,
            timestamp: Date.now(),
            type: type,
            description: description,
            importance: importance,
            emotion: this.state.currentMood,
            recalled: 0,
            canRecall: true
        };
        
        this.memories.push(memory);
        
        // Ограничиваем количество воспоминаний
        if (this.memories.length > 100) {
            this.memories = this.memories
                .sort((a, b) => b.importance - a.importance)
                .slice(0, 100);
        }
        
        return memory;
    }
    
    // Проверить спонтанное воспоминание
    checkSpontaneousRecall() {
        if (this.memories.length === 0) return null;
        if (this.state.memoryIntegrity < 40) return null;
        if (Math.random() > 0.25) return null;
        
        // Выбираем важное воспоминание
        const importantMemories = this.memories
            .filter(m => m.importance >= 7 && m.recalled < 3)
            .sort((a, b) => b.importance - a.importance);
        
        if (importantMemories.length === 0) return null;
        
        const memory = importantMemories[0];
        memory.recalled++;
        
        return {
            memory: memory,
            text: this.generateRecallText(memory)
        };
    }
    
    // Генерировать текст воспоминания
    generateRecallText(memory) {
        const templates = {
            help: `Помнишь, на ${memory.day}-й день ты помог мне? ${memory.description}`,
            game: `Мне вспомнилась наша игра на ${memory.day}-й день... ${memory.description}`,
            talk: `Я вспомнила наш разговор... ${memory.description}`,
            gift: `Спасибо за подарок тогда... ${memory.description}`,
            crisis: `Тот кризис на ${memory.day}-й день... Ты был рядом. ${memory.description}`,
            first: `Наша первая встреча... ${memory.description}`
        };
        
        return templates[memory.type] || `Я вспомнила... ${memory.description}`;
    }
    
    // Получить все воспоминания
    getAllMemories() {
        return this.memories.sort((a, b) => b.day - a.day);
    }
    
    // Получить важные воспоминания
    getImportantMemories() {
        return this.memories
            .filter(m => m.importance >= 7)
            .sort((a, b) => b.importance - a.importance);
    }
    
    // Сериализация
    toJSON() {
        return {
            memories: this.memories,
            nextId: this.nextId
        };
    }
    
    fromJSON(data) {
        this.memories = data.memories || [];
        this.nextId = data.nextId || 1;
    }
}
