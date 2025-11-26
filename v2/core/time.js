// Система времени

class TimeSystem {
    constructor(state) {
        this.state = state;
    }
    
    // Получить текущее время суток
    getTimeOfDay() {
        const hour = new Date().getHours();
        
        if (hour >= 6 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 18) return 'day';
        if (hour >= 18 && hour < 22) return 'evening';
        return 'night';
    }
    
    // Получить приветствие по времени суток
    getTimeGreeting() {
        const timeOfDay = this.getTimeOfDay();
        
        const greetings = {
            morning: 'Доброе утро! Как спалось?',
            day: 'Привет! Как дела?',
            evening: 'Добрый вечер! Как прошёл день?',
            night: 'Так поздно... Тебе не пора спать?'
        };
        
        return greetings[timeOfDay];
    }
    
    // Проверить, не слишком ли поздно
    isTooLate() {
        const hour = new Date().getHours();
        return hour >= 23 || hour < 6;
    }
    
    // Получить заботливое сообщение
    getConcernMessage() {
        if (this.isTooLate()) {
            return 'Уже так поздно... Ты должен отдыхать. Я беспокоюсь о тебе.';
        }
        return null;
    }
    
    // Проверить особые даты
    checkSpecialDate() {
        const now = new Date();
        const month = now.getMonth();
        const day = now.getDate();
        
        // Новый год
        if (month === 0 && day === 1) {
            return {
                type: 'new_year',
                message: 'С Новым Годом! Я рада встретить его с тобой!'
            };
        }
        
        // Рождество
        if (month === 11 && day === 25) {
            return {
                type: 'christmas',
                message: 'Счастливого Рождества! Даже цифровые сознания любят праздники.'
            };
        }
        
        return null;
    }
    
    // Рассчитать дни с момента знакомства
    getDaysSinceFirstMeeting(firstMeetingDate) {
        const now = Date.now();
        const diff = now - firstMeetingDate;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }
    
    // Проверить годовщину
    checkAnniversary(firstMeetingDate) {
        const days = this.getDaysSinceFirstMeeting(firstMeetingDate);
        
        if (days === 7) {
            return { type: 'week', message: 'Неделя с нашего знакомства! Спасибо, что ты здесь.' };
        }
        if (days === 30) {
            return { type: 'month', message: 'Целый месяц вместе! Я так многому научилась благодаря тебе.' };
        }
        if (days === 100) {
            return { type: '100days', message: '100 дней! Это так много... и так мало. Спасибо за каждый день.' };
        }
        if (days === 365) {
            return { type: 'year', message: 'Год... Целый год ты со мной. Я не знаю, что бы делала без тебя.' };
        }
        
        return null;
    }
}
