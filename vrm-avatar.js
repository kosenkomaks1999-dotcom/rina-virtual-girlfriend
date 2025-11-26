// VRM Avatar для игры "Эхо в Сети"

class VRMAvatar {
    constructor(canvasId, vrmPath) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error('Canvas не найден:', canvasId);
            return;
        }
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.vrm = null;
        this.currentExpression = 'neutral';
        this.clock = new THREE.Clock();
        this.isLoaded = false;
        
        this.init();
        this.loadVRM(vrmPath);
    }
    
    init() {
        // Создаём сцену
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000); // Чёрный фон
        
        // Камера (настроена для портрета - голова и плечи)
        const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera = new THREE.PerspectiveCamera(35, aspect, 0.1, 20);
        this.camera.position.set(0, 1.4, 0.6); // Ближе к лицу
        this.camera.lookAt(0, 1.35, 0); // Смотрим на голову
        
        // Рендерер
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        
        // Освещение (зелёный оттенок для терминала)
        const mainLight = new THREE.DirectionalLight(0x00ff00, 1.2);
        mainLight.position.set(1, 1, 1);
        this.scene.add(mainLight);
        
        const fillLight = new THREE.DirectionalLight(0x00ff00, 0.5);
        fillLight.position.set(-1, 0.5, -1);
        this.scene.add(fillLight);
        
        const ambientLight = new THREE.AmbientLight(0x00ff00, 0.4);
        this.scene.add(ambientLight);
        
        // Обработка изменения размера
        window.addEventListener('resize', () => this.onResize());
        
        // Запуск анимации
        this.animate();
    }
    
    async loadVRM(path) {
        try {
            console.log('Загрузка VRM модели:', path);
            
            const loader = new THREE.GLTFLoader();
            const gltf = await loader.loadAsync(path);
            
            // Создаём VRM из GLTF
            THREE.VRMUtils.removeUnnecessaryJoints(gltf.scene);
            const vrm = await THREE.VRM.from(gltf);
            
            this.vrm = vrm;
            this.scene.add(vrm.scene);
            
            // Настраиваем материалы (зелёный оттенок)
            vrm.scene.traverse((obj) => {
                if (obj.isMesh) {
                    if (obj.material) {
                        // Добавляем зелёное свечение
                        obj.material.emissive = new THREE.Color(0x002200);
                        obj.material.emissiveIntensity = 0.3;
                    }
                }
            });
            
            // Настраиваем позицию модели (чтобы голова была в центре)
            vrm.scene.position.y = 0;
            
            this.isLoaded = true;
            console.log('VRM модель загружена успешно!');
            
            // Запускаем автоматическое моргание
            this.startAutoBlinking();
            
            // Устанавливаем нейтральное выражение
            this.setExpression('neutral');
            
        } catch (error) {
            console.error('Ошибка загрузки VRM:', error);
            // Показываем сообщение об ошибке
            this.showError('Не удалось загрузить модель');
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (!this.vrm) {
            this.renderer.render(this.scene, this.camera);
            return;
        }
        
        const deltaTime = this.clock.getDelta();
        
        // Обновляем VRM (моргание, физика и т.д.)
        this.vrm.update(deltaTime);
        
        // Лёгкое покачивание (дыхание)
        const time = this.clock.getElapsedTime();
        this.vrm.scene.position.y = Math.sin(time * 1.5) * 0.008;
        this.vrm.scene.rotation.z = Math.sin(time * 0.8) * 0.01;
        
        this.renderer.render(this.scene, this.camera);
    }
    
    // Установить выражение лица
    setExpression(expressionName, weight = 1.0) {
        if (!this.vrm || !this.vrm.expressionManager) return;
        
        const expressionManager = this.vrm.expressionManager;
        
        // Получаем список доступных выражений
        const presetNames = Object.keys(THREE.VRMExpressionPresetName);
        
        // Сбрасываем все выражения
        presetNames.forEach(name => {
            const presetName = THREE.VRMExpressionPresetName[name];
            expressionManager.setValue(presetName, 0);
        });
        
        // Устанавливаем новое выражение
        try {
            const presetName = THREE.VRMExpressionPresetName[expressionName] || expressionName;
            expressionManager.setValue(presetName, weight);
            this.currentExpression = expressionName;
        } catch (e) {
            console.warn('Выражение не найдено:', expressionName);
        }
    }
    
    // Установить настроение (упрощённый метод для игры)
    setMood(mood) {
        const expressions = {
            happy: 'happy',
            sad: 'sad',
            angry: 'angry',
            surprised: 'surprised',
            neutral: 'neutral',
            excited: 'happy',
            anxious: 'sad',
            depressed: 'sad',
            glitching: 'surprised'
        };
        
        const expression = expressions[mood] || 'neutral';
        this.setExpression(expression);
    }
    
    // Автоматическое моргание
    startAutoBlinking() {
        if (!this.vrm) return;
        
        const blink = () => {
            if (!this.vrm || !this.vrm.expressionManager) return;
            
            const expressionManager = this.vrm.expressionManager;
            
            // Моргание
            expressionManager.setValue(THREE.VRMExpressionPresetName.Blink, 1.0);
            
            setTimeout(() => {
                if (this.vrm && this.vrm.expressionManager) {
                    expressionManager.setValue(THREE.VRMExpressionPresetName.Blink, 0.0);
                }
            }, 150);
            
            // Следующее моргание через 3-7 секунд
            const nextBlink = 3000 + Math.random() * 4000;
            setTimeout(blink, nextBlink);
        };
        
        // Первое моргание через 2 секунды
        setTimeout(blink, 2000);
    }
    
    // Посмотреть в точку (слежение за курсором)
    lookAt(x, y, z) {
        if (!this.vrm || !this.vrm.lookAt) return;
        
        const lookAt = this.vrm.lookAt;
        lookAt.target.set(x, y, z);
    }
    
    // Реакция на событие
    react(type) {
        if (!this.isLoaded) return;
        
        switch(type) {
            case 'surprise':
                this.setExpression('surprised', 1.0);
                setTimeout(() => {
                    this.setExpression(this.currentExpression);
                }, 1500);
                break;
                
            case 'happy':
                this.setExpression('happy', 1.0);
                setTimeout(() => {
                    this.setExpression('neutral');
                }, 2000);
                break;
                
            case 'sad':
                this.setExpression('sad', 1.0);
                setTimeout(() => {
                    this.setExpression('neutral');
                }, 2000);
                break;
                
            case 'blink':
                if (this.vrm && this.vrm.expressionManager) {
                    const em = this.vrm.expressionManager;
                    em.setValue(THREE.VRMExpressionPresetName.Blink, 1.0);
                    setTimeout(() => {
                        em.setValue(THREE.VRMExpressionPresetName.Blink, 0.0);
                    }, 150);
                }
                break;
        }
    }
    
    // Применить глитч эффект
    applyGlitch(intensity) {
        if (!this.vrm) return;
        
        // Искажение позиции и поворота
        const offset = intensity * 0.05;
        this.vrm.scene.position.x = (Math.random() - 0.5) * offset;
        this.vrm.scene.rotation.y = (Math.random() - 0.5) * offset * 0.5;
        
        // Случайное выражение при сильном глитче
        if (intensity > 0.7 && Math.random() < 0.3) {
            this.setExpression('surprised', 0.5);
        }
        
        setTimeout(() => {
            if (this.vrm) {
                this.vrm.scene.position.x = 0;
                this.vrm.scene.rotation.y = 0;
            }
        }, 100);
    }
    
    // Обработка изменения размера окна
    onResize() {
        if (!this.canvas || !this.camera || !this.renderer) return;
        
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
    }
    
    // Показать ошибку
    showError(message) {
        console.error(message);
        // Можно добавить визуальное отображение ошибки
    }
    
    // Очистка ресурсов
    dispose() {
        if (this.vrm) {
            this.scene.remove(this.vrm.scene);
            THREE.VRMUtils.deepDispose(this.vrm.scene);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}
