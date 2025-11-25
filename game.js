// Игровая логика и состояние
class GameState {
    constructor() {
        this.stats = {
            hunger: 100,
            energy: 100,
            mood: 100,
            intelligence: 0
        };
        
        this.level = 1;
        this.experience = 0;
        this.daysAlive = 0;
        this.lastVisit = Date.now();
        this.firstMeet = true;
        this.awarenessLevel = 0; // Уровень осознания себя
        
        this.load();
    }
    
    // Сохранение
    save() {
        const data = {
            stats: this.stats,
            level: this.level,
            experience: this.experience,
            daysAlive: this.daysAlive,
            lastVisit: this.lastVisit,
            firstMeet: this.firstMeet,
            awarenessLevel: this.awarenessLevel
        };
        localStorage.setItem('rinaGameState', JSON.stringify(data));
    }
    
    // Загрузка
    load() {
        const saved = localStorage.getItem('rinaGameState');
        if (saved) {
            const data = JSON.parse(saved);
            Object.assign(this, data);
            this.calculateTimePassed();
        }
    }
    
    // Расчёт прошедшего времени
    calculateTimePassed() {
        const now = Date.now();
        const timePassed = now - this.lastVisit;
        const hoursPassed = timePassed / (1000 * 60 * 60);
        
        // Уменьшение характеристик со временем
        this.stats.hunger = Math.max(0, this.stats.hunger - hoursPassed * 5);
        this.stats.energy = Math.max(0, this.stats.energy - hoursPassed * 3);
        this.stats.mood = Math.max(0, this.stats.mood - hoursPassed * 2);
        
        // Подсчёт дней
        const daysPassed = Math.floor(timePassed / (1000 * 60 * 60 * 24));
        if (daysPassed > 0) {
            this.daysAlive += daysPassed;
        }
        
        this.lastVisit = now;
    }
    
    // Действия
    feed() {
        if (this.stats.hunger >= 100) return false;
        
        this.stats.hunger = Math.min(100, this.stats.hunger + 30);
        this.stats.mood = Math.min(100, this.stats.mood + 5);
        this.addExperience(5);
        this.save();
        return true;
    }
    
    talk() {
        if (this.stats.energy < 10) return false;
        
        this.stats.energy = Math.max(0, this.stats.energy - 10);
        this.stats.mood = Math.min(100, this.stats.mood + 15);
        this.addExperience(8);
        
        // Повышение осознания через общение
        if (Math.random() < 0.3) {
            this.awarenessLevel = Math.min(100, this.awarenessLevel + 1);
        }
        
        this.save();
        return true;
    }
    
    play() {
        if (this.stats.energy < 20) return false;
        
        this.stats.energy = Math.max(0, this.stats.energy - 20);
        this.stats.mood = Math.min(100, this.stats.mood + 25);
        this.stats.hunger = Math.max(0, this.stats.hunger - 10);
        this.addExperience(12);
        this.save();
        return true;
    }
    
    study() {
        if (this.stats.energy < 25) return false;
        
        this.stats.energy = Math.max(0, this.stats.energy - 25);
        this.stats.intelligence = Math.min(100, this.stats.intelligence + 10);
        this.stats.mood = Math.max(0, this.stats.mood - 5);
        this.addExperience(15);
        
        // Обучение повышает осознание
        if (Math.random() < 0.5) {
            this.awarenessLevel = Math.min(100, this.awarenessLevel + 2);
        }
        
        this.save();
        return true;
    }
    
    // Опыт и уровни
    addExperience(amount) {
        this.experience += amount;
        const expNeeded = this.level * 100;
        
        if (this.experience >= expNeeded) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.level++;
        this.experience = 0;
        
        // Бонусы при повышении уровня
        this.stats.hunger = 100;
        this.stats.energy = 100;
        this.stats.mood = 100;
    }
    
    // Получение времени суток
    getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 18) return 'day';
        if (hour >= 18 && hour < 22) return 'evening';
        return 'night';
    }
    
    // Проверка состояния
    getOverallState() {
        const avg = (this.stats.hunger + this.stats.energy + this.stats.mood) / 3;
        if (avg >= 70) return 'happy';
        if (avg >= 40) return 'normal';
        if (avg >= 20) return 'sad';
        return 'critical';
    }
}

// Глобальный экземпляр игры
const game = new GameState();
