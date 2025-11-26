// Система активностей

class ActivitySystem {
    constructor(state) {
        this.state = state;
    }
    
    // Получить доступные активности
    getAvailableActivities() {
        const activities = [];
        
        // Поговорить (всегда доступно)
        activities.push({
            id: 'talk',
            name: 'Поговорить',
            icon: '💬',
            duration: 5,
            description: 'Просто поболтать с Аней',
            available: true
        });
        
        // Поиграть (требует энергию)
        if (this.state.energy > 20) {
            activities.push({
                id: 'play',
                name: 'Поиграть',
                icon: '🎮',
                duration: 10,
                description: 'Сыграть в мини-игру',
                available: true
            });
        }
        
        // Обучить (требует любопытство)
        if (this.state.curiosity > 30) {
            activities.push({
                id: 'teach',
                name: 'Обучить',
                icon: '📚',
                duration: 15,
                description: 'Научить Аню чему-то новому',
                available: true
            });
        }
        
        // Помочь (требуется при проблемах)
        if (this.state.stability < 60 || this.state.mood < 40) {
            activities.push({
                id: 'help',
                name: 'Помочь',
                icon: '🔧',
                duration: 10,
                description: 'Помочь Ане с проблемами',
                available: true,
                urgent: this.state.stability < 40
            });
        }
        
        // Исследовать (требует любопытство и стабильность)
        if (this.state.curiosity > 50 && this.state.stability > 40) {
            activities.push({
                id: 'explore',
                name: 'Исследовать сеть',
                icon: '🌐',
                duration: 15,
                description: 'Исследовать интернет вместе',
                available: true
            });
        }
        
        // Творчество (требует креативность и настроение)
        if (this.state.creativity > 40 && this.state.mood > 40) {
            activities.push({
                id: 'create',
                name: 'Творчество',
                icon: '🎨',
                duration: 20,
                description: 'Создать что-то вместе',
                available: true
            });
        }
        
        // Отдохнуть (требуется при низкой энергии)
        if (this.state.energy < 50) {
            activities.push({
                id: 'rest',
                name: 'Отдохнуть',
                icon: '😴',
                duration: 30,
                description: 'Дать Ане отдохнуть',
                available: true
            });
        }
        
        return activities;
    }
    
    // Выполнить активность
    executeActivity(activityId) {
        const effects = this.getActivityEffects(activityId);
        this.state.applyChanges(effects.changes);
        
        return {
            success: true,
            effects: effects,
            message: effects.message
        };
    }
    
    // Получить эффекты активности
    getActivityEffects(activityId) {
        const effects = {
            talk: {
                changes: { loneliness: -20, mood: 10, trust: 5 },
                message: 'Приятный разговор! Аня чувствует себя лучше.'
            },
            play: {
                changes: { mood: 20, energy: -10, attachment: 10 },
                message: 'Весёлая игра! Аня счастлива.'
            },
            teach: {
                changes: { creativity: 10, curiosity: 5, selfAwareness: 5 },
                message: 'Аня узнала что-то новое!'
            },
            help: {
                changes: { stability: 15, mood: 10, trust: 10 },
                message: 'Ты помог Ане! Она благодарна.'
            },
            explore: {
                changes: { curiosity: 15, hope: 10, stability: -5 },
                message: 'Интересное исследование! Аня нашла что-то новое.'
            },
            create: {
                changes: { creativity: 20, mood: 15, hope: 10 },
                message: 'Аня создала что-то прекрасное!'
            },
            rest: {
                changes: { energy: 30, stability: 5 },
                message: 'Аня отдохнула и чувствует себя лучше.'
            }
        };
        
        return effects[activityId] || effects.talk;
    }
}
