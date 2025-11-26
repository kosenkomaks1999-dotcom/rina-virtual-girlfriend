// VRM Avatar - простая версия без ES модулей
// Использует глобальные переменные THREE и VRM из CDN

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
        console.log('Инициализация VRM Avatar...');
        
        // Создаём сцену
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        
        // Камера (портрет - голова и плечи)
        const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera = new THREE.PerspectiveCamera(35, aspect, 0.1, 20);
        this.camera.position.set(0, 1.4, 0.6);
        this.camera.lookAt(0, 1.35, 0);
        
        // Рендерер
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Освещение (более яркое и цветное)
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.5); // Белый свет
        mainLight.position.set(1, 1, 1);
        this.scene.add(mainLight);
        
        const fillLight = new THREE.DirectionalLight(0x88ccff, 0.8); // Голубоватый
        fillLight.position.set(-1, 0.5, -1);
        this.scene.add(fillLight);
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Яркий ambient
        this.scene.add(ambientLight);
        
        // Подсветка сзади для объёма
        const backLight = new THREE.DirectionalLight(0x00ff88, 0.4); // Зелёный акцент
        backLight.position.set(0, 1, -1);
        this.scene.add(backLight);
        
        // Обработка изменения размера
        window.addEventListener('resize', () => this.onResize());
        
        // Запуск анимации
        this.animate();
        
        console.log('VRM Avatar инициализирован');
    }
    
    async loadVRM(path) {
        try {
            console.log('Загрузка VRM модели:', path);
            
            // Проверяем наличие необходимых библиотек
            if (typeof THREE === 'undefined') {
                throw new Error('THREE.js не загружен');
            }
            if (typeof THREE.GLTFLoader === 'undefined') {
                throw new Error('GLTFLoader не загружен');
            }
            if (typeof THREE.VRM === 'undefined') {
                throw new Error('VRM библиотека не загружена');
            }
            
            const loader = new THREE.GLTFLoader();
            
            loader.load(
                path,
                async (gltf) => {
                    console.log('GLTF загружен, создание VRM...');
                    
                    // Создаём VRM
                    THREE.VRMUtils.removeUnnecessaryJoints(gltf.scene);
                    const vrm = await THREE.VRM.from(gltf);
                    
                    this.vrm = vrm;
                    this.scene.add(vrm.scene);
                    
                    // Поворачиваем модель лицом к камере
                    vrm.scene.rotation.y = Math.PI; // 180 градусов
                    
                    // Опускаем модель ниже, чтобы голова была видна полностью
                    vrm.scene.position.y = -0.08; // Опускаем на 8 см
                    
                    // Убираем T-позу - опускаем руки
                    this.setPose(vrm);
                    
                    // Настраиваем материалы (убираем зелёный оттенок, делаем ярче)
                    vrm.scene.traverse((obj) => {
                        if (obj.isMesh && obj.material) {
                            // Убираем зелёное свечение
                            obj.material.emissive = new THREE.Color(0x000000);
                            obj.material.emissiveIntensity = 0;
                            
                            // Делаем материалы ярче
                            if (obj.material.color) {
                                obj.material.color.multiplyScalar(1.2); // +20% яркости
                            }
                        }
                    });
                    
                    this.isLoaded = true;
                    console.log('✅ VRM модель загружена успешно!');
                    
                    // Скрываем индикатор загрузки
                    const loading = document.getElementById('vrmLoading');
                    if (loading) {
                        loading.classList.add('hidden');
                    }
                    
                    // Проверяем доступные выражения
                    console.log('Доступные выражения:', vrm.blendShapeProxy ? Object.keys(vrm.blendShapeProxy._blendShapeGroups) : 'нет');
                    
                    // Запускаем автоматическое моргание
                    this.startAutoBlinking();
                    
                    // Устанавливаем нейтральное выражение
                    this.setExpression('neutral');
                },
                (progress) => {
                    const percent = (progress.loaded / progress.total * 100).toFixed(0);
                    console.log(`Загрузка VRM: ${percent}%`);
                },
                (error) => {
                    console.error('Ошибка загрузки VRM:', error);
                    this.showError('Не удалось загрузить модель');
                }
            );
            
        } catch (error) {
            console.error('Ошибка загрузки VRM:', error);
            this.showError(error.message);
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (!this.vrm) {
            this.renderer.render(this.scene, this.camera);
            return;
        }
        
        const deltaTime = this.clock.getDelta();
        
        // Обновляем VRM
        this.vrm.update(deltaTime);
        
        // Лёгкое покачивание (дыхание) - с учётом базовой позиции
        const time = this.clock.getElapsedTime();
        this.vrm.scene.position.y = -0.08 + Math.sin(time * 1.5) * 0.008;
        this.vrm.scene.rotation.z = Math.sin(time * 0.8) * 0.01;
        
        this.renderer.render(this.scene, this.camera);
    }
    
    setExpression(expressionName, weight = 1.0) {
        if (!this.vrm || !this.vrm.expressionManager) return;
        
        const expressionManager = this.vrm.expressionManager;
        
        // Сбрасываем все выражения
        const presetNames = Object.keys(THREE.VRMSchema.ExpressionPresetName);
        presetNames.forEach(name => {
            try {
                expressionManager.setValue(name, 0);
            } catch (e) {}
        });
        
        // Устанавливаем новое выражение
        try {
            expressionManager.setValue(expressionName, weight);
            this.currentExpression = expressionName;
        } catch (e) {
            console.warn('Выражение не найдено:', expressionName);
        }
    }
    
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
    
    setPose(vrm) {
        // Опускаем руки из T-позы полностью вниз
        const humanoid = vrm.humanoid;
        if (!humanoid) return;
        
        try {
            // Левая рука - опускаем сильнее
            const leftUpperArm = humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.LeftUpperArm);
            const leftLowerArm = humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.LeftLowerArm);
            const leftHand = humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.LeftHand);
            
            if (leftUpperArm) {
                leftUpperArm.rotation.z = 0.8; // Сильно опускаем плечо
                leftUpperArm.rotation.x = 0.1; // Немного вперёд
            }
            if (leftLowerArm) {
                leftLowerArm.rotation.z = -0.1; // Почти прямо
            }
            if (leftHand) {
                leftHand.rotation.z = 0.1; // Расслабленная кисть
            }
            
            // Правая рука - опускаем сильнее
            const rightUpperArm = humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightUpperArm);
            const rightLowerArm = humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightLowerArm);
            const rightHand = humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.RightHand);
            
            if (rightUpperArm) {
                rightUpperArm.rotation.z = -0.8; // Сильно опускаем плечо
                rightUpperArm.rotation.x = 0.1; // Немного вперёд
            }
            if (rightLowerArm) {
                rightLowerArm.rotation.z = 0.1; // Почти прямо
            }
            if (rightHand) {
                rightHand.rotation.z = -0.1; // Расслабленная кисть
            }
            
            console.log('✅ Поза установлена (руки опущены)');
        } catch (e) {
            console.warn('Не удалось установить позу:', e);
        }
    }
    
    startAutoBlinking() {
        if (!this.vrm) return;
        
        const blink = () => {
            if (!this.vrm) return;
            
            // Пробуем разные способы моргания
            let blinkSuccess = false;
            
            // Способ 1: через blendShapeProxy (старая версия VRM)
            if (this.vrm.blendShapeProxy) {
                try {
                    this.vrm.blendShapeProxy.setValue('blink', 1.0);
                    blinkSuccess = true;
                    
                    setTimeout(() => {
                        if (this.vrm && this.vrm.blendShapeProxy) {
                            this.vrm.blendShapeProxy.setValue('blink', 0.0);
                        }
                    }, 150);
                } catch (e) {
                    // Пробуем другие названия
                    const blinkNames = ['Blink', 'blink', 'BLINK', 'blink_both'];
                    for (let name of blinkNames) {
                        try {
                            this.vrm.blendShapeProxy.setValue(name, 1.0);
                            blinkSuccess = true;
                            setTimeout(() => {
                                if (this.vrm && this.vrm.blendShapeProxy) {
                                    this.vrm.blendShapeProxy.setValue(name, 0.0);
                                }
                            }, 150);
                            break;
                        } catch (e2) {}
                    }
                }
            }
            
            // Способ 2: через expressionManager (новая версия)
            if (!blinkSuccess && this.vrm.expressionManager) {
                try {
                    this.vrm.expressionManager.setValue('blink', 1.0);
                    blinkSuccess = true;
                    
                    setTimeout(() => {
                        if (this.vrm && this.vrm.expressionManager) {
                            this.vrm.expressionManager.setValue('blink', 0.0);
                        }
                    }, 150);
                } catch (e) {}
            }
            
            if (!blinkSuccess) {
                console.warn('Моргание не поддерживается этой моделью');
            }
            
            const nextBlink = 3000 + Math.random() * 4000;
            setTimeout(blink, nextBlink);
        };
        
        setTimeout(blink, 2000);
    }
    
    lookAt(x, y, z) {
        if (!this.vrm || !this.vrm.lookAt) return;
        this.vrm.lookAt.target.set(x, y, z);
    }
    
    react(type) {
        if (!this.isLoaded) return;
        
        switch(type) {
            case 'surprise':
                this.setExpression('surprised', 1.0);
                setTimeout(() => this.setExpression(this.currentExpression), 1500);
                break;
            case 'happy':
                this.setExpression('happy', 1.0);
                setTimeout(() => this.setExpression('neutral'), 2000);
                break;
            case 'sad':
                this.setExpression('sad', 1.0);
                setTimeout(() => this.setExpression('neutral'), 2000);
                break;
            case 'blink':
                if (this.vrm && this.vrm.expressionManager) {
                    try {
                        const em = this.vrm.expressionManager;
                        em.setValue('blink', 1.0);
                        setTimeout(() => em.setValue('blink', 0.0), 150);
                    } catch (e) {}
                }
                break;
        }
    }
    
    applyGlitch(intensity) {
        if (!this.vrm) return;
        
        const offset = intensity * 0.05;
        this.vrm.scene.position.x = (Math.random() - 0.5) * offset;
        this.vrm.scene.rotation.y = (Math.random() - 0.5) * offset * 0.5;
        
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
    
    onResize() {
        if (!this.canvas || !this.camera || !this.renderer) return;
        
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    showError(message) {
        console.error('VRM Error:', message);
        const loading = document.getElementById('vrmLoading');
        if (loading) {
            loading.textContent = 'Ошибка: ' + message;
            loading.style.color = '#ff0000';
        }
    }
}

console.log('✅ VRMAvatar класс загружен');
