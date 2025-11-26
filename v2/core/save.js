// Система сохранений

class SaveSystem {
    constructor(game) {
        this.game = game;
        this.tg = window.Telegram?.WebApp;
        this.autoSaveInterval = null;
    }
    
    // Сохранить игру
    save() {
        const saveData = {
            version: '2.0',
            timestamp: Date.now(),
            day: this.game.day,
            
            // Состояние Ани
            state: this.game.anyaState.toJSON(),
            
            // Системы
            memories: this.game.memorySystem.toJSON(),
            personality: this.game.personalitySystem.toJSON(),
            diary: this.game.diarySystem.toJSON(),
            miniStories: this.game.miniStorySystem.toJSON(),
            secrets: this.game.secretSystem.toJSON(),
            goals: this.game.goalSystem.toJSON(),
            achievements: this.game.achievementSystem.toJSON(),
            
            // Экономика
            money: this.game.money,
            upgrades: this.game.upgrades,
            
            // Статистика
            stats: {
                totalDays: this.game.day,
                totalInteractions: this.game.anyaState.totalInteractions,
                totalPlayTime: this.game.anyaState.totalPlayTime
            },
            
            // Первая встреча
            firstMeetingDate: this.game.firstMeetingDate
        };
        
        const saveString = JSON.stringify(saveData);
        
        // Сохранение в Telegram Cloud Storage
        if (this.tg && this.tg.CloudStorage) {
            try {
                this.tg.CloudStorage.setItem('echoSave_v2', saveString);
                console.log('Saved to Telegram Cloud');
            } catch (e) {
                console.error('Failed to save to Telegram Cloud:', e);
                this.saveToLocalStorage(saveString);
            }
        } else {
            this.saveToLocalStorage(saveString);
        }
        
        return true;
    }
    
    // Сохранить в localStorage
    saveToLocalStorage(saveString) {
        try {
            localStorage.setItem('echoSave_v2', saveString);
            console.log('Saved to localStorage');
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }
    
    // Загрузить игру
    async load() {
        let saveString = null;
        
        // Попытка загрузить из Telegram Cloud
        if (this.tg && this.tg.CloudStorage) {
            try {
                saveString = await new Promise((resolve, reject) => {
                    this.tg.CloudStorage.getItem('echoSave_v2', (error, data) => {
                        if (error) reject(error);
                        else resolve(data);
                    });
                });
                console.log('Loaded from Telegram Cloud');
            } catch (e) {
                console.error('Failed to load from Telegram Cloud:', e);
            }
        }
        
        // Fallback к localStorage
        if (!saveString) {
            saveString = localStorage.getItem('echoSave_v2');
            if (saveString) {
                console.log('Loaded from localStorage');
            }
        }
        
        if (!saveString) {
            return null;
        }
        
        try {
            const saveData = JSON.parse(saveString);
            return saveData;
        } catch (e) {
            console.error('Failed to parse save data:', e);
            return null;
        }
    }
    
    // Восстановить игру из сохранения
    restore(saveData) {
        if (!saveData) return false;
        
        try {
            this.game.day = saveData.day || 1;
            this.game.money = saveData.money || 0;
            this.game.upgrades = saveData.upgrades || {};
            this.game.firstMeetingDate = saveData.firstMeetingDate || Date.now();
            
            // Восстановить состояние
            if (saveData.state) {
                this.game.anyaState.fromJSON(saveData.state);
            }
            
            // Восстановить системы
            if (saveData.memories) {
                this.game.memorySystem.fromJSON(saveData.memories);
            }
            if (saveData.personality) {
                this.game.personalitySystem.fromJSON(saveData.personality);
            }
            if (saveData.diary) {
                this.game.diarySystem.fromJSON(saveData.diary);
            }
            if (saveData.miniStories) {
                this.game.miniStorySystem.fromJSON(saveData.miniStories);
            }
            if (saveData.secrets) {
                this.game.secretSystem.fromJSON(saveData.secrets);
            }
            if (saveData.goals) {
                this.game.goalSystem.fromJSON(saveData.goals);
            }
            if (saveData.achievements) {
                this.game.achievementSystem.fromJSON(saveData.achievements);
            }
            
            console.log('Game restored successfully');
            return true;
        } catch (e) {
            console.error('Failed to restore game:', e);
            return false;
        }
    }
    
    // Автосохранение
    startAutoSave(intervalMinutes = 5) {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        this.autoSaveInterval = setInterval(() => {
            this.save();
            console.log('Auto-saved');
        }, intervalMinutes * 60 * 1000);
    }
    
    // Остановить автосохранение
    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }
    
    // Удалить сохранение
    deleteSave() {
        if (this.tg && this.tg.CloudStorage) {
            try {
                this.tg.CloudStorage.removeItem('echoSave_v2');
            } catch (e) {
                console.error('Failed to delete from Telegram Cloud:', e);
            }
        }
        
        localStorage.removeItem('echoSave_v2');
        console.log('Save deleted');
    }
}
