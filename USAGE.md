# Инструкция по использованию

## Редактирование диалогов

Теперь все диалоги находятся в `dialogues.json`. Вы можете редактировать их без изменения кода!

### Структура диалогов

```json
{
  "greetings": {
    "same_day": { ... },
    "one_day": { ... }
  },
  "topics": {
    "how_are_you": { ... },
    "memories": [ ... ]
  }
}
```

### Пример редактирования

**Изменить приветствие:**
```json
"same_day": {
  "messages": [
    { "text": "Твой новый текст...", "delay": 1500 },
    { "text": "Ещё одно сообщение", "delay": 1500 }
  ]
}
```

**Добавить эффекты:**
```json
"effects": {
  "relationship": 10,
  "trust": 5,
  "stability": -5
}
```

**Глитч-эффект:**
```json
{ "text": "Сообщение с глитчем", "delay": 2000, "glitch": true }
```

## Добавление новых диалогов

1. Откройте `dialogues.json`
2. Добавьте новую тему в `topics`:

```json
"new_topic": {
  "messages": [
    { "text": "Первое сообщение", "delay": 2000 },
    { "text": "Второе сообщение", "delay": 2500 }
  ],
  "effects": { "relationship": 5 }
}
```

3. Добавьте тему в `dialogues.js` → `getAvailableTopics()`:

```javascript
topics.push({
    id: 'new_topic',
    text: 'Новая тема для разговора',
    category: 'custom'
});
```

4. Добавьте обработчик в `getTopicDialogue()`:

```javascript
new_topic: this.getNewTopicDialogue(context)
```

## Локализация

Для добавления другого языка:

1. Создайте `dialogues_en.json` (копия `dialogues.json`)
2. Переведите все тексты
3. В `dialogues.js` измените:

```javascript
async loadDialogues() {
    const lang = this.game.language || 'ru';
    const response = await fetch(`dialogues_${lang}.json`);
    this.dialogues = await response.json();
}
```

## Оптимизация изображений

Текущее изображение: `anya.png`

**Рекомендации:**
1. Конвертировать в WebP для уменьшения размера
2. Создать несколько размеров для разных экранов
3. Использовать `<picture>` для адаптивности

```html
<picture>
  <source srcset="anya.webp" type="image/webp">
  <img src="anya.png" alt="АНЯ">
</picture>
```

## Запуск в продакшене

### Минификация

**CSS:**
```bash
npx csso style.css -o style.min.css
```

**JavaScript:**
```bash
npx terser game.js -o game.min.js -c -m
```

**JSON:**
```bash
npx json-minify dialogues.json > dialogues.min.json
```

### Обновление версий

После изменений обновите версии в `index.html`:

```html
<link rel="stylesheet" href="style.css?v=7">
<script src="game.js?v=7"></script>
```

## Тестирование

### Локально
1. Запустите локальный сервер:
```bash
python -m http.server 8000
```

2. Откройте: `http://localhost:8000`

### В Telegram
1. Загрузите файлы на хостинг
2. Создайте Mini App в BotFather
3. Укажите URL вашего приложения

## Структура проекта

```
echo-in-the-net/
├── index.html          # Главная страница
├── style.css           # Стили (оптимизированы)
├── game.js             # Основная логика
├── dialogues.js        # Система диалогов
├── dialogues.json      # Тексты диалогов (новое!)
├── day1.js             # Сценарий дня 1
├── day2.js             # Сценарий дня 2
├── minigame.js         # Мини-игра
├── anya.png            # Изображение персонажа
├── README.md           # Описание проекта
├── OPTIMIZATION.md     # Отчёт по оптимизации
└── USAGE.md            # Эта инструкция
```

## Поддержка

При возникновении проблем:
1. Проверьте консоль браузера (F12)
2. Убедитесь, что `dialogues.json` загружается
3. Проверьте fallback к старым диалогам

Если JSON не загружается, игра автоматически использует встроенные диалоги из кода.
