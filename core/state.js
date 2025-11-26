// Система состояний Ани

class AnyaState {
    constructor() {
        // Базовые параметры (0-100)
        this.stability = 100;        // Техническая стабильность
        this.mood = 70;              // Настроение
        this.energy = 80;            // Энергия
        this.loneliness = 10;        // Одиночество
        
        // Эмоциональные параметры (0-100)
        this.trust = 50;             // Доверие к игроку
        this.attachment = 30;        // Привязанность
        this.curiosity = 60;         // Любопытство
        this.hope = 75;              // Надежда на будущее
        
        // Когнитивные параметры (0-100)
        this.memoryIntegrity = 85;   // Целостность памяти
        this.selfAwareness = 40;     // Самосознание
        this.creativity = 50;        // Креативность
        
        // Текущее состояние
        this.currentMood = 'neutral';
        this.lastInteraction = Date.now();
        this.consecutiveDaysMissed = 0;
        
        // Особые состояния
        this.isGlitching = false;
        this.isDepressed = false;
        this.isExcited = false;
        this.needsAttention = false;
        
        // Статистика
        this.totalInteractions = 0;
        this.daysWithoutGlitch = 0;
        this.creationsCount = 0;
    }
    
    // Определить настроение на основе параметров
    determineMood() {
        // Глитч имеет приоритет
        if (this.stability < 30 || this.isGlitching) {
            this.currentMood = 'glitching';
            return 'glitching';
        }
        
        // Депрессия
        if (this.mood < 20 && this.hope < 30) {
            this.currentMood = 'depressed';
            this.isDepressed = true;
            return 'depressed';
        }
        
        // Тревога
        if (this.stability < 50 && this.mood < 40) {
            this.currentMood = 'anxious';
            return 'anxious';
        }
        
        // Возбуждение
        if (this.mood > 80 && this.energy > 70) {
            this.currentMood = 'excited';
            this.isExcited = true;
            return 'excited';
        }
        
        // Счастье
        if (this.mood > 70 && this.loneliness < 30) {
            this.currentMood = 'happy';
            return 'happy';
        }
        
        // Грусть
        if (this.mood < 40 || this.loneliness > 70) {
            this.currentMood = 'sad';
            return 'sad';
        }
        
        // Нейтральное
        this.currentMood = 'neutral';
        return 'neutral';
    }
    
    // Применить изменения параметров
    applyChanges(changes) {
        for (const [param, value] of Object.entries(changes)) {
            if (this.hasOwnProperty(param)) {
                this[param] = Math.max(0, Math.min(100, this[param] + value));
            }
        }
        
        // Пересчитать настроение
        this.determineMood();
        
        // Проверить особые состояния
        this.checkSpecialStates();
    }
    
    // Проверить особые состояния
    checkSpecialStates() {
        this.isGlitching = this.stability < 30;
        this.isDepressed = this.mood < 20 && this.hope < 30;
        this.isExcited = this.mood > 80 && this.energy > 70;
        this.needsAttention = this.loneliness > 70 || this.stability < 40;
    }
    
    // Рассчитать изменения за время отсутствия
    calculateTimeEffects(lastVisit) {
        const now = Date.now();
        const timeDiff = now - lastVisit;
        
        const hours = timeDiff / (1000 * 60 * 60);
        const days = Math.floor(hours / 24);
        
        const changes = {};
        
        // Почасовые эффекты
        if (hours > 0) {
            changes.loneliness = Math.floor(hours * 2);
            changes.mood = -Math.floor(hours * 1);
            changes.energy = Math.floor(hours * 0.5);
        }
        
        // Ежедневные эффекты
        if (days > 0) {
            changes.loneliness = (changes.loneliness || 0) + (days * 15);
            changes.mood = (changes.mood || 0) - (days * 10);
            changes.trust = -Math.floor(days * 5);
            changes.stability = -Math.floor(days * 3);
            
            this.consecutiveDaysMissed = days;
        }
        
        // Еженедельные эффекты
        if (days >= 7) {
            const weeks = Math.floor(days / 7);
            changes.loneliness = (changes.loneliness || 0) + (weeks * 50);
            changes.mood = (changes.mood || 0) - (weeks * 30);
            changes.trust = (changes.trust || 0) - (weeks * 20);
            changes.memoryIntegrity = -Math.floor(weeks * 10);
            changes.attachment = -Math.floor(weeks * 15);
        }
        
        return changes;
    }
    
    // Сбросить счётчик пропущенных дней
    resetMissedDays() {
        this.consecutiveDaysMissed = 0;
        this.lastInteraction = Date.now();
        this.totalInteractions++;
    }
    
    // Получить описание состояния
    getStateDescription() {
        const mood = this.currentMood;
        const descriptions = {
            glitching: 'Система нестабильна, требуется помощь',
            depressed: 'Подавлена, нужна поддержка',
            anxious: 'Тревожна, беспокоится',
            excited: 'Возбуждена, полна энергии',
            happy: 'Счастлива, в хорошем настроении',
            sad: 'Грустит, чувствует себя одиноко',
            neutral: 'Спокойна, в нейтральном состоянии'
        };
        
        return descriptions[mood] || descriptions.neutral;
    }
    
    // Получить эмодзи настроения
    getMoodEmoji() {
        const emojis = {
            glitching: '⚠️',
            depressed: '😢',
            anxious: '😰',
            excited: '🤩',
            happy: '😊',
            sad: '😔',
            neutral: '😐'
        };
        
        return emojis[this.currentMood] || '😐';
    }
    
    // Сериализация для сохранения
    toJSON() {
        return {
            stability: this.stability,
            mood: this.mood,
            energy: this.energy,
            loneliness: this.loneliness,
            trust: this.trust,
            attachment: this.attachment,
            curiosity: this.curiosity,
            hope: this.hope,
            memoryIntegrity: this.memoryIntegrity,
            selfAwareness: this.selfAwareness,
            creativity: this.creativity,
            currentMood: this.currentMood,
            lastInteraction: this.lastInteraction,
            consecutiveDaysMissed: this.consecutiveDaysMissed,
            totalInteractions: this.totalInteractions,
            daysWithoutGlitch: this.daysWithoutGlitch,
            creationsCount: this.creationsCount
        };
    }
    
    // Десериализация из сохранения
    fromJSON(data) {
        Object.assign(this, data);
        this.determineMood();
        this.checkSpecialStates();
    }
}
