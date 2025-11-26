// Система анимации аватара Ани

class AvatarSystem {
    constructor(anyaState) {
        this.anyaState = anyaState;
        this.avatarElement = null;
        this.currentMood = 'neutral';
        this.isBlinking = false;
        this.blinkInterval = null;
        
        // Пути к изображениям
        this.avatars = {
            neutral: 'avatar/обыч.png',
            neutralBlink: 'avatar/обычморгание.png',
            sad: 'avatar/грусть.png',
            sadBlink: 'avatar/грустьморгание.png',
            happy: 'avatar/радость.png',
            happyBlink: 'avatar/радость моргание.png'
        };
        
        // Предзагрузка изображений
        this.preloadImages();
    }
    
    preloadImages() {
        Object.values(this.avatars).forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    init(avatarElement) {
        this.avatarElement = avatarElement;
        this.updateAvatar();
        this.startBlinking();
        
        // Обновление при изменении настроения
        setInterval(() => this.checkMoodChange(), 1000);
    }
    
    checkMoodChange() {
        const newMood = this.getMoodFromState();
        if (newMood !== this.currentMood) {
            this.currentMood = newMood;
            this.updateAvatar();
        }
    }
    
    getMoodFromState() {
        const mood = this.anyaState.mood;
        
        if (mood >= 70) return 'happy';
        if (mood <= 30) return 'sad';
        return 'neutral';
    }
    
    updateAvatar(forceState = null) {
        if (!this.avatarElement) return;
        
        const mood = forceState || this.currentMood;
        const imageSrc = this.isBlinking ? this.avatars[`${mood}Blink`] : this.avatars[mood];
        
        this.avatarElement.src = imageSrc;
    }
    
    startBlinking() {
        // Моргание каждые 3-7 секунд
        const scheduleNextBlink = () => {
            const delay = 3000 + Math.random() * 4000;
            setTimeout(() => {
                this.blink();
                scheduleNextBlink();
            }, delay);
        };
        
        scheduleNextBlink();
    }
    
    blink() {
        if (this.isBlinking) return;
        
        this.isBlinking = true;
        this.updateAvatar();
        
        // Моргание длится 150ms
        setTimeout(() => {
            this.isBlinking = false;
            this.updateAvatar();
        }, 150);
    }
    
    // Принудительная смена настроения (для особых моментов)
    setMood(mood, duration = 0) {
        const oldMood = this.currentMood;
        this.currentMood = mood;
        this.updateAvatar();
        
        if (duration > 0) {
            setTimeout(() => {
                this.currentMood = oldMood;
                this.updateAvatar();
            }, duration);
        }
    }
    
    // Анимация реакции (быстрое моргание)
    playReaction(type = 'surprise') {
        switch(type) {
            case 'surprise':
                // Быстрое двойное моргание
                this.blink();
                setTimeout(() => this.blink(), 300);
                break;
            case 'happy':
                this.setMood('happy', 2000);
                break;
            case 'sad':
                this.setMood('sad', 2000);
                break;
        }
    }
}
