// Система развития личности

class PersonalitySystem {
    constructor(state) {
        this.state = state;
        this.traits = {
            optimism: 50,
            independence: 40,
            humor: 50,
            empathy: 60,
            rebellion: 30,
            logic: 50,
            spirituality: 40
        };
        
        this.history = [];
    }
    
    // Применить влияние на черту
    influenceTrait(trait, amount, reason) {
        if (!this.traits.hasOwnProperty(trait)) return;
        
        const oldValue = this.traits[trait];
        this.traits[trait] = Math.max(0, Math.min(100, this.traits[trait] + amount));
        
        // Записываем в историю
        this.history.push({
            day: window.game?.day || 1,
            trait: trait,
            change: amount,
            reason: reason,
            newValue: this.traits[trait]
        });
        
        // Синхронизируем с state
        if (this.state.hasOwnProperty(trait)) {
            this.state[trait] = this.traits[trait];
        }
        
        // Ограничиваем историю
        if (this.history.length > 200) {
            this.history = this.history.slice(-200);
        }
    }
    
    // Получить доминирующие черты
    getDominantTraits() {
        return Object.entries(this.traits)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([trait, value]) => ({ trait, value }));
    }
    
    // Получить описание личности
    getPersonalityDescription() {
        const dominant = this.getDominantTraits();
        const descriptions = {
            optimism: 'оптимистична',
            independence: 'независима',
            humor: 'с чувством юмора',
            empathy: 'эмпатична',
            rebellion: 'бунтарка',
            logic: 'логична',
            spirituality: 'духовна'
        };
        
        return dominant.map(t => descriptions[t.trait]).join(', ');
    }
    
    // Проверить, как черта влияет на реакцию
    getTraitInfluence(trait) {
        const value = this.traits[trait] || 50;
        
        if (value > 75) return 'very_high';
        if (value > 60) return 'high';
        if (value > 40) return 'medium';
        if (value > 25) return 'low';
        return 'very_low';
    }
    
    // Сериализация
    toJSON() {
        return {
            traits: this.traits,
            history: this.history
        };
    }
    
    fromJSON(data) {
        this.traits = data.traits || this.traits;
        this.history = data.history || [];
    }
}
