// Мини-игра: Очистка данных

class DataCleanupGame {
    constructor(onSuccess) {
        this.onSuccess = onSuccess;
        this.blocks = [];
        this.score = 0;
        this.errors = 0;
        this.maxErrors = 3;
        this.targetScore = 15;
        this.canvas = null;
        this.ctx = null;
        this.gameActive = true;
        this.spawnTimer = 0;
        this.spawnInterval = 1000; // Каждую секунду (в миллисекундах)
        this.lastTime = 0;
        this.lastSpawnTime = 0;
        
        this.init();
    }
    
    init() {
        // Создаём overlay для игры
        const overlay = document.createElement('div');
        overlay.id = 'minigameOverlay';
        overlay.className = 'minigame-overlay';
        overlay.innerHTML = `
            <div class="minigame-container">
                <div class="minigame-header">
                    <h2>ОЧИСТКА ПОВРЕЖДЁННЫХ ДАННЫХ</h2>
                    <div class="minigame-stats">
                        <div class="stat">
                            <span>Очищено:</span>
                            <span id="scoreCount" class="stat-value">0/${this.targetScore}</span>
                        </div>
                        <div class="stat">
                            <span>Ошибки:</span>
                            <span id="errorCount" class="stat-value error">0/${this.maxErrors}</span>
                        </div>
                    </div>
                </div>
                <canvas id="dataCanvas" width="320" height="240"></canvas>
                <div class="minigame-hint">
                    <span class="error-hint">🔴 Кликай по КРАСНЫМ (ошибки)</span>
                    <span class="safe-hint">🟢 НЕ трогай ЗЕЛЁНЫЕ (данные)</span>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        this.canvas = document.getElementById('dataCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.setupEvents();
        this.animate();
    }
    
    setupEvents() {
        this.canvas.addEventListener('click', (e) => {
            if (!this.gameActive) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.handleClick(x, y);
        });
    }
    
    spawnBlock() {
        const isError = Math.random() < 0.6; // 60% шанс ошибки
        
        const block = {
            x: Math.random() * (this.canvas.width - 80) + 40,
            y: -50,
            width: 60,
            height: 40,
            speed: 50 + Math.random() * 30, // Пикселей в секунду
            isError: isError,
            text: isError ? this.getErrorText() : this.getSafeText(),
            clicked: false,
            alpha: 1
        };
        
        this.blocks.push(block);
    }
    
    getErrorText() {
        const errors = [
            'ERROR',
            'NULL',
            'CORRUPT',
            '0x7F3A',
            'FAIL',
            'CRASH',
            'BROKEN',
            'INVALID'
        ];
        return errors[Math.floor(Math.random() * errors.length)];
    }
    
    getSafeText() {
        const safe = [
            'DATA',
            'MEMORY',
            'SYNC',
            'LOAD',
            'SAVE',
            'READ',
            'WRITE',
            'OK'
        ];
        return safe[Math.floor(Math.random() * safe.length)];
    }
    
    handleClick(x, y) {
        for (let i = this.blocks.length - 1; i >= 0; i--) {
            const block = this.blocks[i];
            
            if (block.clicked) continue;
            
            if (x >= block.x && x <= block.x + block.width &&
                y >= block.y && y <= block.y + block.height) {
                
                block.clicked = true;
                
                if (block.isError) {
                    // Правильно! Кликнули по ошибке
                    this.score++;
                    document.getElementById('scoreCount').textContent = 
                        `${this.score}/${this.targetScore}`;
                    
                    // Эффект успеха
                    this.createParticles(block.x + block.width/2, block.y + block.height/2, '#00ff00');
                    
                    if (this.score >= this.targetScore) {
                        this.win();
                    }
                } else {
                    // Ошибка! Кликнули по нормальным данным
                    this.errors++;
                    document.getElementById('errorCount').textContent = 
                        `${this.errors}/${this.maxErrors}`;
                    
                    // Эффект ошибки
                    this.createParticles(block.x + block.width/2, block.y + block.height/2, '#ff0000');
                    
                    if (this.errors >= this.maxErrors) {
                        this.lose();
                    }
                }
                
                break;
            }
        }
    }
    
    createParticles(x, y, color) {
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const speed = 3;
            
            this.blocks.push({
                x: x,
                y: y,
                width: 4,
                height: 4,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                isParticle: true,
                color: color,
                alpha: 1,
                life: 30
            });
        }
    }
    
    animate(currentTime = 0) {
        if (!this.gameActive) return;
        
        // Вычисляем deltaTime (время между кадрами в секундах)
        if (this.lastTime === 0) this.lastTime = currentTime;
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // Очистка
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Спавн новых блоков (на основе времени, а не кадров)
        if (currentTime - this.lastSpawnTime >= this.spawnInterval) {
            this.spawnBlock();
            this.lastSpawnTime = currentTime;
            // Ускоряем со временем
            this.spawnInterval = Math.max(500, this.spawnInterval - 20);
        }
        
        // Обновление и отрисовка блоков
        for (let i = this.blocks.length - 1; i >= 0; i--) {
            const block = this.blocks[i];
            
            if (block.isParticle) {
                // Частицы
                block.x += block.vx * deltaTime * 60;
                block.y += block.vy * deltaTime * 60;
                block.life -= deltaTime * 60;
                block.alpha = block.life / 30;
                
                if (block.life <= 0) {
                    this.blocks.splice(i, 1);
                    continue;
                }
                
                this.ctx.fillStyle = block.color;
                this.ctx.globalAlpha = block.alpha;
                this.ctx.fillRect(block.x, block.y, block.width, block.height);
                this.ctx.globalAlpha = 1;
            } else {
                // Обычные блоки
                if (!block.clicked) {
                    block.y += block.speed * deltaTime;
                    
                    // Удаляем если вышли за экран
                    if (block.y > this.canvas.height) {
                        if (block.isError) {
                            // Пропустили ошибку - это плохо
                            this.errors++;
                            document.getElementById('errorCount').textContent = 
                                `${this.errors}/${this.maxErrors}`;
                            
                            if (this.errors >= this.maxErrors) {
                                this.lose();
                            }
                        }
                        this.blocks.splice(i, 1);
                        continue;
                    }
                } else {
                    // Исчезновение после клика
                    block.alpha -= 0.1;
                    if (block.alpha <= 0) {
                        this.blocks.splice(i, 1);
                        continue;
                    }
                }
                
                // Отрисовка блока
                this.ctx.globalAlpha = block.alpha;
                
                // Фон блока
                this.ctx.fillStyle = block.isError ? '#ff0000' : '#00ff00';
                this.ctx.fillRect(block.x, block.y, block.width, block.height);
                
                // Рамка
                this.ctx.strokeStyle = block.isError ? '#ff6666' : '#66ff66';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(block.x, block.y, block.width, block.height);
                
                // Текст
                this.ctx.fillStyle = '#000';
                this.ctx.font = '10px VT323';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(block.text, block.x + block.width/2, block.y + block.height/2);
                
                this.ctx.globalAlpha = 1;
            }
        }
        
        requestAnimationFrame((time) => this.animate(time));
    }
    
    win() {
        this.gameActive = false;
        
        // Эффект победы
        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '40px VT323';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('ДАННЫЕ ОЧИЩЕНЫ', this.canvas.width/2, this.canvas.height/2);
        
        setTimeout(() => {
            document.getElementById('minigameOverlay').remove();
            if (this.onSuccess) {
                this.onSuccess();
            }
        }, 1500);
    }
    
    lose() {
        this.gameActive = false;
        
        // Эффект поражения
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#ff0000';
        this.ctx.font = '40px VT323';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('КРИТИЧЕСКАЯ ОШИБКА', this.canvas.width/2, this.canvas.height/2 - 20);
        
        this.ctx.font = '20px VT323';
        this.ctx.fillText('Попробуйте снова', this.canvas.width/2, this.canvas.height/2 + 20);
        
        setTimeout(() => {
            document.getElementById('minigameOverlay').remove();
            // Перезапускаем игру
            new DataCleanupGame(this.onSuccess);
        }, 2000);
    }
}

// Функция запуска мини-игры
function startDataCleanup(onSuccess) {
    new DataCleanupGame(onSuccess);
}
