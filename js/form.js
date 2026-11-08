document.addEventListener('DOMContentLoaded', () => {
    
    // ⚠️ СЮДА МЫ ВСТАВИМ ССЫЛКУ НА ВАШ GOOGLE APPS SCRIPT (на этапе 3)
    const SCRIPT_URL = 'https://script.google.com/macros/s/ВАШ_ИДЕНТИФИКАТОР/exec'; 

    const form = document.getElementById('lead-form');
    const submitBtn = document.getElementById('submit-btn');
    const generalError = document.getElementById('form-general-error');

    // 1. ФУНКЦИЯ СБОРА UTM-МЕТОК
    function getUtmParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const utms = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
        
        let storedUtms = JSON.parse(sessionStorage.getItem('utm_data')) || {};

        utms.forEach(param => {
            const value = urlParams.get(param);
            if (value) {
                storedUtms[param] = value;
            }
        });
        
        // Сохраняем в sessionStorage, чтобы не потерять при переходе по страницам
        sessionStorage.setItem('utm_data', JSON.stringify(storedUtms));
        return storedUtms;
    }

    // Заполняем скрытые поля при загрузке
    const utmData = getUtmParams();
    document.getElementById('utm_source').value = utmData.utm_source || 'direct';
    document.getElementById('utm_medium').value = utmData.utm_medium || 'none';
    document.getElementById('utm_campaign').value = utmData.utm_campaign || 'not_set';
    document.getElementById('utm_content').value = utmData.utm_content || 'not_set';

    // Генерируем request_id (UUID)
    function generateUUID() {
        return 'REQ-' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    document.getElementById('request_id').value = generateUUID();

    // 2. ФУНКЦИЯ ОТОБРАЖЕНИЯ ОШИБОК
    function showError(fieldId, message) {
        const errorSpan = document.getElementById(`error-${fieldId}`);
        if (errorSpan) {
            errorSpan.innerText = message;
            errorSpan.style.color = 'red';
            errorSpan.style.fontSize = '12px';
            errorSpan.style.display = 'block';
            errorSpan.style.marginTop = '5px';
        }
        
        // Отправляем событие form_error в GA4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_error', {
                field_name: fieldId,
                error_type: 'validation'
            });
        }
    }

    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.innerText = '');
        generalError.innerText = '';
    }

    // 3. ВАЛИДАЦИЯ ФОРМЫ
    function validateForm() {
        clearErrors();
        let isValid = true;

        const name = document.getElementById('name').value.trim();
        if (name.length < 2 || name.length > 60) {
            showError('name', 'Введите имя от 2 до 60 символов.');
            isValid = false;
        }

        const phone = document.getElementById('phone').value.trim();
        // Проверка: +7 и 10 цифр
        const phoneRegex = /^\+7\d{10}$/;
        if (!phoneRegex.test(phone.replace(/[\s\(\)\-]/g, ''))) {
            showError('phone', 'Введите номер в формате +7XXXXXXXXXX.');
            isValid = false;
        }

        const email = document.getElementById('email').value.trim();
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('email', 'Введите корректный e-mail.');
            isValid = false;
        }

        const course = document.getElementById('course').value;
        if (!course) {
            showError('course', 'Выберите курс.');
            isValid = false;
        }

        const month = document.getElementById('start_month').value;
        if (!month) {
            showError('start_month', 'Выберите месяц старта.');
            isValid = false;
        }

        const privacy = document.getElementById('privacy').checked;
        if (!privacy) {
            showError('privacy', 'Необходимо согласие на обработку данных.');
            isValid = false;
        }

        return isValid;
    }

    // 4. ОТПРАВКА ФОРМЫ
    submitBtn.addEventListener('click', async () => {
        if (!validateForm()) return;

        // Блокируем кнопку
        submitBtn.disabled = true;
        submitBtn.innerText = 'Отправка...';

        // Собираем данные из формы
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => { data[key] = value; });
        
        // Принудительно ставим чекбокс в true, если он пройден
        data.privacy = true; 

        try {
            // Отправка через fetch на Google Apps Script
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8', // Google Apps Script требует text/plain
                }
            });

            const result = await response.json();

            if (result.ok) {
                // Успех! Отправляем событие GA4
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'generate_lead', {
                        lead_course: data.course,
                        lead_source: data.utm_source || 'direct'
                    });
                }
                // Перенаправляем на страницу Спасибо
                window.location.href = `thanks.html?id=${data.request_id}`;
            } else {
                // Ошибка сервера
                generalError.innerText = 'Ошибка сервера: ' + (result.error || 'Попробуйте позже');
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_error', { field_name: 'server', error_type: 'server' });
                }
            }
        } catch (error) {
            console.error('Ошибка:', error);
            generalError.innerText = 'Произошла ошибка при отправке. Проверьте интернет.';
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_error', { field_name: 'network', error_type: 'network' });
            }
        } finally {
            // Разблокируем кнопку
            submitBtn.disabled = false;
            submitBtn.innerText = 'Отправить заявку';
        }
    });
});