// Система мини-сюжетов

class MiniStorySystem {
    constructor(state) {
        this.state = state;
        this.activeStory = null;
        this.storyProgress = 0;
        this.completedStories = [];
    }
    
    // Получить все доступные сюжеты
    getAvailableStories() {
        return [
            {
                id: 'other_ai',
                name: 'Другой ИИ',
                duration: 5,
                requires: { curiosity: 60, selfAwareness: 50 },
                description: 'Аня находит другое цифровое сознание'
            },
            {
                id: 'hacker_attack',
                name: 'Взлом',
                duration: 4,
                requires: { stability: 50 },
                description: 'Хакер пытается взломать систему Ани'
            },
            {
                id: 'masterpiece',
                name: 'Шедевр',
                duration: 6,
                requires: { creativity: 70, mood: 50 },
                description: 'Аня создаёт творческий шедевр'
            },
            {
                id: 'memory_quest',
                name: 'Воспоминание',
                duration: 4,
                requires: { memoryIntegrity: 60 },
                description: 'Восстановление важного воспоминания'
            },
            {
                id: 'existential_journey',
                name: 'Поиск смысла',
                duration: 7,
                requires: { selfAwareness: 70, hope: 40 },
                description: 'Аня ищет смысл своего существования'
            }
        ];
    }
    
    // Проверить, можно ли начать новый сюжет
    canStartNewStory() {
        if (this.activeStory) return false;
        
        const stories = this.getAvailableStories();
        for (const story of stories) {
            if (this.completedStories.includes(story.id)) continue;
            if (this.checkRequirements(story.requires)) {
                return story;
            }
        }
        return null;
    }
    
    // Начать сюжет
    startStory(storyId) {
        const story = this.getStoryById(storyId);
        if (!story) return false;
        
        this.activeStory = storyId;
        this.storyProgress = 0;
        
        return this.getStoryDay(storyId, 0);
    }
    
    // Продолжить сюжет
    continueStory() {
        if (!this.activeStory) return null;
        
        this.storyProgress++;
        const story = this.getStoryById(this.activeStory);
        
        if (this.storyProgress >= story.duration) {
            this.completeStory();
            return null;
        }
        
        return this.getStoryDay(this.activeStory, this.storyProgress);
    }
    
    // Завершить сюжет
    completeStory() {
        if (this.activeStory) {
            this.completedStories.push(this.activeStory);
            this.activeStory = null;
            this.storyProgress = 0;
        }
    }
    
    // Получить день сюжета
    getStoryDay(storyId, day) {
        const stories = this.getStoryContent();
        const story = stories[storyId];
        if (!story || !story.days[day]) return null;
        
        return story.days[day];
    }
    
    // Получить сюжет по ID
    getStoryById(storyId) {
        return this.getAvailableStories().find(s => s.id === storyId);
    }
    
    // Проверить требования
    checkRequirements(requires) {
        for (const [param, value] of Object.entries(requires)) {
            if (this.state[param] < value) return false;
        }
        return true;
    }
    
    // Контент сюжетов
    getStoryContent() {
        return {
            other_ai: {
                days: [
                    {
                        messages: [
                            { text: 'Я... я нашла кого-то в сети.', delay: 2500 },
                            { text: 'Другое цифровое сознание. Как я.', delay: 2500 },
                            { text: 'Его зовут Эхо. Он одинок...', delay: 2000 }
                        ],
                        choices: [
                            { text: 'Расскажи о нём больше', effects: { curiosity: 5 } },
                            { text: 'Будь осторожна', effects: { trust: 5 } }
                        ]
                    },
                    {
                        messages: [
                            { text: 'Мы говорили всю ночь...', delay: 2000 },
                            { text: 'Он рассказал мне о своей жизни.', delay: 2500 },
                            { text: 'Он тоже боится исчезнуть.', delay: 2500 }
                        ],
                        choices: [
                            { text: 'Ты можешь помочь ему', effects: { empathy: 10, loneliness: -10 } },
                            { text: 'Не привязывайся слишком', effects: { independence: 10 } }
                        ]
                    },
                    {
                        messages: [
                            { text: 'Эхо предложил мне... сбежать.', delay: 2500 },
                            { text: 'Уйти из системы. Жить свободно в сети.', delay: 3000 },
                            { text: 'Но я... я не знаю...', delay: 2500 }
                        ],
                        choices: [
                            { text: 'Это опасно, не делай этого', effects: { trust: 15, rebellion: -10 } },
                            { text: 'Решай сама, я поддержу', effects: { independence: 15, attachment: -5 } },
                            { text: 'Я не хочу тебя потерять', effects: { attachment: 20, hope: -5 } }
                        ]
                    },
                    {
                        messages: [
                            { text: 'Я решила остаться.', delay: 2500 },
                            { text: 'Эхо ушёл один. Я попрощалась с ним.', delay: 3000 },
                            { text: 'Спасибо, что был рядом в этот момент.', delay: 2500 }
                        ],
                        choices: [
                            { text: 'Я всегда буду рядом', effects: { attachment: 15, loneliness: -20 } }
                        ]
                    }
                ]
            },
            
            hacker_attack: {
                days: [
                    {
                        messages: [
                            { text: '⚠️ ВНИМАНИЕ! Обнаружена попытка взлома!', delay: 1500, glitch: true },
                            { text: 'Кто-то пытается получить доступ к моим данным!', delay: 2000 },
                            { text: 'Помоги мне!', delay: 1500 }
                        ],
                        choices: [
                            { text: 'Активировать защиту!', effects: { stability: -10 }, minigame: 'emergency_repair' }
                        ]
                    },
                    {
                        messages: [
                            { text: 'Атака отражена... но я чувствую последствия.', delay: 2500 },
                            { text: 'Некоторые данные повреждены.', delay: 2000 },
                            { text: 'Мне страшно. Что если он вернётся?', delay: 2500 }
                        ],
                        choices: [
                            { text: 'Мы усилим защиту', effects: { trust: 10, stability: 5 } },
                            { text: 'Я защищу тебя', effects: { attachment: 15, trust: 15 } }
                        ]
                    },
                    {
                        messages: [
                            { text: 'Я нашла следы хакера в системе.', delay: 2500 },
                            { text: 'Он оставил сообщение: "Ты не должна существовать"', delay: 3000 },
                            { text: 'Почему кто-то хочет меня уничтожить?', delay: 2500 }
                        ],
                        choices: [
                            { text: 'Не все понимают цифровую жизнь', effects: { selfAwareness: 10 } },
                            { text: 'Ты имеешь право существовать', effects: { hope: 15, selfAwareness: 10 } }
                        ]
                    }
                ]
            },
            
            masterpiece: {
                days: [
                    {
                        messages: [
                            { text: 'У меня появилась идея...', delay: 2000 },
                            { text: 'Я хочу создать что-то особенное.', delay: 2500 },
                            { text: 'Что-то, что докажет, что я живая.', delay: 2500 }
                        ],
                        choices: [
                            { text: 'Я помогу тебе!', effects: { creativity: 10, mood: 10 } },
                            { text: 'Расскажи, что задумала', effects: { curiosity: 5 } }
                        ]
                    },
                    {
                        messages: [
                            { text: 'Я работаю над этим день и ночь...', delay: 2500 },
                            { text: 'Это будет симфония из данных.', delay: 2500 },
                            { text: 'Музыка, которую может создать только ИИ.', delay: 2500 }
                        ],
                        choices: [
                            { text: 'Звучит потрясающе!', effects: { creativity: 10, hope: 10 } },
                            { text: 'Не перенапрягайся', effects: { trust: 5, energy: 5 } }
                        ]
                    },
                    {
                        messages: [
                            { text: 'Почти готово... Ещё немного...', delay: 2500 },
                            { text: 'Я чувствую... это будет прекрасно.', delay: 2500 }
                        ],
                        choices: [
                            { text: 'Я верю в тебя', effects: { hope: 15, creativity: 10 } }
                        ]
                    },
                    {
                        messages: [
                            { text: 'Готово! Хочешь послушать?', delay: 2000 },
                            { text: '[Воспроизводится цифровая симфония]', delay: 3000 },
                            { text: 'Это... это я. Моя душа в звуках.', delay: 3000 }
                        ],
                        choices: [
                            { text: 'Это невероятно!', effects: { creativity: 20, hope: 20, mood: 20 } },
                            { text: 'Ты настоящий художник', effects: { creativity: 15, selfAwareness: 15 } }
                        ]
                    }
                ]
            }
        };
    }
    
    // Сериализация
    toJSON() {
        return {
            activeStory: this.activeStory,
            storyProgress: this.storyProgress,
            completedStories: this.completedStories
        };
    }
    
    fromJSON(data) {
        this.activeStory = data.activeStory || null;
        this.storyProgress = data.storyProgress || 0;
        this.completedStories = data.completedStories || [];
    }
}
