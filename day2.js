// День 2: Счёт за обслуживание

function getDay2Scenes() {
    return [
        // Сцена 0: Уведомление о платеже
        {
            day: 2,
            type: 'payment_notification',
            messages: [
                { type: 'system', text: '═══ NEURALLINK CORPORATION ═══', delay: 1000 },
                { type: 'system', text: 'УВЕДОМЛЕНИЕ О ПЛАТЕЖЕ', delay: 1500 },
                { type: 'system', text: 'Стоимость обслуживания сознания #A-7734:', delay: 2000 },
                { type: 'system', text: '50$ в день', delay: 1500 },
                { type: 'system', text: 'Текущий баланс: 0$', delay: 1500 },
                { type: 'system', text: '⚠ Для продолжения сеанса требуется оплата', delay: 2000 },
                { type: 'system', text: 'Переход в главное меню...', delay: 2000 }
            ],
            onComplete: 'showMainMenu' // Показываем главное меню
        }
    ];
}
