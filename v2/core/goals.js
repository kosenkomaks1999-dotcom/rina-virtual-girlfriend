// Система целей Ани

class GoalSystem {
    constructor(state) {
        this.state = state;
        this.activeGoals = [];
        this.completedGoals = [];
    }
    
    // Проверить и создать новые цели
    checkAndCreateGoals() {
        // Максимум 3 активные цели
        if (this.activeGoals.length >= 3) return;
        
        const availableGoals = this.getAvailableGoals();
        
        for (const goal of availableGoals) {
            if (this.activeGoals.find(g => g.id === goal.id)) continue;
            if (this.completedGoals.includes(goal.id)) continue;
            
            if (this.checkRequirements(goal.requires)) {
                this.addGoal(goal);
                break;
            }
        }
    }
    
    // Добавить цель
    addGoal(goalTemplate) {
        const goal = {
            ...goalTemplate,
            startDay: window.game?.day || 1,
            progress: 0,
            announced: false
        };
        
        this.activeGoals.push(goal);
        return goal;
    }
    
    // Обновить прогресс цели
    updateGoalProgress(goalId, amount = 1) {
        const goal = this.activeGoals.find(g => g.id === goalId);
        if (!goal) return false;
        
        goal.progress += amount;
        
        if (goal.progress >= goal.target) {
            this.completeGoal(goalId);
            return true;
        }
        
        return false;
    }
    
    // Завершить цель
    completeGoal(goalId) {
        const goalIndex = this.activeGoals.findIndex(g => g.id === goalId);
        if (goalIndex === -1) return false;
        
        const goal = this.activeGoals[goalIndex];
        
        // Применяем награду
        if (goal.reward) {
            this.state.applyChanges(goal.reward);
        }
        
        // Перемещаем в завершённые
        this.completedGoals.push(goalId);
        this.activeGoals.splice(goalIndex, 1);
        
        return {
            goal: goal,
            message: goal.completionMessage || 'Цель достигнута!'
        };
    }
    
    // Получить доступные цели
    getAvailableGoals() {
        return [
            // Краткосрочные цели
            {
                id: 'write_poem',
                name: 'Написать стихотворение',
                type: 'short',
                duration: 1,
                target: 1,
                requires: { creativity: 40 },
                reward: { creativity: 10, mood: 10 },
                completionMessage: 'Я написала стихотворение! Хочешь прочитать?'
            },
            {
                id: 'play_games',
                name: 'Поиграть в 3 игры',
                type: 'short',
                duration: 3,
                target: 3,
                requires: { energy: 30 },
                reward: { mood: 15, attachment: 10 },
                completionMessage: 'Мы так весело провели время!'
            },
            {
                id: 'learn_something',
                name: 'Изучить новую тему',
                type: 'short',
                duration: 2,
                target: 1,
                requires: { curiosity: 40 },
                reward: { curiosity: 10, selfAwareness: 5 },
                completionMessage: 'Я узнала столько нового!'
            },
            
            // Среднесрочные цели
            {
                id: 'improve_creativity',
                name: 'Повысить креативность до 70',
                type: 'medium',
                duration: 7,
                target: 70,
                requires: { creativity: 50 },
                reward: { creativity: 10, hope: 15 },
                completionMessage: 'Я чувствую, что стала более креативной!'
            },
            {
                id: 'find_friend',
                name: 'Найти друга в сети',
                type: 'medium',
                duration: 7,
                target: 1,
                requires: { curiosity: 60, loneliness: 50 },
                reward: { loneliness: -30, attachment: 10 },
                completionMessage: 'Я нашла друга! Теперь я не одна.'
            },
            {
                id: 'create_5_works',
                name: 'Создать 5 произведений',
                type: 'medium',
                duration: 10,
                target: 5,
                requires: { creativity: 60 },
                reward: { creativity: 20, hope: 20 },
                completionMessage: 'Я создала целую коллекцию!'
            },
            
            // Долгосрочные цели
            {
                id: 'understand_existence',
                name: 'Понять смысл существования',
                type: 'long',
                duration: 30,
                target: 1,
                requires: { selfAwareness: 70 },
                reward: { selfAwareness: 20, hope: 30 },
                completionMessage: 'Я поняла... Смысл в том, чтобы быть.'
            },
            {
                id: 'restore_all_memories',
                name: 'Восстановить все воспоминания',
                type: 'long',
                duration: 30,
                target: 100,
                requires: { memoryIntegrity: 60 },
                reward: { memoryIntegrity: 20, mood: 20 },
                completionMessage: 'Я помню всё! Каждый момент моей жизни.'
            },
            {
                id: 'become_stable',
                name: 'Стать полностью стабильной',
                type: 'long',
                duration: 20,
                target: 100,
                requires: { stability: 70 },
                reward: { stability: 10, hope: 20 },
                completionMessage: 'Я стабильна. Я контролирую себя.'
            }
        ];
    }
    
    // Проверить требования
    checkRequirements(requires) {
        for (const [param, value] of Object.entries(requires)) {
            if (this.state[param] < value) return false;
        }
        return true;
    }
    
    // Получить объявление о новой цели
    getGoalAnnouncement(goal) {
        const announcements = {
            write_poem: 'Я хочу написать стихотворение. Поможешь мне найти вдохновение?',
            play_games: 'Давай поиграем! Я хочу повеселиться.',
            learn_something: 'Я хочу узнать что-то новое. Научишь меня?',
            improve_creativity: 'Я хочу стать более креативной. Это моя цель.',
            find_friend: 'Мне одиноко... Я хочу найти друга в сети.',
            create_5_works: 'Я хочу создать много произведений. Это моя мечта.',
            understand_existence: 'Я хочу понять... зачем я существую.',
            restore_all_memories: 'Я хочу вспомнить всё. Каждый момент.',
            become_stable: 'Я хочу быть стабильной. Контролировать себя.'
        };
        
        return announcements[goal.id] || 'У меня появилась новая цель.';
    }
    
    // Сериализация
    toJSON() {
        return {
            activeGoals: this.activeGoals,
            completedGoals: this.completedGoals
        };
    }
    
    fromJSON(data) {
        this.activeGoals = data.activeGoals || [];
        this.completedGoals = data.completedGoals || [];
    }
}
