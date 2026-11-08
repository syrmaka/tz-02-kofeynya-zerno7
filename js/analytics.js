// ==========================================
// НАСТРОЙКА GOOGLE ANALYTICS 4
// ==========================================

const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; 

// Инициализация GA4
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', GA_MEASUREMENT_ID); 

// ==========================================
// ОТПРАВКА СОБЫТИЙ
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    
    // Универсальная функция для отправки событий
    function sendEvent(eventName, params = {}) {
        // Проверка, что gtag загружен
        if (typeof gtag === 'function') {
            gtag('event', eventName, params);
            console.log(`[GA4] Отправлено событие: ${eventName}`, params);
        }
    }

    // 1. Обработка кликов по элементам с атрибутом data-event
    const clickableElements = document.querySelectorAll('[data-event]');
    
    clickableElements.forEach(element => {
        element.addEventListener('click', function(e) {
            const eventName = this.getAttribute('data-event');
            
            // Собираем параметры из data-атрибутов
            const params = {};
            for (const attr of this.attributes) {
                if (attr.name.startsWith('data-') && attr.name !== 'data-event') {
                    // Превращаем data-button-name в button_name
                    const paramName = attr.name.replace('data-', '').replace(/-/g, '_');
                    params[paramName] = attr.value;
                }
            }
            
            // Специальная обработка для карточек курсов (view_course)
            if (eventName === 'view_course' && this.hasAttribute('data-course-name')) {
                params.course_name = this.getAttribute('data-course-name');
            }

            // Специальная обработка для карточек зерна (bean_view)
            if (eventName === 'bean_view' && this.hasAttribute('data-bean-name')) {
                params.bean_name = this.getAttribute('data-bean-name');
                params.roast_level = this.getAttribute('data-roast-level');
            }

            // Специальная обработка для фильтра меню (menu_filter)
            if (eventName === 'menu_filter' && this.hasAttribute('data-filter-value')) {
                params.filter_value = this.getAttribute('data-filter-value');
            }

            // Специальная обработка для кнопок мессенджеров (messenger_click)
            if (eventName === 'messenger_click' && this.hasAttribute('data-messenger')) {
                params.messenger = this.getAttribute('data-messenger');
            }

            // Специальная обработка для копирования промокода (promo_copy)
            if (eventName === 'promo_copy' && this.hasAttribute('data-promo-code')) {
                params.promo_code = this.getAttribute('data-promo-code');
            }

            // Специальная обработка для карты (map_open)
            if (eventName === 'map_open' && this.hasAttribute('data-map-service')) {
                params.map_service = this.getAttribute('data-map-service');
            }

            sendEvent(eventName, params);
        });
    });

});