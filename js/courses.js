// Массив с потоками (данные из ТЗ)
const streams = [
    { id: 1, courseName: 'Бариста с нуля', startDate: '2 декабря 2026', seats: 4 },
    { id: 2, courseName: 'Бариста с нуля', startDate: '16 декабря 2026', seats: 0 }, // Мест нет!
    { id: 3, courseName: 'Бариста с нуля', startDate: '13 января 2027', seats: 6 },
    { id: 4, courseName: 'Латте-арт', startDate: '7 декабря 2026', seats: 3 },
    { id: 5, courseName: 'Латте-арт', startDate: '20 января 2027', seats: 5 },
    { id: 6, courseName: 'Альтернатива', startDate: 'Каждую субботу', seats: 8 }
];

// Функция отрисовки потоков на странице
function renderStreams() {
    const container = document.getElementById('streams-container');
    if (!container) return;

    container.innerHTML = ''; // Очищаем контейнер

    streams.forEach(stream => {
        // Создаем карточку потока
        const streamCard = document.createElement('div');
        streamCard.className = 'stream-card';
        streamCard.style.border = '1px solid #ddd';
        streamCard.style.padding = '15px';
        streamCard.style.marginBottom = '10px';
        streamCard.style.borderRadius = '8px';
        streamCard.style.display = 'flex';
        streamCard.style.justifyContent = 'space-between';
        streamCard.style.alignItems = 'center';
        streamCard.style.background = '#fff';

        // Проверяем наличие мест
        const isAvailable = stream.seats > 0;
        const statusText = isAvailable ? `Свободно мест: ${stream.seats}` : 'Мест нет';
        const buttonClass = isAvailable ? 'btn btn--primary' : 'btn';
        const buttonStyle = isAvailable ? '' : 'background: #ccc; cursor: not-allowed; color: #666;';
        const buttonDisabled = isAvailable ? '' : 'disabled';

        streamCard.innerHTML = `
            <div>
                <h3 style="font-family: var(--font-heading); font-size: 18px; margin-bottom: 5px;">${stream.courseName}</h3>
                <p style="color: #666; font-size: 14px;">Старт: ${stream.startDate}</p>
                <p style="font-weight: bold; color: ${isAvailable ? 'var(--color-coffee)' : 'red'};">${statusText}</p>
            </div>
            <button class="${buttonClass}" style="${buttonStyle}" ${buttonDisabled} 
                data-event="select_course_date" 
                data-course-name="${stream.courseName}" 
                data-start-date="${stream.startDate}">
                ${isAvailable ? 'Выбрать поток' : 'Мест нет'}
            </button>
        `;

        // Если мест нет, вешаем подсказку
        if (!isAvailable) {
            const btn = streamCard.querySelector('button');
            btn.title = 'На этот поток мест больше нет';
        } else {
            // Если места есть, кнопка ведет на страницу контактов
            const btn = streamCard.querySelector('button');
            btn.addEventListener('click', () => {
                window.location.href = 'contacts.html';
            });
        }

        container.appendChild(streamCard);
    });
}

// Запускаем отрисовку после загрузки страницы
document.addEventListener('DOMContentLoaded', renderStreams);