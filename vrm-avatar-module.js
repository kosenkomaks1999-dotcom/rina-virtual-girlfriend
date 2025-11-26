// VRM Avatar для игры "Эхо в Сети" (ES Module версия)

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { VRM, VRMUtils, VRMExpressionPresetName } from 'https://cdn.jsdelivr.net/npm/@pixiv/three-vrm@2/lib/three-vrm.module.js';

export class VRMAvatar {
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
        this.scene.background = new THREE.Color(0x000000);
        
        // Камера (настроена для портрета - голова и плечи)
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
            
            const loader = new GLTFLoader();
            const gltf = await loader.loadAsync(path);
            
            // Создаём VRM из GLTF
            VRMUtils.removeUnnecessaryJoints(gltf.scene);
            const vrm = await VRM.from(gltf);
            
            this.vrm = vrm;
            this.scene.add(vrm.scene);
            
            // Настраиваем материалы (зелёный оттенок)
            vrm.scene.traverse((obj) => {
                if (obj.isMesh && obj.material) {
                    obj.material.emissive = new THREE.Color(0x002200);
                    obj.material.emissiveIntensity = 0.3;
                }
            });
            
            this.isLoaded = true;
            console.log('VRM модель загружена успешно!');
            
            // Скрываем индикатор загрузки
            const loading = document.getElementById('vrmLoading');
            if (loading) {
                loading.classList.add('hidden');
            }
            
            // Запускаем автоматическое моргание
            this.startAutoBlinking();
            
            // Устанавливаем нейтральное выражение
            this.setExpression('neutral');
            
        } catch (error) {
            console.error('Ошибка загрузки VRM:', error);
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
        
        // Обновляем VRM
        this.vrm.update(deltaTime);
        
        // Лёгкое покачивание (дыхание)
        const time = this.clock.getElapsedTime();
        this.vrm.scene.position.y = Math.sin(time * 1.5) * 0.008;
        this.vrm.scene.rotation.z = Math.sin(time * 0.8) * 0.01;
        
        this.renderer.render(this.scene, this.camera);
    }
    
    setExpression(expressionName, weight = 1.0) {
        if (!this.vrm || !this.vrm.expressionManager) return;
        
        const expressionManager = this.vrm.expressionManager;
        
        // Сбрасываем все выражения
        Object.values(VRMExpressionPresetName).forEach(presetName => {
            expressionManager.setValue(presetName, 0);
        });
        
        // Устанавливаем новое выражение
        try {
            const presetName = VRMExpressionPresetName[expressionName] || expressionName;
            expressionManager.setValue(presetName, weight);
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
    
    startAutoBlinking() {
        if (!this.vrm) return;
        
        const blink = () => {
            if (!this.vrm || !this.vrm.expressionManager) return;
            
            const expressionManager = this.vrm.expressionManager;
            expressionManager.setValue(VRMExpressionPresetName.Blink, 1.0);
            
            setTimeout(() => {
                if (this.vrm && this.vrm.expressionManager) {
                    expressionManager.setValue(VRMExpressionPresetName.Blink, 0.0);
                }
            }, 150);
            
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
                    const em = this.vrm.expressionManager;
                    em.setValue(VRMExpressionPresetName.Blink, 1.0);
                    setTimeout(() => {
                        em.setValue(VRMExpressionPresetName.Blink, 0.0);
                    }, 150);
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
        console.error(message);
        const loading = document.getElementById('vrmLoading');
        if (loading) {
            loading.textContent = 'Ошибка загрузки';
            loading.style.color = '#ff0000';
        }
    }
}

// Делаем доступным глобально для совместимости
window.VRMAvatar = VRMAvatar;

// Уведомляем что модуль загружен
window.dispatchEvent(new CustomEvent('vrm-avatar-loaded'));
