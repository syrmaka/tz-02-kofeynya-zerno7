document.addEventListener('DOMContentLoaded', () => {
    const copyBtn = document.getElementById('copy-promo-btn');
    const promoCodeText = document.getElementById('promo-code').innerText;

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            // Копируем текст в буфер обмена
            navigator.clipboard.writeText(promoCodeText).then(() => {
                // Меняем текст кнопки, чтобы пользователь понял, что произошло
                const originalText = copyBtn.innerText;
                copyBtn.innerText = 'Скопировано!';
                copyBtn.style.background = '#4CAF50';
                copyBtn.style.color = '#fff';

                // Возвращаем кнопку в исходное состояние через 2 секунды
                setTimeout(() => {
                    copyBtn.innerText = originalText;
                    copyBtn.style.background = 'var(--color-cream)';
                    copyBtn.style.color = 'var(--color-coffee)';
                }, 2000);
            }).catch(err => {
                console.error('Ошибка копирования: ', err);
                alert('Не удалось скопировать. Промокод: ' + promoCodeText);
            });
        });
    }
});