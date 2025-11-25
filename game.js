// Игра "Эхо в Сети"
class EchoGame {
    constructor() {
        this.stability = 100;
        this.trust = 50;
        this.humanity = 75;
        this.day = 1;
        this.session = 1;
        this.currentScene = 0;
        this.choices = [];
        this.glitchLevel = 0;
        
        // Telegram WebApp
        this.tg = window.Telegram.WebApp;
        
        this.init();
    }
    
    init() {
        // Инициализация Telegram WebApp
        this.initTelegram();
        
        this.setupCanvas();
        this.setupEventListeners();
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
        
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
        
        // Проверяем мини-игру
        if (scene.minigame) {
            this.showMessages(scene.messages, 0, () => {
                // Запускаем мини-игру
                this.startMinigame(scene.minigame, scene.onSuccess);
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
        
        // Показываем индикатор печати
        document.getElementById('typingIndicator').classList.add('active');
        
        setTimeout(() => {
            document.getElementById('typingIndicator').classList.remove('active');
            this.addMessage(message.text, message.type || 'anya', message.glitch);
            
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
        container.innerHTML = '';
        container.classList.add('active');
        
        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-button';
            button.textContent = choice.text;
            button.addEventListener('click', () => this.makeChoice(choice, index));
            container.appendChild(button);
        });
        
        // Прокручиваем к выборам
        setTimeout(() => {
            const messagesContainer = document.getElementById('chatMessages');
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
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
        
        // Скрываем выборы
        document.getElementById('choicesContainer').classList.remove('active');
        
        // Добавляем выбор игрока в чат
        this.addMessage(choice.text, 'player');
        
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
            choices: this.choices
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
        
        this.updateStats();
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
        
        // Добавим другие дни когда создадим
        // if (typeof getDay2Scenes === 'function') {
        //     allScenes = allScenes.concat(getDay2Scenes());
        // }
        
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
}

// Запуск игры
const game = new EchoGame();
