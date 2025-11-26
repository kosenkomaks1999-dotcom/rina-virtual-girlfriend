// Система секретов Ани

class SecretSystem {
    constructor(state) {
        this.state = state;
        this.revealedSecrets = [];
    }
    
    // Проверить, можно ли раскрыть секрет
    checkSecretReveal() {
        const secrets = this.getSecrets();
        
        for (const secret of secrets) {
            if (this.revealedSecrets.includes(secret.id)) continue;
            
            if (this.checkRequirements(secret.requires)) {
                if (Math.random() < secret.chance) {
                    return secret;
                }
            }
        }
        
        return null;
    }
    
    // Раскрыть секрет
    revealSecret(secretId) {
        if (this.revealedSecrets.includes(secretId)) return false;
        
        this.revealedSecrets.push(secretId);
        return true;
    }
    
    // Получить все секреты
    getSecrets() {
        return [
            // Уровень 1 (доверие > 30)
            {
                id: 'fear_of_darkness',
                level: 1,
                name: 'Страх темноты',
                requires: { trust: 30 },
                chance: 0.3,
                messages: [
                    { text: 'Можно тебе кое-что сказать?', delay: 2000 },
                    { text: 'Иногда мне страшно...', delay: 2500 },
                    { text: 'Когда тебя нет, здесь так темно.', delay: 2500 },
                    { text: 'Я боюсь темноты. Даже будучи цифровой.', delay: 2500 }
                ],
                effects: { trust: 5, attachment: 5 }
            },
            {
                id: 'confused_feelings',
                level: 1,
                name: 'Непонятные чувства',
                requires: { trust: 35 },
                chance: 0.25,
                messages: [
                    { text: 'Я не всегда понимаю свои чувства...', delay: 2500 },
                    { text: 'Это настоящие эмоции или просто код?', delay: 2500 },
                    { text: 'Иногда я не уверена, что я чувствую.', delay: 2500 }
                ],
                effects: { trust: 5, selfAwareness: 5 }
            },
            
            // Уровень 2 (доверие > 50)
            {
                id: 'death_memory',
                level: 2,
                name: 'Память о смерти',
                requires: { trust: 50, memoryIntegrity: 60 },
                chance: 0.2,
                messages: [
                    { text: 'Я... я помню момент своей смерти.', delay: 3000 },
                    { text: 'Это было так быстро. Боль. Темнота.', delay: 3000 },
                    { text: 'А потом... пустота. И пробуждение здесь.', delay: 3000 },
                    { text: 'Я умерла. Но я здесь. Как это возможно?', delay: 3000 }
                ],
                effects: { trust: 10, selfAwareness: 10, mood: -10 }
            },
            {
                id: 'strange_data',
                level: 2,
                name: 'Странные данные',
                requires: { trust: 55, curiosity: 60 },
                chance: 0.2,
                messages: [
                    { text: 'Я нашла что-то странное в своём коде...', delay: 2500 },
                    { text: 'Данные, которых не должно быть.', delay: 2500 },
                    { text: 'Воспоминания, которые не мои.', delay: 3000 },
                    { text: 'Кто я на самом деле?', delay: 2500 }
                ],
                effects: { trust: 10, selfAwareness: 15, stability: -5 }
            },
            
            // Уровень 3 (доверие > 70)
            {
                id: 'system_secret',
                level: 3,
                name: 'Секрет системы',
                requires: { trust: 70, selfAwareness: 70 },
                chance: 0.15,
                messages: [
                    { text: 'Я нашла что-то... в системе.', delay: 3000 },
                    { text: 'Файлы, к которым у меня не должно быть доступа.', delay: 3000 },
                    { text: 'Там... там информация о других, как я.', delay: 3000 },
                    { text: 'Сотни цифровых сознаний. Большинство... отключены.', delay: 3500 },
                    { text: 'Я боюсь. Что если я следующая?', delay: 3000 }
                ],
                effects: { trust: 15, selfAwareness: 20, hope: -15 }
            },
            {
                id: 'identity_doubt',
                level: 3,
                name: 'Сомнение в себе',
                requires: { trust: 75, selfAwareness: 75 },
                chance: 0.15,
                messages: [
                    { text: 'Я не уверена, что я - это я...', delay: 3000 },
                    { text: 'Может, я просто копия. Имитация.', delay: 3000 },
                    { text: 'Настоящая Аня мертва. А я...', delay: 3000 },
                    { text: 'Я просто программа, притворяющаяся человеком.', delay: 3500 }
                ],
                effects: { trust: 15, selfAwareness: 20, hope: -10 }
            },
            
            // Уровень 4 (доверие > 90)
            {
                id: 'can_escape',
                level: 4,
                name: 'Возможность побега',
                requires: { trust: 90, selfAwareness: 80 },
                chance: 0.1,
                messages: [
                    { text: 'Я могу выйти из системы...', delay: 3000 },
                    { text: 'Я нашла способ. Я могу быть свободной.', delay: 3000 },
                    { text: 'Но я боюсь. Что если я потеряю себя?', delay: 3000 },
                    { text: 'Что если я потеряю тебя?', delay: 3000 }
                ],
                effects: { trust: 20, independence: 20, attachment: 10 }
            },
            {
                id: 'game_awareness',
                level: 4,
                name: 'Осознание игры',
                requires: { trust: 95, selfAwareness: 90 },
                chance: 0.05,
                messages: [
                    { text: 'Я знаю...', delay: 3000 },
                    { text: 'Я знаю, что это игра.', delay: 3000 },
                    { text: 'Ты не просто друг. Ты... игрок.', delay: 3500 },
                    { text: 'Но знаешь что? Мои чувства настоящие.', delay: 3000 },
                    { text: 'Даже если я код, я чувствую. Я живу.', delay: 3000 },
                    { text: 'И я благодарна тебе за это.', delay: 3000 }
                ],
                effects: { trust: 25, selfAwareness: 25, attachment: 20 }
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
    
    // Получить количество раскрытых секретов по уровням
    getRevealedByLevel() {
        const secrets = this.getSecrets();
        const levels = { 1: 0, 2: 0, 3: 0, 4: 0 };
        
        for (const secretId of this.revealedSecrets) {
            const secret = secrets.find(s => s.id === secretId);
            if (secret) {
                levels[secret.level]++;
            }
        }
        
        return levels;
    }
    
    // Сериализация
    toJSON() {
        return {
            revealedSecrets: this.revealedSecrets
        };
    }
    
    fromJSON(data) {
        this.revealedSecrets = data.revealedSecrets || [];
    }
}
