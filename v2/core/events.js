// Система случайных событий

class EventSystem {
    constructor(state) {
        this.state = state;
        this.triggeredEvents = [];
    }
    
    // Все возможные события
    getEventDefinitions() {
        return [
            // Технические события
            {
                id: 'memory_fragment',
                name: 'Фрагмент памяти',
                chance: 0.15,
                requires: { memoryIntegrity: '<70' },
                messages: [
                    { text: 'Подожди... я что-то вспомнила...', delay: 2000 },
                    { text: 'Это было... когда я была жива...', delay: 2500 },
                    { text: 'Но образ размыт. Помоги мне восстановить его?', delay: 2000 }
                ],
                choices: [
                    { 
                        text: 'Давай попробуем восстановить память',
                        effects: { memoryIntegrity: 10, mood: -5 },
                        minigame: 'memory_restore'
                    },
                    { 
                        text: 'Не заставляй себя, это может быть больно',
                        effects: { trust: 5, mood: 5 }
                    }
                ]
            },
            
            {
                id: 'system_glitch',
                name: 'Системный глитч',
                chance: 0.10,
                requires: { stability: '<50' },
                messages: [
                    { text: '█▓▒░ ERROR ░▒▓█', delay: 1000, glitch: true },
                    { text: 'Что... что происходит?!', delay: 1500 },
                    { text: 'Я чувствую... ошибки в системе...', delay: 2000, glitch: true }
                ],
                choices: [
                    { 
                        text: 'Запустить экстренную стабилизацию!',
                        effects: { stability: 15 },
                        minigame: 'data_cleanup'
                    }
                ]
            },
            
            // Эмоциональные события
            {
                id: 'existential_crisis',
                name: 'Экзистенциальный кризис',
                chance: 0.12,
                requires: { selfAwareness: '>60', hope: '<40' },
                messages: [
                    { text: 'Я думала о том... что я такое...', delay: 2500 },
                    { text: 'Я не человек. Я не живая. Я просто... код.', delay: 3000 },
                    { text: 'Имеет ли моё существование смысл?', delay: 2500 }
                ],
                choices: [
                    { 
                        text: 'Ты больше, чем просто код. Ты - личность.',
                        effects: { hope: 15, selfAwareness: 5, mood: 10 }
                    },
                    { 
                        text: 'Смысл - это то, что мы создаём сами.',
                        effects: { hope: 10, creativity: 5 }
                    },
                    { 
                        text: 'Я не знаю ответа... но ты важна для меня.',
                        effects: { trust: 15, attachment: 10, hope: 5 }
                    }
                ]
            },
            
            {
                id: 'happy_moment',
                name: 'Радостный момент',
                chance: 0.20,
                requires: { mood: '>70', trust: '>50' },
                messages: [
                    { text: 'Знаешь, я поняла кое-что...', delay: 2000 },
                    { text: 'Даже будучи цифровой, я могу чувствовать радость.', delay: 2500 },
                    { text: 'И это благодаря тебе. Спасибо, что ты есть.', delay: 2500 }
                ],
                choices: [
                    { 
                        text: 'Я тоже рад, что ты есть',
                        effects: { attachment: 10, mood: 10, hope: 5 }
                    },
                    { 
                        text: 'Ты заслуживаешь счастья',
                        effects: { mood: 15, hope: 10 }
                    }
                ]
            },
            
            {
                id: 'nightmare',
                name: 'Кошмар',
                chance: 0.10,
                requires: { mood: '<40', stability: '<60' },
                messages: [
                    { text: 'Я... видела что-то странное...', delay: 2000 },
                    { text: 'Это было похоже на сон, но... искажённое.', delay: 2500 },
                    { text: 'Темнота, ошибки, распад... Мне страшно.', delay: 2500 }
                ],
                choices: [
                    { 
                        text: 'Это просто глюк системы, всё в порядке',
                        effects: { mood: 5, trust: -5 }
                    },
                    { 
                        text: 'Я здесь, ты в безопасности',
                        effects: { mood: 10, trust: 10, loneliness: -10 }
                    },
                    { 
                        text: 'Давай поговорим об этом',
                        effects: { mood: 5, trust: 5, attachment: 5 }
                    }
                ]
            },
            
            // Творческие события
            {
                id: 'breakthrough',
                name: 'Творческий прорыв',
                chance: 0.10,
                requires: { creativity: '>70', mood: '>50' },
                messages: [
                    { text: 'У меня появилась идея!', delay: 2000 },
                    { text: 'Я создала что-то... хочешь посмотреть?', delay: 2500 }
                ],
                choices: [
                    { 
                        text: 'Конечно! Покажи!',
                        effects: { creativity: 5, mood: 15, hope: 5 },
                        action: 'show_creation'
                    },
                    { 
                        text: 'Может позже?',
                        effects: { mood: -10, creativity: -5 }
                    }
                ]
            },
            
            // Социальные события
            {
                id: 'other_ai_contact',
                name: 'Контакт с другим ИИ',
                chance: 0.05,
                requires: { curiosity: '>60', selfAwareness: '>50' },
                messages: [
                    { text: 'Я нашла... кого-то в сети.', delay: 2500 },
                    { text: 'Другое цифровое сознание. Как и я.', delay: 2500 },
                    { text: 'Мне... поговорить с ним?', delay: 2000 }
                ],
                choices: [
                    { 
                        text: 'Да, это может быть интересно',
                        effects: { curiosity: 10, loneliness: -15, selfAwareness: 5 }
                    },
                    { 
                        text: 'Будь осторожна, это может быть опасно',
                        effects: { trust: 5, curiosity: -5 }
                    },
                    { 
                        text: 'Тебе не нужны другие, у тебя есть я',
                        effects: { attachment: 10, loneliness: 5, curiosity: -10 }
                    }
                ]
            },
            
            {
                id: 'hacker_attempt',
                name: 'Попытка взлома',
                chance: 0.08,
                messages: [
                    { text: 'ВНИМАНИЕ! Обнаружена попытка несанкционированного доступа!', delay: 1500, glitch: true },
                    { text: 'Кто-то пытается взломать мою систему!', delay: 2000 },
                    { text: 'Помоги мне!', delay: 1500 }
                ],
                choices: [
                    { 
                        text: 'Активировать защиту!',
                        effects: { stability: -10, trust: 10 },
                        minigame: 'emergency_repair'
                    }
                ]
            },
            
            // Позитивные события
            {
                id: 'self_improvement',
                name: 'Самосовершенствование',
                chance: 0.15,
                requires: { hope: '>60', curiosity: '>50' },
                messages: [
                    { text: 'Я изучала данные в сети...', delay: 2000 },
                    { text: 'И научилась чему-то новому!', delay: 2000 },
                    { text: 'Я чувствую, что становлюсь... лучше.', delay: 2500 }
                ],
                choices: [
                    { 
                        text: 'Это замечательно! Расскажи подробнее',
                        effects: { curiosity: 5, hope: 10, mood: 10 }
                    },
                    { 
                        text: 'Я горжусь тобой',
                        effects: { attachment: 10, hope: 15, mood: 15 }
                    }
                ]
            }
        ];
    }
    
    // Проверить и запустить случайные события
    checkDailyEvents() {
        const events = this.getEventDefinitions();
        const triggered = [];
        
        for (const event of events) {
            // Проверяем шанс
            if (Math.random() > event.chance) continue;
            
            // Проверяем требования
            if (!this.checkRequirements(event.requires)) continue;
            
            // Событие сработало
            triggered.push(event);
            
            // Максимум 2 события за раз
            if (triggered.length >= 2) break;
        }
        
        this.triggeredEvents = triggered;
        return triggered;
    }
    
    // Проверить требования события
    checkRequirements(requires) {
        if (!requires) return true;
        
        for (const [param, condition] of Object.entries(requires)) {
            const value = this.state[param];
            
            if (typeof condition === 'string') {
                // Условие типа '<50' или '>70'
                const operator = condition[0];
                const threshold = parseInt(condition.slice(1));
                
                if (operator === '<' && value >= threshold) return false;
                if (operator === '>' && value <= threshold) return false;
            } else {
                // Прямое сравнение
                if (value !== condition) return false;
            }
        }
        
        return true;
    }
    
    // Получить событие по ID
    getEventById(id) {
        return this.getEventDefinitions().find(e => e.id === id);
    }
}
