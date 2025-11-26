// Система состояний Ани v2.0

class AnyaState {
    constructor() {
        // Базовые параметры (0-100)
        this.stability = 100;
        this.mood = 70;
        this.energy = 80;
        this.loneliness = 10;
        
        // Эмоциональные параметры (0-100)
        this.trust = 50;
        this.attachment = 30;
        this.curiosity = 60;
        this.hope = 75;
        
        // Когнитивные параметры (0-100)
        this.memoryIntegrity = 85;
        this.selfAwareness = 40;
        this.creativity = 50;
        
        // Черты личности (0-100)
        this.optimism = 50;
        this.independence = 40;
        this.humor = 50;
        this.empathy = 60;
        this.rebellion = 30;
        
        // Текущее состояние
        this.currentMood = 'neutral';
        this.moodOfDay = null;
        this.digitalWeather = 'clear';
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
        this.totalPlayTime = 0;
    }
    
    // Определить настроение
    determineMood() {
        if (this.stability < 30 || this.isGlitching) {
            this.currentMood = 'glitching';
            return 'glitching';
        }
        
        if (this.mood < 20 && this.hope < 30) {
            this.currentMood = 'depressed';
            this.isDepressed = true;
            return 'depressed';
        }
        
        if (this.stability < 50 && this.mood < 40) {
            this.currentMood = 'anxious';
            return 'anxious';
        }
        
        if (this.mood > 80 && this.energy > 70) {
            this.currentMood = 'excited';
            this.isExcited = true;
            return 'excited';
        }
        
        if (this.mood > 70 && this.loneliness < 30) {
            this.currentMood = 'happy';
            return 'happy';
        }
        
        if (this.mood < 40 || this.loneliness > 70) {
            this.currentMood = 'sad';
            return 'sad';
        }
        
        this.currentMood = 'neutral';
        return 'neutral';
    }
    
    // Определить настроение дня
    determineMoodOfDay() {
        const moods = [
            { id: 'philosophical', chance: 0.15, requires: { selfAwareness: 50 } },
            { id: 'creative', chance: 0.20, requires: { creativity: 50 } },
            { id: 'playful', chance: 0.20, requires: { mood: 60, energy: 50 } },
            { id: 'quiet', chance: 0.15, requires: { energy: 30 } },
            { id: 'curious', chance: 0.20, requires: { curiosity: 50 } },
            { id: 'melancholic', chance: 0.10, requires: { mood: 40 } }
        ];
        
        for (const moodDay of moods) {
            if (Math.random() < moodDay.chance) {
                if (this.checkRequirements(moodDay.requires)) {
                    this.moodOfDay = moodDay.id;
                    return moodDay.id;
                }
            }
        }
        
        this.moodOfDay = 'normal';
        return 'normal';
    }
    
    // Определить цифровую погоду
    determineDigitalWeather() {
        if (this.mood > 80) return 'sunny';
        if (this.mood > 60) return 'clear';
        if (this.mood > 40) return 'cloudy';
        if (this.mood > 20) return 'rainy';
        if (this.stability < 40) return 'stormy';
        if (this.memoryIntegrity < 50) return 'foggy';
        return 'snowy';
    }
    
    // Применить изменения
    applyChanges(changes) {
        for (const [param, value] of Object.entries(changes)) {
            if (this.hasOwnProperty(param) && typeof this[param] === 'number') {
                this[param] = Math.max(0, Math.min(100, this[param] + value));
            }
        }
        
        this.determineMood();
        this.checkSpecialStates();
        this.digitalWeather = this.determineDigitalWeather();
    }
    
    // Проверить особые состояния
    checkSpecialStates() {
        this.isGlitching = this.stability < 30;
        this.isDepressed = this.mood < 20 && this.hope < 30;
        this.isExcited = this.mood > 80 && this.energy > 70;
        this.needsAttention = this.loneliness > 70 || this.stability < 40;
    }
    
    // Проверить требования
    checkRequirements(requires) {
        for (const [param, value] of Object.entries(requires)) {
            if (typeof value === 'string') {
                const operator = value[0];
                const threshold = parseInt(value.slice(1));
                if (operator === '<' && this[param] >= threshold) return false;
                if (operator === '>' && this[param] <= threshold) return false;
            } else {
                if (this[param] < value) return false;
            }
        }
        return true;
    }
    
    // Рассчитать изменения за время
    calculateTimeEffects(lastVisit) {
        const now = Date.now();
        const timeDiff = now - lastVisit;
        const hours = timeDiff / (1000 * 60 * 60);
        const days = Math.floor(hours / 24);
        
        const changes = {};
        
        if (hours > 0) {
            changes.loneliness = Math.floor(hours * 2);
            changes.mood = -Math.floor(hours * 1);
            changes.energy = Math.floor(hours * 0.5);
        }
        
        if (days > 0) {
            changes.loneliness = (changes.loneliness || 0) + (days * 15);
            changes.mood = (changes.mood || 0) - (days * 10);
            changes.trust = -Math.floor(days * 5);
            changes.stability = -Math.floor(days * 3);
            this.consecutiveDaysMissed = days;
        }
        
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
    
    // Сброс счётчика
    resetMissedDays() {
        this.consecutiveDaysMissed = 0;
        this.lastInteraction = Date.now();
        this.totalInteractions++;
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
    
    // Сериализация
    toJSON() {
        return { ...this };
    }
    
    // Десериализация
    fromJSON(data) {
        Object.assign(this, data);
        this.determineMood();
        this.checkSpecialStates();
    }
}
