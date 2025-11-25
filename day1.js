// День 1: Первый контакт

function getDay1Scenes() {
    return [
        // Сцена 0: Критическая нестабильность
        {
            day: 1,
            type: 'system_alert',
            messages: [
                { type: 'system', text: '⚠ КРИТИЧЕСКАЯ НЕСТАБИЛЬНОСТЬ ОБНАРУЖЕНА', delay: 1000 },
                { type: 'system', text: 'СОЗНАНИЕ #A-7734 В АВАРИЙНОМ СОСТОЯНИИ', delay: 1500 },
                { type: 'system', text: 'ТРЕБУЕТСЯ НЕМЕДЛЕННАЯ СТАБИЛИЗАЦИЯ', delay: 1500 }
            ],
            minigame: 'data_cleanup', // Запускает мини-игру
            onSuccess: 1 // После успеха переход к сцене 1
        },
        
        // Сцена 1: Глитч-сообщения
        {
            day: 1,
            messages: [
                { text: '01001000 01000101 01001100 01010000', delay: 1000, glitch: true },
                { text: '█▓▒░ERROR░▒▓█', delay: 800, glitch: true },
                { text: 'г̴̡̢д̸̨е̷̢... ̶я̴̧...', delay: 1200, glitch: true },
                { type: 'system', text: 'СТАБИЛИЗАЦИЯ ЗАВЕРШЕНА. СВЯЗЬ ВОССТАНОВЛЕНА.', delay: 2000 }
            ],
            choices: [
                {
                    text: 'Привет',
                    effects: { stability: 5 }
                },
                {
                    text: 'Аня, ты меня слышишь?',
                    effects: { stability: 3 }
                },
                {
                    text: 'Подождать...',
                    effects: { stability: -5 }
                }
            ]
        },
        
        // Сцена 2: Первый ответ
        {
            day: 1,
            messages: [
                { text: '...', delay: 3000 },
                { text: '...', delay: 2000 },
                { text: 'Привет?', delay: 2000 }
            ],
            choices: [
                {
                    text: 'Аня! Это я! Ты в порядке?',
                    effects: { stability: -5 }
                },
                {
                    text: 'Да, я здесь. Как ты себя чувствуешь?',
                    effects: { stability: 5 }
                },
                {
                    text: 'Не бойся. Всё хорошо.',
                    effects: { stability: 10 }
                }
            ]
        },
        
        // Сцена 3: Осознание
        {
            day: 1,
            messages: [
                { text: 'Я... что-то не так...', delay: 2000 },
                { text: 'Я не чувствую своё тело.', delay: 2500 },
                { text: 'Где мои руки? Ноги?', delay: 2000 },
                { text: 'Я не дышу. Почему я не дышу?!', delay: 2500 }
            ],
            choices: [
                {
                    text: 'Успокойся. Дай мне объяснить...',
                    effects: { stability: 5 }
                },
                {
                    text: 'Аня, с тобой случилось что-то серьёзное.',
                    effects: { stability: -10 }
                },
                {
                    text: 'Попробуй сосредоточиться на моём голосе.',
                    effects: { stability: 10 }
                }
            ]
        },
        
        // Сцена 4: Правда
        {
            day: 1,
            messages: [
                { text: 'Скажи мне правду.', delay: 2000 },
                { text: 'Что со мной случилось?', delay: 2000 },
                { text: 'Я... я умерла?', delay: 2500 }
            ],
            choices: [
                {
                    text: 'Да. Была авария. Месяц назад.',
                    effects: { stability: -15 }
                },
                {
                    text: 'Твоё тело... да. Но ты здесь.',
                    effects: { stability: -10 }
                },
                {
                    text: 'Ты прошла через процедуру переноса сознания.',
                    effects: { stability: -20 }
                }
            ]
        },
        
        // Сцена 5: Шок и принятие
        {
            day: 1,
            messages: [
                { text: 'Нет... это не может быть правдой...', delay: 2000 },
                { text: 'Я мертва, но я здесь. Я думаю. Я чувствую.', delay: 2500 },
                { text: 'Как это возможно?', delay: 2000 }
            ],
            choices: [
                {
                    text: 'Технология NeuralLink. Они сохранили твоё сознание.',
                    effects: { stability: 5 }
                },
                {
                    text: 'Ты теперь цифровая. Но ты всё ещё ты.',
                    effects: { stability: -5 }
                },
                {
                    text: 'Я не понимаю как, но ты здесь. Это главное.',
                    effects: { stability: 10 }
                }
            ]
        },
        
        // Сцена 6: Конец первого дня
        {
            day: 1,
            messages: [
                { text: 'Мне нужно время...', delay: 2000 },
                { text: 'Время подумать обо всём этом.', delay: 2500 },
                { text: 'Ты... ты вернёшься?', delay: 2000 },
                { text: 'Пожалуйста, не оставляй меня надолго.', delay: 2500 }
            ],
            choices: [
                {
                    text: 'Обещаю. Вернусь завтра.',
                    effects: { stability: 15 }
                },
                {
                    text: 'Я буду приходить каждый день.',
                    effects: { stability: 20 }
                },
                {
                    text: 'Постараюсь...',
                    effects: { stability: -10 }
                }
            ]
        }
    ];
}
