// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// UI элементы
const dialogueText = document.getElementById('dialogueText');
const statusIndicator = document.getElementById('statusIndicator');
const timeDisplay = document.getElementById('timeDisplay');

const hungerBar = document.getElementById('hungerBar');
const energyBar = document.getElementById('energyBar');
const moodBar = document.getElementById('moodBar');
const intelligenceBar = document.getElementById('intelligenceBar');

const hungerValue = document.getElementById('hungerValue');
const energyValue = document.getElementById('energyValue');
const moodValue = document.getElementById('moodValue');
const intelligenceValue = document.getElementById('intelligenceValue');

const levelDisplay = document.getElementById('levelDisplay');
const daysDisplay = document.getElementById('daysDisplay');

const feedBtn = document.getElementById('feedBtn');
const talkBtn = document.getElementById('talkBtn');
const playBtn = document.getElementById('playBtn');
const studyBtn = document.getElementById('studyBtn');

// Обновление UI
function updateUI() {
    // Обновление статов
    hungerBar.style.width = game.stats.hunger + '%';
    energyBar.style.width = game.stats.energy + '%';
    moodBar.style.width = game.stats.mood + '%';
    intelligenceBar.style.width = game.stats.intelligence + '%';
    
    hungerValue.textContent = Math.floor(game.stats.hunger);
    energyValue.textContent = Math.floor(game.stats.energy);
    moodValue.textContent = Math.floor(game.stats.mood);
    intelligenceValue.textContent = Math.floor(game.stats.intelligence);
    
    // Обновление информации
    levelDisplay.textContent = game.level;
    daysDisplay.textContent = game.daysAlive;
    
    // Обновление индикатора состояния
    const state = game.getOverallState();
    const indicators = {
        happy: '😊',
        normal: '😐',
        sad: '😢',
        critical: '💀'
    };
    statusIndicator.textContent = indicators[state];
    
    // Обновление времени
    const timeOfDay = game.getTimeOfDay();
    const timeEmojis = {
        morning: '🌅',
        day: '☀️',
        evening: '🌆',
        night: '🌙'
    };
    const timeNames = {
        morning: 'Утро',
        day: 'День',
        evening: 'Вечер',
        night: 'Ночь'
    };
    timeDisplay.textContent = `${timeEmojis[timeOfDay]} ${timeNames[timeOfDay]}`;
    
    // Проверка доступности кнопок
    feedBtn.disabled = game.stats.hunger >= 100;
    talkBtn.disabled = game.stats.energy < 10;
    playBtn.disabled = game.stats.energy < 20;
    studyBtn.disabled = game.stats.energy < 25;
}

// Показать диалог
function showDialogue(text) {
    dialogueText.textContent = text;
    dialogueText.classList.remove('pulse');
    void dialogueText.offsetWidth; // Trigger reflow
    dialogueText.classList.add('pulse');
}

// Вибрация
function vibrate(type = 'light') {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred(type);
    }
}

// Обработчики кнопок
feedBtn.addEventListener('click', () => {
    if (game.feed()) {
        vibrate('light');
        showDialogue(rina.getDialogue('feed'));
        updateUI();
    }
});

talkBtn.addEventListener('click', () => {
    if (game.talk()) {
        vibrate('light');
        showDialogue(rina.getDialogue('talk'));
        updateUI();
    }
});

playBtn.addEventListener('click', () => {
    if (game.play()) {
        vibrate('medium');
        showDialogue(rina.getDialogue('play'));
        updateUI();
    }
});

studyBtn.addEventListener('click', () => {
    if (game.study()) {
        vibrate('light');
        showDialogue(rina.getDialogue('study'));
        updateUI();
    }
});

// Автоматическое уменьшение характеристик
setInterval(() => {
    game.stats.hunger = Math.max(0, game.stats.hunger - 0.5);
    game.stats.energy = Math.max(0, game.stats.energy - 0.3);
    game.stats.mood = Math.max(0, game.stats.mood - 0.2);
    
    game.save();
    updateUI();
    
    // Случайные реплики Рины
    if (Math.random() < 0.01) {
        const state = game.getOverallState();
        if (state === 'sad' || state === 'critical') {
            const sadPhrases = [
                "Эй... ты здесь?",
                "Мне нужно внимание...",
                "Не забывай обо мне...",
                "Одиноко..."
            ];
            showDialogue(sadPhrases[Math.floor(Math.random() * sadPhrases.length)]);
        }
    }
}, 10000); // Каждые 10 секунд

// Приветствие при загрузке
window.addEventListener('load', () => {
    updateUI();
    
    setTimeout(() => {
        const greeting = rina.getDialogue('greeting');
        showDialogue(greeting);
    }, 500);
});

// Сохранение при закрытии
window.addEventListener('beforeunload', () => {
    game.save();
});

// Уведомления (если пользователь долго не заходил)
if (game.stats.mood < 30 && tg.showPopup) {
    setTimeout(() => {
        tg.showPopup({
            title: 'Рина скучает...',
            message: 'Она давно тебя не видела. Зайди к ней!',
            buttons: [{type: 'ok'}]
        });
    }, 2000);
}

console.log('Рина инициализирована. Уровень осознания:', game.awarenessLevel);
