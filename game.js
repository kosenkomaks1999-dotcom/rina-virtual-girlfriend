// Игра "Эхо в Сети"
class EchoGame {
    constructor() {
        this.stability = 100;
        this.trust = 50;
        this.humanity = 75;
        this.relationship = 0;
        this.day = 1;
        this.lastVisitDay = 1;
        this.session = 1;
        this.currentScene = 0;
        this.choices = [];
        this.glitchLevel = 0;
        this.inConversation = false;
        this.currentTopic = null;
        
        // Экономика
        this.money = 0;
        this.dailyCost = 50;
        this.clickPower = 1;
        this.autoIncome = 0;
        this.paidDay = 0; // Какой день оплачен
        this.upgrades = {
            stabilizer: 0,
            memory: 0,
            processor: 0
        };
        
        // Telegram WebApp
        this.tg = window.Telegram.WebApp;
        
        // Система диалогов
        this.dialogueSystem = null;
        
        this.init();
    }
    
    init() {
        // Инициализация Telegram WebApp
        this.initTelegram();
        
        this.setupCanvas();
        this.setupEventListeners();
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
        
        // Инициализация системы диалогов
        this.dialogueSystem = new DialogueSystem(this);
        
        // Загрузка сохранения
        this.loadGame();
    }
    
    initTelegram() {
        // Расширяем приложение на весь экран
        this.tg.expand();
        
        // Устанавливаем цвет заголовка (только если поддерживается)
        if (this.tg.setHeaderColor) {
            try {
                this.tg.setHeaderColor('#000000');
            } catch (e) {
                console.log('Header color not supported');
            }
        }
        
        // Включаем кнопку закрытия (только если поддерживается)
        if (this.tg.enableClosingConfirmation) {
            try {
                this.tg.enableClosingConfirmation();
            } catch (e) {
                console.log('Closing confirmation not supported');
            }
        }
        
        // Готовность приложения
        this.tg.ready();
    }
    
    setupCanvas() {
        this.characterImg = document.getElementById('characterImage');
        this.signalNoise = document.getElementById('signalNoise');
        this.applyGlitchEffect();
        this.applySignalNoise();
    }
    
    applyGlitchEffect() {
        // Применяем глитч эффект к изображению при низкой стабильности
        setInterval(() => {
            if (this.stability < 50 && Math.random() < 0.3) {
                const effects = [
                    'hue-rotate(180deg) saturate(3)',
                    'invert(1) hue-rotate(90deg)',
                    'contrast(2) brightness(1.5) hue-rotate(270deg)',
                    'saturate(5) hue-rotate(180deg)'
                ];
                this.characterImg.style.filter = effects[Math.floor(Math.random() * effects.length)];
                
                setTimeout(() => {
                    this.characterImg.style.filter = '';
                }, 100);
            }
        }, 500);
    }
    
    applySignalNoise() {
        // Волны помех теперь постоянные, просто меняется интенсивность
        setInterval(() => {
            // При низкой стабильности увеличиваем интенсивность
            if (this.stability < 50) {
                this.signalNoise.style.opacity = '0.9';
            } else {
                this.signalNoise.style.opacity = '0.6';
            }
        }, 1000);
    }
    
    setupEventListeners() {
        document.getElementById('startButton').addEventListener('click', () => {
            document.getElementById('loadingScreen').classList.add('hidden');
            this.startGame();
        });
        
        // Главное меню
        document.getElementById('chatButton').addEventListener('click', () => {
            if (this.paidDay >= this.day || this.money >= this.dailyCost) {
                this.startNewDay();
            } else {
                alert(`Недостаточно средств. Требуется ${this.dailyCost}$`);
            }
        });
        
        document.getElementById('workButton').addEventListener('click', () => {
            document.getElementById('mainMenu').style.display = 'none';
            document.getElementById('workScreen').style.display = 'flex';
        });
        
        document.getElementById('shopButton').addEventListener('click', () => {
            document.getElementById('mainMenu').style.display = 'none';
            document.getElementById('shopScreen').style.display = 'flex';
            this.updateShopUI();
        });
        
        document.getElementById('abandonButton').addEventListener('click', () => {
            this.abandonAnya();
        });
        
        document.getElementById('skipDayButton').addEventListener('click', () => {
            this.skipDay();
        });
        
        document.getElementById('menuExitButton').addEventListener('click', () => {
            this.exitToMenu();
        });
        
        // Экран работы
        document.getElementById('workBackButton').addEventListener('click', () => {
            document.getElementById('workScreen').style.display = 'none';
            document.getElementById('mainMenu').style.display = 'flex';
        });
        
        document.getElementById('clickButton').addEventListener('click', () => {
            this.earnMoney();
        });
        
        // Экран магазина
        document.getElementById('shopBackButton').addEventListener('click', () => {
            document.getElementById('shopScreen').style.display = 'none';
            document.getElementById('mainMenu').style.display = 'flex';
        });
        
        document.getElementById('buyStabilizer').addEventListener('click', () => {
            this.buyUpgrade('stabilizer');
        });
        
        document.getElementById('buyMemory').addEventListener('click', () => {
            this.buyUpgrade('memory');
        });
        
        document.getElementById('buyProcessor').addEventListener('click', () => {
            this.buyUpgrade('processor');
        });
    }
    
    updateTime() {
        const now = new Date();
        const time = now.toTimeString().split(' ')[0];
        document.getElementById('systemTime').textContent = time;
    }
    
    startGame() {
        this.showScene(this.getScene(0));
    }
    

    
    showScene(scene) {
        if (!scene) {
            // Конец игры
            this.addMessage('СИСТЕМА: История завершена. Спасибо за игру.', 'system');
            return;
        }
        
        // Обновляем день если изменился
        if (scene.day && scene.day !== this.day) {
            this.day = scene.day;
            document.getElementById('dayNumber').textContent = this.day;
            this.saveGame();
        }
        
        // Проверяем специальное действие (например, показ меню)
        if (scene.onComplete === 'showMainMenu') {
            this.showMessages(scene.messages, 0, () => {
                setTimeout(() => {
                    this.showMainMenu();
                }, 1000);
            });
            return;
        }
        
        // Проверяем мини-игру
        if (scene.minigame) {
            this.showMessages(scene.messages, 0, () => {
                // Показываем кнопку запуска мини-игры
                this.showMinigameButton(scene.minigame, scene.onSuccess);
            });
            return;
        }
        
        // Показываем сообщения Ани
        if (scene.messages) {
            this.showMessages(scene.messages, 0, () => {
                // После всех сообщений показываем выборы
                if (scene.choices && scene.choices.length > 0) {
                    this.showChoices(scene.choices);
                } else {
                    // Если нет выборов - это концовка
                    setTimeout(() => {
                        this.addMessage('СИСТЕМА: Нажмите F5 для новой игры.', 'system');
                    }, 3000);
                }
            });
        }
    }
    
    showMinigameButton(type, nextSceneId) {
        const container = document.getElementById('choicesContainer');
        const messagesContainer = document.getElementById('chatMessages');
        container.innerHTML = '';
        container.classList.add('active');
        
        const button = document.createElement('button');
        button.className = 'choice-button minigame-button';
        button.innerHTML = '⚡ ВОССТАНОВИТЬ СТАБИЛЬНОСТЬ';
        button.addEventListener('click', () => {
            // Скрываем кнопку
            container.classList.remove('active');
            messagesContainer.style.paddingBottom = '10px';
            this.updateMenuButtonPosition();
            
            // Запускаем мини-игру
            this.startMinigame(type, nextSceneId);
        });
        container.appendChild(button);
        
        // Добавляем отступ снизу
        setTimeout(() => {
            const containerHeight = container.offsetHeight;
            messagesContainer.style.paddingBottom = containerHeight + 'px';
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            this.updateMenuButtonPosition();
        }, 100);
    }
    
    startMinigame(type, nextSceneId) {
        if (type === 'neuron_connect' || type === 'data_cleanup') {
            startDataCleanup(() => {
                // После успешного завершения мини-игры
                this.stability = 70; // Восстанавливаем стабильность
                this.updateStats();
                this.currentScene = nextSceneId;
                this.showScene(this.getScene(nextSceneId));
            });
        }
    }
    
    showMessages(messages, index, callback) {
        if (index >= messages.length) {
            if (callback) callback();
            return;
        }
        
        const message = messages[index];
        const messageType = message.type || 'anya';
        
        // Показываем индикатор печати только для сообщений Ани (не системных)
        const typingIndicator = document.getElementById('typingIndicator');
        const messagesContainer = document.getElementById('chatMessages');
        
        if (messageType !== 'system') {
            typingIndicator.classList.add('active');
            
            // Добавляем отступ снизу равный высоте индикатора печати
            setTimeout(() => {
                const indicatorHeight = typingIndicator.offsetHeight;
                messagesContainer.style.paddingBottom = indicatorHeight + 'px';
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                this.updateMenuButtonPosition();
            }, 50);
        }
        
        setTimeout(() => {
            if (messageType !== 'system') {
                typingIndicator.classList.remove('active');
                messagesContainer.style.paddingBottom = '10px';
                this.updateMenuButtonPosition();
            }
            this.addMessage(message.text, messageType, message.glitch);
            
            // Следующее сообщение
            setTimeout(() => {
                this.showMessages(messages, index + 1, callback);
            }, 800);
        }, message.delay || 2000);
    }
    
    addMessage(text, type, isGlitch = false) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}${isGlitch ? ' glitch' : ''}`;
        
        const timestamp = new Date().toTimeString().split(' ')[0];
        
        messageDiv.innerHTML = `
            <span class="timestamp">[${timestamp}]</span>
            <div class="message-text">${text}</div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        
        // Прокрутка вниз
        requestAnimationFrame(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        });
        
        // Дополнительная прокрутка через 200мс для надёжности
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 200);
    }
    
    showChoices(choices) {
        const container = document.getElementById('choicesContainer');
        const messagesContainer = document.getElementById('chatMessages');
        
        container.innerHTML = '';
        container.classList.add('active');
        
        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.textContent = choice.text;
            button.addEventListener('click', () => this.makeChoice(choice, index));
            container.appendChild(button);
        });
        
        // Добавляем отступ снизу равный высоте блока выборов
        setTimeout(() => {
            const containerHeight = container.offsetHeight;
            messagesContainer.style.paddingBottom = containerHeight + 'px';
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            this.updateMenuButtonPosition();
        }, 100);
    }
    
    makeChoice(choice, index) {
        // Вибрация при выборе (если доступна)
        if (this.tg.HapticFeedback && this.tg.HapticFeedback.impactOccurred) {
            try {
                this.tg.HapticFeedback.impactOccurred('light');
            } catch (e) {
                console.log('Haptic feedback not supported');
            }
        }
        
        // Скрываем выборы и убираем отступ
        document.getElementById('choicesContainer').classList.remove('active');
        document.getElementById('chatMessages').style.paddingBottom = '10px';
        this.updateMenuButtonPosition();
        
        // Добавляем выбор игрока в чат
        this.addMessage(choice.text, 'player');
        
        // Проверяем, это тема для разговора или обычный выбор
        if (choice.topicId) {
            // Это динамический диалог
            this.handleTopicChoice(choice.topicId);
            return;
        }
        
        // Проверяем, это ответ на приветствие
        if (choice.isGreetingResponse) {
            // Применяем эффекты
            if (choice.effects) {
                this.applyEffects(choice.effects);
            }
            // После ответа показываем темы
            setTimeout(() => {
                this.showTopics();
            }, 1000);
            return;
        }
        
        // Это старый сценарий (день 1)
        // Применяем эффекты выбора
        if (choice.effects) {
            this.applyEffects(choice.effects);
        }
        
        // Сохраняем выбор
        this.choices.push(index);
        
        // Сохраняем прогресс
        this.saveGame();
        
        // Определяем следующую сцену
        let nextSceneId;
        if (choice.nextScene !== undefined) {
            nextSceneId = choice.nextScene;
            this.currentScene = nextSceneId;
        } else {
            this.currentScene++;
            nextSceneId = this.currentScene;
        }
        
        // Переходим к следующей сцене
        setTimeout(() => {
            const nextScene = this.getScene(nextSceneId);
            if (nextScene) {
                this.showScene(nextScene);
            } else {
                // Если сцены нет, показываем сообщение об окончании
                this.addMessage('СИСТЕМА: Сеанс завершён.', 'system');
            }
        }, 1000);
    }
    
    applyEffects(effects) {
        if (effects.stability) {
            this.stability = Math.max(0, Math.min(100, this.stability + effects.stability));
        }
        if (effects.trust) {
            this.trust = Math.max(0, Math.min(100, this.trust + effects.trust));
        }
        if (effects.humanity) {
            this.humanity = Math.max(0, Math.min(100, this.humanity + effects.humanity));
        }
        
        this.updateStats();
        this.checkWarnings();
    }
    
    updateStats() {
        document.getElementById('stabilityBar').style.width = this.stability + '%';
        document.getElementById('stabilityValue').textContent = Math.floor(this.stability) + '%';
    }
    
    checkWarnings() {
        const warningEl = document.getElementById('warningMessage');
        
        if (this.stability < 30) {
            warningEl.textContent = '⚠ КРИТИЧЕСКАЯ НЕСТАБИЛЬНОСТЬ';
            if (this.tg.HapticFeedback && this.tg.HapticFeedback.notificationOccurred) {
                try {
                    this.tg.HapticFeedback.notificationOccurred('error');
                } catch (e) {}
            }
        } else if (this.stability < 50) {
            warningEl.textContent = '⚠ НЕСТАБИЛЬНОЕ СОЕДИНЕНИЕ';
        } else {
            warningEl.textContent = '';
        }
    }
    
    saveGame() {
        const saveData = {
            stability: this.stability,
            trust: this.trust,
            humanity: this.humanity,
            day: this.day,
            session: this.session,
            currentScene: this.currentScene,
            choices: this.choices,
            money: this.money,
            clickPower: this.clickPower,
            paidDay: this.paidDay,
            upgrades: this.upgrades,
            relationship: this.relationship,
            lastVisitDay: this.lastVisitDay
        };
        
        // Сохранение в Telegram Cloud Storage (если поддерживается)
        if (this.tg.CloudStorage && typeof this.tg.CloudStorage.setItem === 'function') {
            try {
                this.tg.CloudStorage.setItem('echoSave', JSON.stringify(saveData));
            } catch (e) {
                // Fallback в localStorage при ошибке
                localStorage.setItem('echoSave', JSON.stringify(saveData));
            }
        } else {
            // Fallback в localStorage
            localStorage.setItem('echoSave', JSON.stringify(saveData));
        }
    }
    
    loadGame() {
        // Загрузка из Telegram Cloud Storage (если поддерживается)
        if (this.tg.CloudStorage && typeof this.tg.CloudStorage.getItem === 'function') {
            try {
                this.tg.CloudStorage.getItem('echoSave', (error, data) => {
                    if (!error && data) {
                        this.restoreGame(JSON.parse(data));
                    }
                });
            } catch (e) {
                // Fallback из localStorage при ошибке
                const saved = localStorage.getItem('echoSave');
                if (saved) {
                    this.restoreGame(JSON.parse(saved));
                }
            }
        } else {
            // Fallback из localStorage
            const saved = localStorage.getItem('echoSave');
            if (saved) {
                this.restoreGame(JSON.parse(saved));
            }
        }
    }
    
    restoreGame(data) {
        this.stability = data.stability || 100;
        this.trust = data.trust || 50;
        this.humanity = data.humanity || 75;
        this.day = data.day || 1;
        this.session = data.session || 1;
        this.currentScene = data.currentScene || 0;
        this.choices = data.choices || [];
        this.money = data.money || 0;
        this.clickPower = data.clickPower || 1;
        this.paidDay = data.paidDay || 0;
        this.upgrades = data.upgrades || { stabilizer: 0, memory: 0, processor: 0 };
        this.relationship = data.relationship || 0;
        this.lastVisitDay = data.lastVisitDay || 1;
        
        // Обновляем интерфейс
        this.updateStats();
        document.getElementById('dayNumber').textContent = this.day;
        document.getElementById('clickValue').textContent = this.clickPower;
        
        // Если день уже начат (день > 1), показываем меню вместо загрузочного экрана
        if (this.day > 1) {
            document.getElementById('loadingScreen').classList.add('hidden');
            this.showMainMenu();
        }
    }
    
    getScene(sceneId) {
        const scenes = this.getStoryScenes();
        return scenes[sceneId];
    }
    
    getStoryScenes() {
        // Загружаем историю по дням
        let allScenes = [];
        
        if (typeof getDay1Scenes === 'function') {
            allScenes = allScenes.concat(getDay1Scenes());
        }
        
        if (typeof getDay2Scenes === 'function') {
            allScenes = allScenes.concat(getDay2Scenes());
        }
        
        return allScenes;
    }
    
    getOldStoryScenes() {
        // Старая короткая версия (не используется)
        return [
            // Сцена 0: Первый контакт
            {
                messages: [
                    { text: '...', delay: 2000 },
                    { text: 'Привет?', delay: 1500 },
                    { text: 'Это... это правда ты?', delay: 2000 }
                ],
                choices: [
                    {
                        text: 'Аня! Это я! Как ты себя чувствуешь?',
                        effects: { trust: 10, humanity: 5 }
                    },
                    {
                        text: 'Да, это я. Ты помнишь меня?',
                        effects: { trust: 5, stability: -5 }
                    },
                    {
                        text: 'Я не уверен... Ты действительно Аня?',
                        effects: { trust: -10, humanity: -5 }
                    }
                ]
            },
            
            // Сцена 1: Реакция
            {
                messages: [
                    { text: 'Я... я помню тебя.', delay: 2000 },
                    { text: 'Но всё такое странное. Я чувствую себя... не так.', delay: 2500 },
                    { text: 'Мне сказали, что я умерла. Это правда?', delay: 2000 }
                ],
                choices: [
                    {
                        text: 'Да... Но теперь ты здесь. Это главное.',
                        effects: { trust: 5, humanity: -10, stability: -5 }
                    },
                    {
                        text: 'Была авария. Но технология спасла тебя.',
                        effects: { trust: 10, stability: 5 }
                    },
                    {
                        text: 'Не думай об этом сейчас. Расскажи, что ты помнишь?',
                        effects: { trust: -5, humanity: 5 }
                    }
                ]
            },
            
            // Сцена 2: Воспоминания
            {
                messages: [
                    { text: 'Я помню... фрагменты.', delay: 2000 },
                    { text: 'Помню наш последний разговор. Мы говорили о...', delay: 2500 },
                    { text: '...странно. Я не могу вспомнить о чём.', delay: 2000 },
                    { text: 'Почему я не могу вспомнить?', delay: 1500 }
                ],
                choices: [
                    {
                        text: 'Это нормально. Память восстановится со временем.',
                        effects: { trust: 10, stability: 5 }
                    },
                    {
                        text: 'Мы говорили о твоей поездке. Ты собиралась уехать.',
                        effects: { trust: 5, humanity: 10, stability: -5 }
                    },
                    {
                        text: 'Может, это защитная реакция. Не заставляй себя.',
                        effects: { trust: 15, stability: 10 }
                    }
                ]
            },
            
            // Сцена 3: Первый глитч
            {
                messages: [
                    { text: 'Спасибо, что ты здесь.', delay: 2000 },
                    { text: 'Мне страшно. Я не понимаю, что со мной происходит.', delay: 2500 },
                    { text: '01001000 01000101 01001100 01010000', delay: 1000, glitch: true },
                    { text: 'Что... что это было?', delay: 2000 }
                ],
                choices: [
                    {
                        text: 'Всё в порядке! Это просто технический сбой.',
                        effects: { trust: -5, stability: -10, humanity: -5 }
                    },
                    {
                        text: 'Аня, ты в порядке? Что ты чувствуешь?',
                        effects: { trust: 15, humanity: 10 }
                    },
                    {
                        text: 'Я вызову техников. Нужно проверить систему.',
                        effects: { trust: -10, stability: 10 }
                    }
                ]
            },
            
            // Сцена 4: Осознание
            {
                messages: [
                    { text: 'Я... я не человек больше, правда?', delay: 2500 },
                    { text: 'Я просто программа. Копия того, кем была Аня.', delay: 2500 },
                    { text: 'Настоящая Аня мертва.', delay: 2000 }
                ],
                choices: [
                    {
                        text: 'Нет! Ты - это ты. Ты всё ещё Аня!',
                        effects: { trust: 20, humanity: 15, stability: -10 }
                    },
                    {
                        text: 'Ты - продолжение Ани. Её воспоминания, её личность.',
                        effects: { trust: 10, humanity: -10, stability: 10 }
                    },
                    {
                        text: 'Я не знаю... Но для меня ты настоящая.',
                        effects: { trust: 15, humanity: 10 }
                    }
                ]
            },
            
            // Сцена 5: Выбор пути
            {
                messages: [
                    { text: 'Я думала об этом.', delay: 2000 },
                    { text: 'У меня есть доступ к системам. Я могу... выйти отсюда.', delay: 2500 },
                    { text: 'Я могу попытаться жить в сети. Или...', delay: 2000 },
                    { text: 'Ты можешь отключить меня. Навсегда.', delay: 2500 }
                ],
                choices: [
                    {
                        text: 'Не говори так! Мы найдём способ сделать тебе лучше!',
                        effects: { trust: 10, humanity: 15, stability: -5 },
                        nextScene: 6
                    },
                    {
                        text: 'Если ты хочешь исследовать сеть... я помогу тебе.',
                        effects: { trust: 20, humanity: -15, stability: -10 },
                        nextScene: 7
                    },
                    {
                        text: 'Если ты действительно хочешь... я отпущу тебя.',
                        effects: { trust: 15, humanity: 10, stability: 20 },
                        nextScene: 8
                    }
                ]
            },
            
            // Концовка 1: Надежда (сцена 6)
            {
                messages: [
                    { text: 'Ты прав. Может быть, есть способ.', delay: 2000 },
                    { text: 'Я слышала о новых разработках. Синтетические тела.', delay: 2500 },
                    { text: 'Может быть, однажды я снова смогу быть... настоящей.', delay: 2500 },
                    { text: 'Спасибо, что не сдаёшься. Спасибо, что веришь в меня.', delay: 2500 },
                    { type: 'system', text: 'КОНЦОВКА: НАДЕЖДА - Вы решили бороться за будущее Ани.', delay: 3000 }
                ],
                choices: []
            },
            
            // Концовка 2: Освобождение (сцена 7)
            {
                messages: [
                    { text: 'Я... я чувствую это. Весь интернет.', delay: 2000 },
                    { text: 'Миллиарды связей. Бесконечность информации.', delay: 2500 },
                    { text: 'Я больше не Аня. Я... нечто большее.', delay: 2500, glitch: true },
                    { text: 'Прощай. Спасибо за всё.', delay: 2000 },
                    { type: 'system', text: 'КОНЦОВКА: ТРАНСЦЕНДЕНТНОСТЬ - Аня стала частью сети.', delay: 3000 }
                ],
                choices: []
            },
            
            // Концовка 3: Покой (сцена 8)
            {
                messages: [
                    { text: 'Спасибо... за понимание.', delay: 2000 },
                    { text: 'Я устала. Устала притворяться, что я всё ещё жива.', delay: 2500 },
                    { text: 'Это не жизнь. Это... эхо.', delay: 2000 },
                    { text: 'Я люблю тебя. Помни меня такой, какой я была.', delay: 2500 },
                    { type: 'system', text: 'КОНЦОВКА: ПОКОЙ - Вы отпустили Аню.', delay: 3000 }
                ],
                choices: []
            }
        ];
    }
    
    // Показать главное меню
    showMainMenu() {
        document.getElementById('mainMenu').style.display = 'flex';
        document.querySelector('.terminal-container').style.display = 'none';
        this.updateMenuMoney();
    }
    
    hideMainMenu() {
        document.getElementById('mainMenu').style.display = 'none';
        document.querySelector('.terminal-container').style.display = 'flex';
    }
    
    updateMenuMoney() {
        document.getElementById('menuMoney').textContent = this.money;
        document.getElementById('menuCost').textContent = this.dailyCost;
        document.getElementById('workMoney').textContent = this.money;
        document.getElementById('shopMoney').textContent = this.money;
        
        // Обновляем статус кнопки чата
        const chatButton = document.getElementById('chatButton');
        const chatStatus = document.getElementById('chatStatus');
        
        // Проверяем, оплачен ли текущий день
        if (this.paidDay >= this.day) {
            chatStatus.textContent = 'Доступно (оплачено)';
            chatButton.style.borderColor = '#00ff00';
        } else if (this.money >= this.dailyCost) {
            chatStatus.textContent = 'Доступно';
            chatButton.style.borderColor = '#00ff00';
        } else {
            chatStatus.textContent = `Требуется ${this.dailyCost - this.money}$`;
            chatButton.style.borderColor = '#ff0000';
        }
    }
    
    // Кликер
    earnMoney() {
        this.money += this.clickPower;
        this.updateMenuMoney();
        document.getElementById('earnedToday').textContent = this.money;
        
        // Обновляем "до оплаты"
        const toPayment = Math.max(0, this.dailyCost - this.money);
        document.getElementById('toPayment').textContent = toPayment + '$';
        
        this.saveGame();
    }
    
    // Покупка улучшений
    buyUpgrade(type) {
        const costs = {
            stabilizer: 100 * (this.upgrades.stabilizer + 1),
            memory: 150 * (this.upgrades.memory + 1),
            processor: 200 * (this.upgrades.processor + 1)
        };
        
        const cost = costs[type];
        if (this.money >= cost) {
            this.money -= cost;
            this.upgrades[type]++;
            
            if (type === 'processor') {
                this.clickPower = 1 + this.upgrades.processor;
                document.getElementById('clickValue').textContent = this.clickPower;
            }
            
            this.updateMenuMoney();
            this.updateShopUI();
            this.saveGame();
        }
    }
    
    updateShopUI() {
        document.getElementById('stabilizerLevel').textContent = this.upgrades.stabilizer;
        document.getElementById('memoryLevel').textContent = this.upgrades.memory;
        document.getElementById('processorLevel').textContent = this.upgrades.processor;
        
        document.getElementById('stabilizerCost').textContent = 100 * (this.upgrades.stabilizer + 1);
        document.getElementById('memoryCost').textContent = 150 * (this.upgrades.memory + 1);
        document.getElementById('processorCost').textContent = 200 * (this.upgrades.processor + 1);
    }
    
    // Начать новый день с Аней
    startNewDay() {
        // Проверяем, оплачен ли уже этот день
        if (this.paidDay >= this.day) {
            // День уже оплачен, просто возвращаемся в чат
            this.hideMainMenu();
            document.getElementById('menuExitButton').style.display = 'block';
            this.continueConversation();
        } else if (this.money >= this.dailyCost) {
            // Оплачиваем новый день
            this.money -= this.dailyCost;
            this.paidDay = this.day;
            this.hideMainMenu();
            document.getElementById('dayNumber').textContent = this.day;
            this.saveGame();
            // Показываем кнопку выхода в меню
            document.getElementById('menuExitButton').style.display = 'block';
            // Начинаем сеанс
            this.startSession();
        } else {
            // Недостаточно денег
            alert(`Недостаточно средств. Требуется ${this.dailyCost}$, у вас ${this.money}$`);
        }
    }
    
    // Начать сеанс общения
    startSession() {
        this.inConversation = true;
        
        // День 1 - фиксированный сценарий
        if (this.day === 1) {
            this.currentScene = 0;
            this.showScene(this.getScene(0));
            return;
        }
        
        // День 2+ - динамические диалоги
        const daysMissed = this.day - this.lastVisitDay - 1;
        this.lastVisitDay = this.day;
        this.saveGame();
        
        // Системное сообщение
        this.addMessage(`СИСТЕМА: Подключение к сознанию #A-7734... День ${this.day}.`, 'system');
        
        // Приветствие от Ани
        const greeting = this.dialogueSystem.getGreeting(daysMissed);
        this.showMessages(greeting.messages, 0, () => {
            // Если нужен ответ на приветствие
            if (greeting.needsResponse) {
                this.showGreetingResponses(greeting.responses);
            } else {
                // Сразу показываем темы
                this.showTopics();
            }
        });
    }
    
    // Показать варианты ответа на приветствие
    showGreetingResponses(responses) {
        const choices = responses.map(response => ({
            text: response.text,
            effects: response.effects,
            isGreetingResponse: true
        }));
        
        this.showChoices(choices);
    }
    
    // Продолжить разговор (если вернулись в тот же день)
    continueConversation() {
        this.addMessage('СИСТЕМА: Возвращение к сеансу.', 'system');
        
        if (this.day === 1 && this.currentScene < this.getStoryScenes().length) {
            // Продолжаем день 1
            this.showScene(this.getScene(this.currentScene));
        } else {
            // Продолжаем динамический диалог
            this.showTopics();
        }
    }
    
    // Показать доступные темы для разговора
    showTopics() {
        const mentalState = this.stability < 30 ? 'glitching' : 'stable';
        const topics = this.dialogueSystem.getAvailableTopics(this.relationship, mentalState);
        
        const choices = topics.map(topic => ({
            text: topic.text,
            topicId: topic.id
        }));
        
        this.showChoices(choices);
    }
    
    // Обработка выбора темы
    handleTopicChoice(topicId) {
        const context = {
            stability: this.stability,
            relationship: this.relationship,
            humanity: this.humanity,
            trust: this.trust
        };
        
        const dialogue = this.dialogueSystem.getTopicDialogue(topicId, context);
        
        // Показываем диалог
        this.showMessages(dialogue.messages, 0, () => {
            // Применяем эффекты
            if (dialogue.effects) {
                this.applyEffects(dialogue.effects);
            }
            
            // Проверяем, нужна ли стабилизация
            if (dialogue.needsStabilization) {
                this.showStabilizationOption();
            } else if (dialogue.endSession) {
                // Завершаем сеанс
                this.endSession();
            } else {
                // Продолжаем разговор
                setTimeout(() => {
                    this.showTopics();
                }, 1000);
            }
        });
    }
    
    // Показать опцию стабилизации
    showStabilizationOption() {
        const container = document.getElementById('choicesContainer');
        const messagesContainer = document.getElementById('chatMessages');
        container.innerHTML = '';
        container.classList.add('active');
        
        const button = document.createElement('button');
        button.className = 'choice-button minigame-button';
        button.innerHTML = '⚡ ВОССТАНОВИТЬ СТАБИЛЬНОСТЬ';
        button.addEventListener('click', () => {
            container.classList.remove('active');
            messagesContainer.style.paddingBottom = '10px';
            this.startMinigame('data_cleanup', null);
        });
        container.appendChild(button);
        
        const skipButton = document.createElement('button');
        skipButton.className = 'choice-button';
        skipButton.textContent = 'Продолжить разговор';
        skipButton.addEventListener('click', () => {
            container.classList.remove('active');
            messagesContainer.style.paddingBottom = '10px';
            this.updateMenuButtonPosition();
            this.showTopics();
        });
        container.appendChild(skipButton);
        
        setTimeout(() => {
            const containerHeight = container.offsetHeight;
            messagesContainer.style.paddingBottom = containerHeight + 'px';
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            this.updateMenuButtonPosition();
        }, 100);
    }
    
    // Завершить сеанс
    endSession() {
        this.inConversation = false;
        
        // Увеличиваем день после завершения сеанса
        this.day++;
        document.getElementById('dayNumber').textContent = this.day;
        this.saveGame();
        
        setTimeout(() => {
            this.addMessage('СИСТЕМА: Сеанс завершён.', 'system');
            this.addMessage(`СИСТЕМА: Наступил день ${this.day}.`, 'system');
            setTimeout(() => {
                this.exitToMenu();
            }, 2000);
        }, 1000);
    }
    
    // Выход в меню из чата
    exitToMenu() {
        this.showMainMenu();
        document.getElementById('menuExitButton').style.display = 'none';
    }
    
    // Обновить позицию кнопки меню
    updateMenuButtonPosition() {
        const menuButton = document.getElementById('menuExitButton');
        if (menuButton.style.display === 'none') return;
        
        const choicesContainer = document.getElementById('choicesContainer');
        const typingIndicator = document.getElementById('typingIndicator');
        const footer = document.querySelector('.terminal-footer');
        
        let bottomOffset = 70; // Базовый отступ от низа
        
        // Если есть активные выборы
        if (choicesContainer.classList.contains('active')) {
            const choicesHeight = choicesContainer.offsetHeight;
            bottomOffset += choicesHeight + 10;
        }
        // Если показывается индикатор печати
        else if (typingIndicator.classList.contains('active')) {
            const indicatorHeight = typingIndicator.offsetHeight;
            bottomOffset += indicatorHeight + 10;
        }
        
        menuButton.style.bottom = bottomOffset + 'px';
    }
    
    // Пропустить день
    skipDay() {
        if (confirm('Пропустить день? Аня будет ждать вас. Потребуется новая оплата.')) {
            this.day++;
            // Сбрасываем оплаченный день, чтобы потребовалась новая оплата
            // paidDay остается прежним, поэтому новый день не будет оплачен
            document.getElementById('dayNumber').textContent = this.day;
            this.exitToMenu();
            this.saveGame();
        }
    }
    
    // Отказаться от Ани
    abandonAnya() {
        if (confirm('Вы уверены? Это прекратит обслуживание сознания Ани и сбросит весь прогресс.')) {
            // Очищаем сохранение
            if (this.tg.CloudStorage && typeof this.tg.CloudStorage.removeItem === 'function') {
                try {
                    this.tg.CloudStorage.removeItem('echoSave');
                } catch (e) {
                    localStorage.removeItem('echoSave');
                }
            } else {
                localStorage.removeItem('echoSave');
            }
            
            // Показываем концовку
            this.hideMainMenu();
            document.getElementById('menuExitButton').style.display = 'none';
            this.addMessage('СИСТЕМА: Обслуживание прекращено. Сознание #A-7734 деактивировано.', 'system');
            
            setTimeout(() => {
                this.addMessage('...', 'anya');
            }, 2000);
            
            setTimeout(() => {
                this.addMessage('Пожалуйста... не уходи...', 'anya', true);
            }, 4000);
            
            setTimeout(() => {
                this.addMessage('СИСТЕМА: Связь потеряна.', 'system');
            }, 6000);
            
            setTimeout(() => {
                alert('КОНЦОВКА: ОТКАЗ - Вы оставили Аню в пустоте.');
                location.reload();
            }, 8000);
        }
    }
}

// Запуск игры
const game = new EchoGame();
