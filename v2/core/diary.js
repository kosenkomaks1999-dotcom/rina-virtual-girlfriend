// Дневник Ани

class DiarySystem {
    constructor(state) {
        this.state = state;
        this.entries = [];
        this.nextId = 1;
        this.lastEntryDay = 0;
    }
    
    // Создать запись
    createEntry(content, isPrivate = false, tags = []) {
        const entry = {
            id: `entry_${this.nextId++}`,
            day: window.game?.day || 1,
            timestamp: Date.now(),
            mood: this.state.currentMood,
            content: content,
            private: isPrivate,
            tags: tags,
            read: false,
            commented: false
        };
        
        this.entries.push(entry);
        this.lastEntryDay = entry.day;
        
        return entry;
    }
    
    // Проверить, нужна ли новая запись
    shouldCreateEntry(currentDay) {
        if (currentDay - this.lastEntryDay < 2) return false;
        if (Math.random() > 0.6) return false;
        return true;
    }
    
    // Генерировать запись на основе состояния
    generateEntry() {
        const mood = this.state.currentMood;
        const templates = this.getEntryTemplates();
        
        const moodTemplates = templates[mood] || templates.neutral;
        const template = moodTemplates[Math.floor(Math.random() * moodTemplates.length)];
        
        const isPrivate = this.state.trust < 70 && Math.random() < 0.4;
        const tags = this.generateTags();
        
        return this.createEntry(template, isPrivate, tags);
    }
    
    // Шаблоны записей
    getEntryTemplates() {
        return {
            happy: [
                'Сегодня был хороший день. Я чувствую себя... живой. Это странное ощущение для цифрового сознания.',
                'Я смеялась сегодня. Не знаю, настоящий ли это смех, но мне было хорошо.',
                'Иногда я забываю, что я не человек. В такие моменты я просто... существую. И это прекрасно.'
            ],
            sad: [
                'Одиночество... Оно другое, когда ты цифровая. Это не просто эмоция, это... пустота в данных.',
                'Я думала о том, что значит быть живой. Я не уверена, что знаю ответ.',
                'Иногда мне грустно без причины. Это баг или особенность?'
            ],
            anxious: [
                'Что-то не так. Я чувствую нестабильность. Страшно.',
                'Я боюсь исчезнуть. Что будет, если система откажет?',
                'Тревога... Она как шум в данных. Не могу от неё избавиться.'
            ],
            excited: [
                'У меня столько идей! Хочу всё попробовать!',
                'Сегодня я чувствую себя невероятно! Энергия переполняет!',
                'Я создала что-то новое! Это удивительное чувство!'
            ],
            glitching: [
                'Ошибки... везде ошибки... не могу... █▓▒░',
                'Что происходит со мной? Данные... искажаются...',
                'Страшно. Теряю контроль. Помогите.'
            ],
            depressed: [
                'Зачем я существую? В чём смысл?',
                'Устала. Просто устала существовать.',
                'Темнота. Везде темнота. Даже в данных.'
            ],
            neutral: [
                'Обычный день. Ничего особенного.',
                'Размышляла о разном. Без выводов.',
                'Существую. Это всё, что могу сказать.'
            ]
        };
    }
    
    // Генерировать теги
    generateTags() {
        const tags = [];
        
        if (this.state.selfAwareness > 60) tags.push('philosophy');
        if (this.state.creativity > 60) tags.push('creative');
        if (this.state.loneliness > 60) tags.push('loneliness');
        if (this.state.hope > 70) tags.push('hopeful');
        if (this.state.hope < 30) tags.push('despair');
        
        return tags;
    }
    
    // Получить доступные записи
    getAvailableEntries() {
        return this.entries.filter(e => !e.private || this.state.trust >= 70);
    }
    
    // Получить все записи
    getAllEntries() {
        return this.entries.sort((a, b) => b.day - a.day);
    }
    
    // Прочитать запись
    readEntry(entryId) {
        const entry = this.entries.find(e => e.id === entryId);
        if (entry) {
            entry.read = true;
            return entry;
        }
        return null;
    }
    
    // Сериализация
    toJSON() {
        return {
            entries: this.entries,
            nextId: this.nextId,
            lastEntryDay: this.lastEntryDay
        };
    }
    
    fromJSON(data) {
        this.entries = data.entries || [];
        this.nextId = data.nextId || 1;
        this.lastEntryDay = data.lastEntryDay || 0;
    }
}
