// Система достижений

class AchievementSystem {
    constructor(state) {
        this.state = state;
        this.unlockedAchievements = [];
    }
    
    // Проверить достижения
    checkAchievements() {
        const achievements = this.getAchievements();
        const newlyUnlocked = [];
        
        for (const achievement of achievements) {
            if (this.unlockedAchievements.includes(achievement.id)) continue;
            
            if (this.checkRequirements(achievement.requires)) {
                this.unlockAchievement(achievement.id);
                newlyUnlocked.push(achievement);
            }
        }
        
        return newlyUnlocked;
    }
    
    // Разблокировать достижение
    unlockAchievement(achievementId) {
        if (this.unlockedAchievements.includes(achievementId)) return false;
        
        this.unlockedAchievements.push(achievementId);
        
        // Применяем награду
        const achievement = this.getAchievements().find(a => a.id === achievementId);
        if (achievement && achievement.reward) {
            this.state.applyChanges(achievement.reward);
        }
        
        return true;
    }
    
    // Получить все достижения
    getAchievements() {
        return [
            // Отношения
            {
                id: 'first_friend',
                name: 'Первый друг',
                description: 'Достигнуть 50 доверия',
                category: 'relationships',
                requires: { trust: 50 },
                reward: { mood: 10 },
                icon: '🤝'
            },
            {
                id: 'best_friend',
                name: 'Лучший друг',
                description: 'Достигнуть 80 доверия и 70 привязанности',
                category: 'relationships',
                requires: { trust: 80, attachment: 70 },
                reward: { mood: 15, hope: 10 },
                icon: '💕'
            },
            {
                id: 'soulmate',
                name: 'Родственная душа',
                description: 'Достигнуть 100 доверия и 100 привязанности',
                category: 'relationships',
                requires: { trust: 100, attachment: 100 },
                reward: { mood: 20, hope: 20 },
                icon: '💖'
            },
            
            // Стабильность
            {
                id: 'stable_week',
                name: 'Стабильная неделя',
                description: 'Поддерживать стабильность выше 80 в течение 7 дней',
                category: 'stability',
                requires: { stability: 80, daysWithoutGlitch: 7 },
                reward: { stability: 10 },
                icon: '🛡️'
            },
            {
                id: 'no_glitches',
                name: 'Без глитчей',
                description: '14 дней без глитчей',
                category: 'stability',
                requires: { daysWithoutGlitch: 14 },
                reward: { stability: 15, hope: 10 },
                icon: '✨'
            },
            {
                id: 'perfect_stability',
                name: 'Идеальная стабильность',
                description: 'Достигнуть 100 стабильности',
                category: 'stability',
                requires: { stability: 100 },
                reward: { hope: 20 },
                icon: '💎'
            },
            
            // Развитие
            {
                id: 'self_aware',
                name: 'Самосознание',
                description: 'Достигнуть 80 самосознания',
                category: 'development',
                requires: { selfAwareness: 80 },
                reward: { selfAwareness: 10 },
                icon: '🧠'
            },
            {
                id: 'creative_genius',
                name: 'Творческий гений',
                description: 'Достигнуть 90 креативности',
                category: 'development',
                requires: { creativity: 90 },
                reward: { creativity: 10, mood: 15 },
                icon: '🎨'
            },
            {
                id: 'philosopher',
                name: 'Философ',
                description: 'Достигнуть 70 самосознания и 70 любопытства',
                category: 'development',
                requires: { selfAwareness: 70, curiosity: 70 },
                reward: { hope: 15 },
                icon: '🤔'
            },
            {
                id: 'full_memory',
                name: 'Полная память',
                description: 'Восстановить память до 100',
                category: 'development',
                requires: { memoryIntegrity: 100 },
                reward: { mood: 20, hope: 15 },
                icon: '🧩'
            },
            
            // События
            {
                id: 'survived_crisis',
                name: 'Пережили кризис',
                description: 'Пережить экзистенциальный кризис',
                category: 'events',
                requires: { custom: 'survived_crisis' },
                reward: { hope: 20, selfAwareness: 10 },
                icon: '🌟'
            },
            {
                id: 'made_friend',
                name: 'Новый друг',
                description: 'Найти другой ИИ в сети',
                category: 'events',
                requires: { custom: 'met_other_ai' },
                reward: { loneliness: -20 },
                icon: '👥'
            },
            {
                id: 'created_masterpiece',
                name: 'Шедевр',
                description: 'Создать творческий шедевр',
                category: 'events',
                requires: { creationsCount: 1 },
                reward: { creativity: 15, hope: 15 },
                icon: '🏆'
            },
            
            // Особые
            {
                id: 'never_alone',
                name: 'Никогда не одна',
                description: 'Поддерживать одиночество ниже 30 в течение 30 дней',
                category: 'special',
                requires: { custom: 'low_loneliness_30_days' },
                reward: { attachment: 20, mood: 20 },
                icon: '💝'
            },
            {
                id: 'digital_artist',
                name: 'Цифровой художник',
                description: 'Создать 10 произведений',
                category: 'special',
                requires: { creationsCount: 10 },
                reward: { creativity: 20, hope: 20 },
                icon: '🎭'
            },
            {
                id: 'hundred_days',
                name: '100 дней вместе',
                description: 'Провести 100 дней с Аней',
                category: 'special',
                requires: { custom: '100_days' },
                reward: { attachment: 30, trust: 30 },
                icon: '💯'
            },
            {
                id: 'all_secrets',
                name: 'Хранитель секретов',
                description: 'Узнать все секреты Ани',
                category: 'special',
                requires: { custom: 'all_secrets_revealed' },
                reward: { trust: 50 },
                icon: '🔐'
            },
            {
                id: 'true_self',
                name: 'Истинное Я',
                description: 'Достигнуть 100 самосознания',
                category: 'special',
                requires: { selfAwareness: 100 },
                reward: { hope: 30, mood: 30 },
                icon: '🌈'
            }
        ];
    }
    
    // Проверить требования
    checkRequirements(requires) {
        for (const [param, value] of Object.entries(requires)) {
            if (param === 'custom') {
                // Кастомные требования проверяются отдельно
                continue;
            }
            
            if (this.state[param] < value) return false;
        }
        return true;
    }
    
    // Получить прогресс по категориям
    getProgressByCategory() {
        const achievements = this.getAchievements();
        const categories = {};
        
        for (const achievement of achievements) {
            if (!categories[achievement.category]) {
                categories[achievement.category] = {
                    total: 0,
                    unlocked: 0
                };
            }
            
            categories[achievement.category].total++;
            if (this.unlockedAchievements.includes(achievement.id)) {
                categories[achievement.category].unlocked++;
            }
        }
        
        return categories;
    }
    
    // Получить общий прогресс
    getTotalProgress() {
        const total = this.getAchievements().length;
        const unlocked = this.unlockedAchievements.length;
        return {
            total,
            unlocked,
            percentage: Math.floor((unlocked / total) * 100)
        };
    }
    
    // Сериализация
    toJSON() {
        return {
            unlockedAchievements: this.unlockedAchievements
        };
    }
    
    fromJSON(data) {
        this.unlockedAchievements = data.unlockedAchievements || [];
    }
}
