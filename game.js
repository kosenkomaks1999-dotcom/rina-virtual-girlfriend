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
        
        // Устанавливаем цвет заголовка
        this.tg.setHeaderColor('#000000');
        
        // Включаем кнопку закрытия
        this.tg.enableClosingConfirmation();
        
        // Готовность приложения
        this.tg.ready();
    }
    
    setupCanvas() {
        this.canvas = document.getElementById('characterCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        this.drawCharacter();
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
    
    drawCharacter() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, w, h);
        
        const p = 4; // размер пикселя
        const cx = w / 2;
        const cy = h / 2;
        
        // Определяем состояние персонажа
        const isGlitched = this.stability < 50;
        const isDistressed = this.humanity < 40;
        
        // Голова
        ctx.fillStyle = isGlitched ? '#00ff00' : '#00ff00';
        this.fillRect(ctx, cx - 6*p, cy - 8*p, 12*p, 14*p);
        
        // Волосы
        ctx.fillStyle = '#00ff00';
        this.fillRect(ctx, cx - 8*p, cy - 10*p, 16*p, 4*p);
        this.fillRect(ctx, cx - 10*p, cy - 8*p, 4*p, 6*p);
        this.fillRect(ctx, cx + 6*p, cy - 8*p, 4*p, 6*p);
        
        // Глаза
        if (isGlitched && Math.random() < 0.3) {
            // Глитч глаза
            ctx.fillStyle = '#ff0000';
            this.fillRect(ctx, cx - 4*p, cy - 4*p, 2*p, 2*p);
            this.fillRect(ctx, cx + 2*p, cy - 4*p, 2*p, 2*p);
        } else {
            ctx.fillStyle = '#000';
            this.fillRect(ctx, cx - 4*p, cy - 4*p, 2*p, 3*p);
            this.fillRect(ctx, cx + 2*p, cy - 4*p, 2*p, 3*p);
        }
        
        // Рот
        ctx.fillStyle = '#000';
        if (isDistressed) {
            // Грустный рот
            this.fillRect(ctx, cx - 2*p, cy + 2*p, 4*p, p);
        } else if (this.trust > 70) {
            // Улыбка
            this.fillRect(ctx, cx - 3*p, cy + 2*p, 6*p, p);
            this.fillRect(ctx, cx - 4*p, cy + p, 2*p, p);
            this.fillRect(ctx, cx + 2*p, cy + p, 2*p, p);
        } else {
            // Нейтральный
            this.fillRect(ctx, cx - 2*p, cy + 2*p, 4*p, p);
        }
        
        // Тело
        ctx.fillStyle = '#00ff00';
        this.fillRect(ctx, cx - 6*p, cy + 6*p, 12*p, 8*p);
        
        // Глитч эффект
        if (isGlitched) {
            this.applyGlitch();
        }
        
        // Перерисовка каждые 100мс для анимации
        setTimeout(() => this.drawCharacter(), 100);
    }
    
    fillRect(ctx, x, y, w, h) {
        ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
    }
    
    applyGlitch() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            if (Math.random() < 0.05) {
                data[i] = 255;     // R
                data[i + 1] = 0;   // G
                data[i + 2] = 0;   // B
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    showScene(scene) {
        if (!scene) return;
        
        // Показываем сообщения Ани
        if (scene.messages) {
            this.showMessages(scene.messages, 0, () => {
                // После всех сообщений показываем выборы
                if (scene.choices) {
                    this.showChoices(scene.choices);
                }
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
        
        // Принудительная прокрутка вниз с задержкой для рендеринга
        setTimeout(() => {
            messagesContainer.scrollTo({
                top: messagesContainer.scrollHeight,
                behavior: 'smooth'
            });
        }, 50);
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
            container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
    
    makeChoice(choice, index) {
        // Вибрация при выборе (если доступна)
        if (this.tg.HapticFeedback) {
            this.tg.HapticFeedback.impactOccurred('light');
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
        
        document.getElementById('trustBar').style.width = this.trust + '%';
        document.getElementById('trustValue').textContent = Math.floor(this.trust) + '%';
        
        document.getElementById('humanityBar').style.width = this.humanity + '%';
        document.getElementById('humanityValue').textContent = Math.floor(this.humanity) + '%';
    }
    
    checkWarnings() {
        const warningEl = document.getElementById('warningMessage');
        
        if (this.stability < 30) {
            warningEl.textContent = '⚠ КРИТИЧЕСКАЯ НЕСТАБИЛЬНОСТЬ';
            if (this.tg.HapticFeedback) {
                this.tg.HapticFeedback.notificationOccurred('error');
            }
        } else if (this.humanity < 30) {
            warningEl.textContent = '⚠ ПОТЕРЯ ЛИЧНОСТИ';
            if (this.tg.HapticFeedback) {
                this.tg.HapticFeedback.notificationOccurred('warning');
            }
        } else if (this.trust < 20) {
            warningEl.textContent = '⚠ НИЗКОЕ ДОВЕРИЕ';
            if (this.tg.HapticFeedback) {
                this.tg.HapticFeedback.notificationOccurred('warning');
            }
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
        
        // Сохранение в Telegram Cloud Storage
        if (this.tg.CloudStorage) {
            this.tg.CloudStorage.setItem('echoSave', JSON.stringify(saveData));
        } else {
            // Fallback в localStorage
            localStorage.setItem('echoSave', JSON.stringify(saveData));
        }
    }
    
    loadGame() {
        // Загрузка из Telegram Cloud Storage
        if (this.tg.CloudStorage) {
            this.tg.CloudStorage.getItem('echoSave', (error, data) => {
                if (!error && data) {
                    this.restoreGame(JSON.parse(data));
                }
            });
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
