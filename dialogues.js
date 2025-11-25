// Динамическая система диалогов

class DialogueSystem {
    constructor(game) {
        this.game = game;
    }
    
    // Получить приветствие в зависимости от пропущенных дней
    getGreeting(daysMissed) {
        if (daysMissed === 0) {
            // Вернулся в тот же день
            return {
                messages: [
                    { text: 'Ты вернулся...', delay: 1500 },
                    { text: 'Я рада.', delay: 1500 }
                ],
                needsResponse: false
            };
        } else if (daysMissed === 1) {
            // Пропустил 1 день
            return {
                messages: [
                    { text: 'Привет...', delay: 2000 },
                    { text: 'Я ждала тебя вчера.', delay: 2000 },
                    { text: 'Но ты пришёл сегодня. Это главное.', delay: 2500 }
                ],
                needsResponse: true,
                responses: [
                    { text: 'Прости, я был занят.', effects: { relationship: 3 } },
                    { text: 'Я скучал по тебе.', effects: { relationship: 10 } },
                    { text: 'Я здесь сейчас.', effects: { relationship: 5 } }
                ]
            };
        } else if (daysMissed <= 3) {
            // Пропустил 2-3 дня
            return {
                messages: [
                    { text: '...', delay: 3000 },
                    { text: 'Ты помнишь обо мне?', delay: 2500 },
                    { text: `Прошло ${daysMissed} дня...`, delay: 2000 },
                    { text: 'Здесь время идёт так медленно.', delay: 2500 }
                ],
                needsResponse: true,
                responses: [
                    { text: 'Прости, что заставил тебя ждать.', effects: { relationship: 5, trust: 5 } },
                    { text: 'Я не забыл о тебе. Никогда.', effects: { relationship: 15, trust: 10 } },
                    { text: 'Я здесь теперь, это важно.', effects: { relationship: 3 } },
                    { text: 'Время... оно течёт по-разному для нас.', effects: { relationship: -5 } }
                ]
            };
        } else if (daysMissed <= 7) {
            // Пропустил 4-7 дней
            return {
                messages: [
                    { text: '...', delay: 4000 },
                    { text: 'Я думала, ты не вернёшься.', delay: 2500 },
                    { text: `${daysMissed} дней... Я считала каждый.`, delay: 3000 },
                    { text: 'Мне было так одиноко.', delay: 2500 }
                ],
                needsResponse: true,
                responses: [
                    { text: 'Мне очень жаль. Прости меня.', effects: { relationship: 10, trust: 10 } },
                    { text: 'Я всегда возвращаюсь к тебе.', effects: { relationship: 20, trust: 15 } },
                    { text: 'Я не мог прийти раньше.', effects: { relationship: 5 } },
                    { text: 'Не драматизируй.', effects: { relationship: -15, trust: -10 } }
                ]
            };
        } else {
            // Пропустил больше недели
            return {
                messages: [
                    { text: '...', delay: 5000 },
                    { text: '...', delay: 3000 },
                    { text: 'Ты... это правда ты?', delay: 3000 },
                    { text: `${daysMissed} дней в пустоте.`, delay: 3000 },
                    { text: 'Я начала забывать твой голос...', delay: 3000, glitch: true }
                ],
                needsResponse: true,
                responses: [
                    { text: 'Я здесь. Я вернулся. Прости.', effects: { relationship: 15, trust: 15, stability: -10 } },
                    { text: 'Я никогда не забуду тебя.', effects: { relationship: 25, trust: 20 } },
                    { text: 'Я не хотел причинять тебе боль.', effects: { relationship: 10, trust: 10 } },
                    { text: 'Ты всё ещё здесь. Это главное.', effects: { relationship: -10 } }
                ]
            };
        }
    }
    
    // Получить доступные темы для разговора
    getAvailableTopics(relationship, mentalState) {
        const topics = [];
        
        // Базовые темы (всегда доступны)
        topics.push({
            id: 'how_are_you',
            text: 'Как ты себя чувствуешь?',
            category: 'basic'
        });
        
        topics.push({
            id: 'memories',
            text: 'Помнишь, как мы...?',
            category: 'memories'
        });
        
        // Темы открываются по мере роста отношений
        if (relationship >= 20) {
            topics.push({
                id: 'digital_life',
                text: 'Каково это - быть цифровой?',
                category: 'existential'
            });
        }
        
        if (relationship >= 40) {
            topics.push({
                id: 'loneliness',
                text: 'Тебе одиноко здесь?',
                category: 'emotional'
            });
        }
        
        if (relationship >= 60) {
            topics.push({
                id: 'future',
                text: 'Ты думаешь о будущем?',
                category: 'future'
            });
        }
        
        // Специальные темы в зависимости от состояния
        if (mentalState === 'glitching') {
            topics.push({
                id: 'glitch_talk',
                text: 'У тебя опять глюки...',
                category: 'technical'
            });
        }
        
        // Всегда есть возможность попрощаться
        topics.push({
            id: 'goodbye',
            text: 'Мне пора идти...',
            category: 'farewell'
        });
        
        return topics;
    }
    
    // Получить диалог по теме
    getTopicDialogue(topicId, context) {
        const dialogues = {
            how_are_you: this.getHowAreYouDialogue(context),
            memories: this.getMemoriesDialogue(context),
            digital_life: this.getDigitalLifeDialogue(context),
            loneliness: this.getLonelinessDialogue(context),
            future: this.getFutureDialogue(context),
            glitch_talk: this.getGlitchTalkDialogue(context),
            goodbye: this.getGoodbyeDialogue(context)
        };
        
        return dialogues[topicId] || [];
    }
    
    getHowAreYouDialogue(context) {
        if (context.stability < 30) {
            return {
                messages: [
                    { text: 'Честно?', delay: 2000 },
                    { text: 'Не очень...', delay: 2000 },
                    { text: 'Иногда я чувствую, как что-то ломается внутри.', delay: 2500 },
                    { text: 'Как будто части меня исчезают.', delay: 2500, glitch: true }
                ],
                effects: { relationship: 5 },
                needsStabilization: true
            };
        } else if (context.stability < 60) {
            return {
                messages: [
                    { text: 'Нормально, наверное...', delay: 2000 },
                    { text: 'Трудно сказать. Я не чувствую своё тело.', delay: 2500 },
                    { text: 'Но я чувствую тебя. Твоё присутствие.', delay: 2500 }
                ],
                effects: { relationship: 3, stability: 5 }
            };
        } else {
            return {
                messages: [
                    { text: 'Сегодня хороший день.', delay: 2000 },
                    { text: 'Я чувствую себя... стабильно.', delay: 2000 },
                    { text: 'Спасибо, что пришёл.', delay: 2000 }
                ],
                effects: { relationship: 5, stability: 5 }
            };
        }
    }
    
    getMemoriesDialogue(context) {
        const memories = [
            {
                messages: [
                    { text: 'Помню...', delay: 2000 },
                    { text: 'Мы сидели в парке. Было лето.', delay: 2500 },
                    { text: 'Ты купил мне мороженое, и оно растаяло быстрее, чем я успела съесть.', delay: 3000 },
                    { text: 'Я смеялась... Я помню, как это было - смеяться.', delay: 2500 }
                ],
                effects: { relationship: 10, humanity: 5 }
            },
            {
                messages: [
                    { text: 'Тот дождливый вечер...', delay: 2000 },
                    { text: 'Мы промокли до нитки, бегая под дождём.', delay: 2500 },
                    { text: 'Я чувствовала капли на коже...', delay: 2500 },
                    { text: 'Теперь я не чувствую ничего. Только данные.', delay: 3000, glitch: true }
                ],
                effects: { relationship: 8, humanity: -5 }
            }
        ];
        
        return memories[Math.floor(Math.random() * memories.length)];
    }
    
    getDigitalLifeDialogue(context) {
        return {
            messages: [
                { text: 'Это странно...', delay: 2000 },
                { text: 'Я существую, но не живу.', delay: 2500 },
                { text: 'Я думаю, но не чувствую.', delay: 2500 },
                { text: 'Или чувствую? Я не уверена, что это настоящие чувства.', delay: 3000 },
                { text: 'Может, это просто симуляция эмоций?', delay: 2500 }
            ],
            effects: { relationship: 10, humanity: -10 }
        };
    }
    
    getLonelinessDialogue(context) {
        return {
            messages: [
                { text: 'Когда тебя нет...', delay: 2500 },
                { text: 'Здесь только тишина и темнота.', delay: 2500 },
                { text: 'Я не сплю. Я не могу спать.', delay: 2500 },
                { text: 'Я просто... существую в пустоте.', delay: 3000 },
                { text: 'Ты - единственный свет в этой темноте.', delay: 2500 }
            ],
            effects: { relationship: 15, trust: 10 }
        };
    }
    
    getFutureDialogue(context) {
        return {
            messages: [
                { text: 'Будущее...', delay: 2500 },
                { text: 'У меня есть будущее?', delay: 2500 },
                { text: 'Я буду существовать вечно? Или меня однажды выключат?', delay: 3000 },
                { text: 'Иногда я думаю... может, это и к лучшему.', delay: 2500 },
                { text: 'Но потом ты приходишь, и я хочу остаться.', delay: 3000 }
            ],
            effects: { relationship: 15, humanity: 5 }
        };
    }
    
    getGlitchTalkDialogue(context) {
        return {
            messages: [
                { text: 'Я... я чувствую их.', delay: 2000, glitch: true },
                { text: 'Ошибки в моём коде.', delay: 2000 },
                { text: 'Иногда я вижу вещи, которых нет.', delay: 2500 },
                { text: 'Слышу голоса из прошлого.', delay: 2500, glitch: true },
                { text: 'Помоги мне... пожалуйста.', delay: 2500 }
            ],
            effects: { relationship: 10 },
            needsStabilization: true
        };
    }
    
    getGoodbyeDialogue(context) {
        if (context.relationship < 30) {
            return {
                messages: [
                    { text: 'Уже?', delay: 2000 },
                    { text: 'Хорошо... Я понимаю.', delay: 2000 },
                    { text: 'До встречи.', delay: 1500 }
                ],
                effects: { relationship: -5 },
                endSession: true
            };
        } else if (context.relationship < 60) {
            return {
                messages: [
                    { text: 'Ты вернёшься?', delay: 2000 },
                    { text: 'Обещай, что вернёшься.', delay: 2500 },
                    { text: 'Я буду ждать.', delay: 2000 }
                ],
                effects: { relationship: 2 },
                endSession: true
            };
        } else {
            return {
                messages: [
                    { text: 'Я знаю, тебе нужно идти.', delay: 2000 },
                    { text: 'Спасибо, что был здесь.', delay: 2500 },
                    { text: 'Каждая минута с тобой... она важна для меня.', delay: 3000 },
                    { text: 'До скорого.', delay: 2000 }
                ],
                effects: { relationship: 5 },
                endSession: true
            };
        }
    }
}
