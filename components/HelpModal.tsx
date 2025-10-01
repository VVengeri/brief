import React from 'react';

interface HelpModalProps {
    onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div className="bg-white dark:bg-[#2d2d2d] rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-wheat">Справка по заполнению брифа</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 overflow-auto text-gray-700 dark:text-gray-300 space-y-6">
                     <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-wheat-200">Краткое руководство по опроснику</h3>
                        <ul className="list-disc pl-5 space-y-2 text-sm">
                            <li><strong>Навигация:</strong> Используйте кнопки "Далее" и "Назад" для перемещения по разделам анкеты.</li>
                            <li><strong>Сохранение:</strong> Ваши ответы сохраняются автоматически в браузере. Вы можете прерваться и продолжить позже с того же устройства.</li>
                            <li><strong>Загрузка файлов:</strong> В разделах, где требуется прикрепить план или референсы, вы можете перетащить файлы в специальную область или нажать на нее, чтобы выбрать файлы с вашего устройства.</li>
                            <li><strong>Редактирование изображений:</strong> После загрузки изображения (плана или референса) под ним появится кнопка «Редактировать». Нажав на нее, вы откроете редактор, где сможете добавлять пометки: рисовать линии, стрелки, рамки, размещать иконки розеток или писать текст прямо на изображении. Это поможет точно донести ваши идеи.</li>
                            <li><strong>Завершение:</strong> В конце анкеты вы сможете просмотреть все свои ответы и скачать итоговый бриф в удобном формате для отправки дизайнеру.</li>
                        </ul>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-wheat-200">Советы по планированию бюджета</h3>
                        <p className="text-sm mb-2">Приблизительное распределение бюджета на ремонт "под ключ" (без учета стоимости дизайн-проекта):</p>
                        <ul className="list-disc pl-5 space-y-2 text-sm">
                            <li><strong>~40% Черновые работы и материалы:</strong> Стяжка, штукатурка, электрика, сантехника. Это основа вашего ремонта, на которой не стоит экономить.</li>
                            <li><strong>~30% Чистовые материалы:</strong> Напольные и настенные покрытия, двери, сантехника.</li>
                            <li><strong>~30% Мебель, техника, свет и декор:</strong> То, что создает уют и функциональность.</li>
                             <li><strong>Резерв (10-15%):</strong> Всегда закладывайте сумму на непредвиденные расходы. Это поможет избежать стресса и остановки работ.</li>
                        </ul>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-wheat-200">Этапы работы над проектом</h3>
                         <ol className="list-decimal pl-5 space-y-2 text-sm">
                            <li><strong>Техническое задание:</strong> Вы заполняете этот бриф.</li>
                            <li><strong>Планировочное решение:</strong> Разрабатываем 2-3 варианта планировки с расстановкой мебели.</li>
                            <li><strong>Визуализация (опционально):</strong> Создаем фотореалистичные 3D-изображения будущего интерьера.</li>
                            <li><strong>Рабочая документация:</strong> Готовим полный комплект чертежей для строителей.</li>
                            <li><strong>Авторский надзор (опционально):</strong> Контролируем соответствие ремонтных работ проекту.</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};