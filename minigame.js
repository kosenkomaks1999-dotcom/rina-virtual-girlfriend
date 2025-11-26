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
            x: Math.random() * (this.canvas.width - 100) + 50,
            y: -70,
            width: 95,
            height: 55,
            speed: 40 + Math.random() * 20, // Пикселей в секунду (медленнее для читаемости)
            isError: isError,
            text: isError ? this.getErrorText() : this.getSafeText(),
            clicked: false,
            alpha: 1
        };
        
        this.blocks.push(block);
    }
    
    getErrorText() {
        const errors = [
            // Системные ошибки
            'ERR_NULL_PTR\n0x00000000',
            'SEGFAULT\nCore dumped',
            'STACK_OVFL\n0xDEADBEEF',
            'MEM_CORRUPT\nHeap error',
            'PANIC: CPU\nHalted',
            'KERNEL_TRAP\n0x0000007F',
            'BUS_ERROR\nAddr:0xFF3A',
            'ILLEGAL_OP\nCPU fault',
            
            // Ошибки памяти
            'OUT_OF_MEM\nAlloc fail',
            'BAD_ALLOC\n0xBADC0DE',
            'LEAK_DETECT\n512KB lost',
            'DOUBLE_FREE\nptr:0x7F3A',
            'PAGE_FAULT\n0xC0000005',
            'ACCESS_VIOL\nRead:NULL',
            
            // Ошибки данных
            'DATA_CORRUP\nCRC fail',
            'CHECKSUM_ER\n0xFFFFFFFF',
            'INVALID_DAT\nByte:0xFE',
            'PARSE_ERROR\nLine:1337',
            'BAD_FORMAT\nUnknown',
            'DECODE_FAIL\nStream err',
            
            // Критические ошибки
            'FATAL_ERROR\nAbort()',
            'ASSERT_FAIL\nfile.c:42',
            'EXCEPTION\nUnhandled',
            'CRITICAL\nSys halt',
            'DEADLOCK\nThread:0x2',
            'RACE_COND\nData race',
            
            // Ошибки сознания Ани
            'MEMORY_LOSS\nFragment',
            'NEURAL_ERR\nSynapse',
            'IDENTITY_?\nCorrupted',
            'EMOTION_ERR\nInvalid',
            'THOUGHT_BRK\nIncomplete'
        ];
        return errors[Math.floor(Math.random() * errors.length)];
    }
    
    getSafeText() {
        const safe = [
            // Системные данные
            'SYS_INIT\n0x00400000',
            'BOOT_OK\nv2.47.3',
            'KERNEL_LOAD\n4096KB',
            'DRIVER_OK\nLoaded',
            'BIOS_CHECK\nPassed',
            'POST_OK\nAll tests',
            
            // Память
            'MEM_ALLOC\n0x7F000000',
            'HEAP_OK\n2048KB',
            'STACK_OK\nNo ovfl',
            'CACHE_HIT\n98.7%',
            'PAGE_TABLE\nMapped',
            'VIRTUAL_MEM\n4GB',
            
            // Процессы
            'PROC_RUN\nPID:1337',
            'THREAD_OK\nID:0x42',
            'SYNC_OK\nLock free',
            'SCHED_OK\nCPU:45%',
            'CONTEXT_SW\n120/sec',
            'PRIORITY\nNormal',
            
            // Данные
            'DATA_OK\nCRC:valid',
            'READ_OK\n512 bytes',
            'WRITE_OK\nSync done',
            'LOAD_OK\nBuf full',
            'BUFFER_OK\n4KB',
            'STREAM_OK\nActive',
            
            // Сеть
            'NET_CONN\n192.168.1',
            'PING_OK\n12ms',
            'PACKET_OK\nNo loss',
            'SOCKET_OK\n:8080',
            'TCP_ESTAB\nPort:443',
            'BANDWIDTH\n100Mbps',
            
            // Файловая система
            'FS_MOUNT\n/dev/sda1',
            'INODE_OK\n#123456',
            'FILE_OK\n4KB',
            'DIR_OK\n/home',
            'DISK_OK\n500GB',
            'JOURNAL_OK\nClean',
            
            // Сознание Ани
            'MEMORY_OK\nIntact',
            'NEURAL_NET\nStable',
            'EMOTION_OK\nNormal',
            'THOUGHT_OK\nClear',
            'IDENTITY\nAnya',
            'CONSCIOUS\nActive'
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
                
                // Фон блока с градиентом
                const gradient = this.ctx.createLinearGradient(
                    block.x, block.y, 
                    block.x, block.y + block.height
                );
                
                if (block.isError) {
                    gradient.addColorStop(0, '#ff0000');
                    gradient.addColorStop(1, '#cc0000');
                } else {
                    gradient.addColorStop(0, '#00ff00');
                    gradient.addColorStop(1, '#00cc00');
                }
                
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(block.x, block.y, block.width, block.height);
                
                // Рамка с эффектом свечения
                this.ctx.strokeStyle = block.isError ? '#ff6666' : '#66ff66';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(block.x, block.y, block.width, block.height);
                
                // Внутренняя тень для глубины
                this.ctx.strokeStyle = block.isError ? '#880000' : '#008800';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(block.x + 1, block.y + 1, block.width - 2, block.height - 2);
                
                // Текст (многострочный, крупный)
                this.ctx.fillStyle = '#000';
                this.ctx.font = 'bold 13px VT323';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                
                // Разбиваем текст на строки
                const lines = block.text.split('\n');
                const lineHeight = 16;
                const startY = block.y + block.height/2 - (lines.length - 1) * lineHeight / 2;
                
                lines.forEach((line, index) => {
                    // Рисуем текст с тенью для лучшей читаемости
                    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                    this.ctx.shadowBlur = 2;
                    this.ctx.fillText(line, block.x + block.width/2, startY + index * lineHeight);
                });
                
                // Сбрасываем тень
                this.ctx.shadowBlur = 0;
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
