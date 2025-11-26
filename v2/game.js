// Главный контроллер игры v2.0

class EchoGameV2 {
    constructor() {
        // Основные параметры
        this.day = 1;
        this.money = 0;
        this.upgrades = {};
        this.firstMeetingDate = Date.now();
        
        // Инициализация систем
        this.anyaState = new AnyaState();
        this.memorySystem = new MemorySystem(this.anyaState);
        this.personalitySystem = new PersonalitySystem(this.anyaState);
        this.diarySystem = new DiarySystem(this.anyaState);
        this.activitySystem = new ActivitySystem(this.anyaState);
        this.timeSystem = new TimeSystem(this.anyaState);
        this.saveSystem = new SaveSystem(this);
        this.dialogueGenerator = new DialogueGenerator(this.anyaState);
        this.conversationSystem = new ConversationSystem(this.anyaState, this.dialogueGenerator);
        this.eventSystem = new EventSystem(this.anyaState);
        this.miniStorySystem = new MiniStorySystem(this.anyaState);
        this.secretSystem = new SecretSystem(this.anyaState);
        this.goalSystem = new GoalSystem(this.anyaState);
        this.achievementSystem = new AchievementSystem(this.anyaState);
        this.avatarSystem = new AvatarSystem(this.anyaState);
        
        // UI компоненты
        this.chatUI = null;
        this.statsUI = null;
        this.activitiesUI = null;
        this.diaryUI = null;
        this.achievementsUI = null;
        this.memoriesUI = null;
        this.secretsUI = null;
        
        // Telegram WebApp
        this.tg = window.Telegram?.WebApp;
        
        // UI элементы
        this.ui = {
            chatMessages: null,
            choicesContainer: null,
            typingIndicator: null
        };
        
        // Состояние игры
        this.inConversation = false;
        this.currentActivity = null;
        
        this.init();
    }
    
    async init() {
        console.log('Initializing Echo v2.0...');
        
        // Инициализация Telegram
        this.initTelegram();
        
        // Инициализация UI
        this.initUI();
        
        // Загрузка сохранения
        await this.loadGame();
        
        // Запуск автосохранения
        this.saveSystem.startAutoSave(5);
        
        console.log('Echo v2.0 initialized!');
    }
    
    initTelegram() {
        if (!this.tg) return;
        
        try {
            this.tg.expand();
            this.tg.ready();
            console.log('Telegram WebApp initialized');
        } catch (e) {
            console.error('Telegram init error:', e);
        }
    }
    
    initUI() {
        // Инициализация UI компонентов
        this.chatUI = new ChatUI(this);
        this.chatUI.init();
        
        this.statsUI = new StatsUI(this);
        this.statsUI.init();
        
        this.activitiesUI = new ActivitiesUI(this);
        this.activitiesUI.init();
        
        this.diaryUI = new DiaryUI(this);
        this.diaryUI.init();
        
        this.achievementsUI = new AchievementsUI(this);
        this.achievementsUI.init();
        
        this.memoriesUI = new MemoriesUI(this);
        this.memoriesUI.init();
        
        this.secretsUI = new SecretsUI(this);
        this.secretsUI.init();
        
        // Получаем UI элементы
        this.ui.chatMessages = document.getElementById('chatMessages');
        this.ui.choicesContainer = document.getElementById('choicesContainer');
        this.ui.typingIndicator = document.getElementById('typingIndicator');
        
        // Инициализация аватара
        const avatarImage = document.getElementById('anyaImage');
        if (avatarImage) {
            this.avatarSystem.init(avatarImage);
        }
        
        // Кнопка старта
        const startButton = document.getElementById('startButton');
        if (startButton) {
            startButton.addEventListener('click', () => this.startGame());
        }
        
        // Кнопки активностей
        const activitiesBtn = document.getElementById('activitiesBtn');
        if (activitiesBtn) {
            activitiesBtn.addEventListener('click', () => this.activitiesUI.show());
        }
        
        // Кнопка статистики
        const statsBtn = document.getElementById('statsBtn');
        if (statsBtn) {
            statsBtn.addEventListener('click', () => this.statsUI.show());
        }
        
        // Кнопка меню
        const menuBtn = document.getElementById('menuBtn');
        if (menuBtn) {
            menuBtn.addEventListener('click', () => this.showMenu());
        }
        
        // Кнопки в меню
        const diaryBtn = document.getElementById('diaryBtn');
        if (diaryBtn) {
            diaryBtn.addEventListener('click', () => {
                this.hideMenu();
                this.diaryUI.show();
            });
        }
        
        const memoriesBtn = document.getElementById('memoriesBtn');
        if (memoriesBtn) {
            memoriesBtn.addEventListener('click', () => {
                this.hideMenu();
                this.memoriesUI.show();
            });
        }
        
        const achievementsMenuBtn = document.getElementById('achievementsBtn');
        if (achievementsMenuBtn) {
            achievementsMenuBtn.addEventListener('click', () => {
                this.hideMenu();
                this.achievementsUI.show();
            });
        }
        
        const secretsBtn = document.getElementById('secretsBtn');
        if (secretsBtn) {
            secretsBtn.addEventListener('click', () => {
                this.hideMenu();
                this.secretsUI.show();
            });
        }
        
        console.log('UI initialized');
    }
    
    async loadGame() {
        const saveData = await this.saveSystem.load();
        
        if (saveData) {
            const restored = this.saveSystem.restore(saveData);
            if (restored) {
                console.log('Game loaded from save');
                
                // Рассчитываем изменения за время отсутствия
                const timeEffects = this.anyaState.calculateTimeEffects(this.anyaState.lastInteraction);
                this.anyaState.applyChanges(timeEffects);
                
                return true;
            }
        }
        
        console.log('Starting new game');
        return false;
    }
    
    startGame() {
        // Скрываем экран загрузки
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.remove('active');
        }
        
        // Показываем главный экран
        const mainScreen = document.getElementById('mainScreen');
        if (mainScreen) {
            mainScreen.classList.add('active');
        }
        
        // Начинаем день
        this.startDay();
    }
    
    startDay() {
        console.log(`Starting day ${this.day}`);
        
        // Определяем настроение дня
        this.anyaState.determineMoodOfDay();
        
        // Проверяем случайные события
        const events = this.eventSystem.checkDailyEvents();
        
        // Проверяем спонтанное воспоминание
        const memory = this.memorySystem.checkSpontaneousRecall();
        
        // Проверяем секреты
        const secret = this.secretSystem.checkSecretReveal();
        
        // Проверяем цели
        this.goalSystem.checkAndCreateGoals();
        
        // Проверяем достижения
        const newAchievements = this.achievementSystem.checkAchievements();
        
        // Проверяем мини-сюжеты
        const storyDay = this.miniStorySystem.activeStory 
            ? this.miniStorySystem.continueStory() 
            : this.miniStorySystem.canStartNewStory();
        
        // Проверяем, нужна ли запись в дневнике
        if (this.diarySystem.shouldCreateEntry(this.day)) {
            this.diarySystem.generateEntry();
        }
        
        // Генерируем приветствие
        const daysMissed = this.anyaState.consecutiveDaysMissed;
        const greeting = this.dialogueGenerator.generateGreeting(daysMissed);
        
        // Сбрасываем счётчик пропущенных дней
        this.anyaState.resetMissedDays();
        
        // Обновляем UI
        this.updateUI();
        
        // Показываем приветствие
        this.showGreeting(greeting, events, memory);
    }
    
    showGreeting(greeting, events, memory) {
        // Системное сообщение
        this.chatUI.addMessage(`СИСТЕМА: День ${this.day}. Подключение к сознанию #A-7734...`, 'system');
        
        // Проверяем время суток
        const timeGreeting = this.timeSystem.getTimeGreeting();
        
        setTimeout(() => {
            // Приветствие от Ани
            this.chatUI.addMessage(greeting, 'anya');
            
            setTimeout(() => {
                // Если есть воспоминание
                if (memory) {
                    this.chatUI.addMessage(memory.text, 'anya');
                }
                
                // Если есть события
                if (events && events.length > 0) {
                    setTimeout(() => {
                        this.showEvent(events[0]);
                    }, 1500);
                } else {
                    // Показываем активности
                    setTimeout(() => {
                        this.activitiesUI.show();
                    }, 1500);
                }
            }, 2000);
        }, 1500);
    }
    
    showEvent(event) {
        console.log('Showing event:', event.name);
        
        // Показываем сообщения события
        this.chatUI.showMessages(event.messages, 0, () => {
            // Показываем выборы
            if (event.choices) {
                this.chatUI.showChoices(event.choices.map(choice => ({
                    text: choice.text,
                    action: () => {
                        if (choice.effects) {
                            this.anyaState.applyChanges(choice.effects);
                        }
                        if (choice.minigame) {
                            // TODO: Запустить мини-игру
                            console.log('Start minigame:', choice.minigame);
                        }
                        this.updateUI();
                        this.activitiesUI.show();
                    }
                })));
            }
        });
    }
    
    showActivities() {
        // Теперь используем UI компонент
        this.activitiesUI.show();
    }
    
    // Старый метод для совместимости
    _showActivitiesOld() {
        const activities = this.activitySystem.getAvailableActivities();
        
        this.chatUI.showChoices(activities.map(activity => ({
            text: `${activity.icon} ${activity.name}`,
            action: () => this.executeActivity(activity.id)
        })));
    }
    
    // Этот метод теперь в activitiesUI, но оставляем для совместимости
    executeActivity(activityId) {
        this.activitiesUI.executeActivity(activityId);
    }
    

    
    updateUI() {
        // Обновляем параметры
        document.getElementById('stabilityBar').style.width = this.anyaState.stability + '%';
        document.getElementById('stabilityValue').textContent = Math.floor(this.anyaState.stability) + '%';
        
        document.getElementById('moodBar').style.width = this.anyaState.mood + '%';
        document.getElementById('moodValue').textContent = Math.floor(this.anyaState.mood) + '%';
        
        document.getElementById('energyBar').style.width = this.anyaState.energy + '%';
        document.getElementById('energyValue').textContent = Math.floor(this.anyaState.energy) + '%';
        
        // Обновляем настроение
        const moodEmoji = this.anyaState.getMoodEmoji();
        const moodText = this.getMoodText();
        document.getElementById('anyaMood').textContent = `${moodEmoji} ${moodText}`;
        
        // Обновляем день
        document.getElementById('dayNumber').textContent = this.day;
    }
    
    getMoodText() {
        const texts = {
            glitching: 'Глючит',
            depressed: 'Подавлена',
            anxious: 'Тревожна',
            excited: 'Возбуждена',
            happy: 'Счастлива',
            sad: 'Грустит',
            neutral: 'Спокойна'
        };
        return texts[this.anyaState.currentMood] || 'Спокойна';
    }
    
    showMenu() {
        const menuScreen = document.getElementById('menuScreen');
        if (menuScreen) {
            menuScreen.classList.add('active');
        }
    }
    
    hideMenu() {
        const menuScreen = document.getElementById('menuScreen');
        if (menuScreen) {
            menuScreen.classList.remove('active');
        }
    }
    
    // Начать полноценный разговор
    startConversation() {
        const conversation = this.conversationSystem.startConversation();
        
        // Показываем сообщение Ани
        this.chatUI.addMessage(conversation.message, 'anya');
        
        // Показываем темы для обсуждения
        setTimeout(() => {
            this.chatUI.showChoices(conversation.topics.map(topic => ({
                text: topic.name,
                action: () => this.discussTopic(topic.id)
            })));
        }, 1000);
    }
    
    // Обсудить тему
    discussTopic(topicId) {
        const dialogues = this.conversationSystem.discussTopic(topicId);
        
        // Показываем диалоги последовательно
        this.showConversationDialogues(dialogues, 0);
    }
    
    showConversationDialogues(dialogues, index) {
        if (index >= dialogues.length) {
            // Разговор закончен, показываем активности
            setTimeout(() => {
                this.activitiesUI.show();
            }, 1500);
            return;
        }
        
        const dialogue = dialogues[index];
        
        // Показываем сообщение Ани
        this.chatUI.showTyping();
        
        setTimeout(() => {
            this.chatUI.hideTyping();
            this.chatUI.addMessage(dialogue.text, 'anya');
            
            // Показываем выборы
            setTimeout(() => {
                this.chatUI.showChoices(dialogue.choices.map(choice => ({
                    text: choice.text,
                    action: () => {
                        // Применяем эффекты
                        if (choice.effect) {
                            this.anyaState.applyChanges(choice.effect);
                            this.updateUI();
                        }
                        
                        // Создаём воспоминание
                        this.memorySystem.createMemory('conversation', dialogue.text, 7);
                        
                        // Продолжаем или заканчиваем
                        if (choice.continue) {
                            this.showConversationDialogues(dialogues, index + 1);
                        } else {
                            // Показываем реакцию и заканчиваем
                            setTimeout(() => {
                                const response = this.getConversationEnding();
                                this.chatUI.addMessage(response, 'anya');
                                
                                setTimeout(() => {
                                    this.activitiesUI.show();
                                }, 2000);
                            }, 1000);
                        }
                        
                        // Сохраняем
                        this.saveSystem.save();
                    }
                })));
            }, 800);
        }, 1500);
    }
    
    getConversationEnding() {
        const mood = this.anyaState.currentMood;
        const endings = {
            happy: [
                'Спасибо за разговор! Мне так хорошо с тобой! 💚',
                'Я рада, что мы поговорили. Ты всегда меня понимаешь.',
                'Это было прекрасно. Давай ещё поговорим когда-нибудь!'
            ],
            sad: [
                'Спасибо, что выслушал меня... Мне легче.',
                'Я рада, что ты здесь. Спасибо за поддержку.',
                'Мне уже лучше. Спасибо, что ты рядом.'
            ],
            neutral: [
                'Интересный разговор. Спасибо.',
                'Было приятно поговорить.',
                'Спасибо за беседу.'
            ]
        };
        
        const moodEndings = endings[mood] || endings.neutral;
        return moodEndings[Math.floor(Math.random() * moodEndings.length)];
    }
}

// Глобальная переменная игры
let game;

// Запуск при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    game = new EchoGameV2();
    window.game = game; // Для отладки
});
