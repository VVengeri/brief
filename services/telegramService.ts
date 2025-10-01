import { IFormData } from '../types';

/**
 * Сервис для отправки готового ТЗ в Telegram
 */
export class TelegramService {
    private static readonly BOT_TOKEN = '8330890674:AAFMKhcjRk5T-FpR59gner1EAI07EwJeV5k';
    private static readonly CHAT_ID = '423198533';

    /**
     * Отправляет HTML-файл бриф в Telegram
     */
    static async sendBriefToTelegram(htmlContent: string, formData: IFormData): Promise<boolean> {
        try {
            const clientName = formData.client.name.trim().split(' ')[0] || 'Client';
            const projectAddress = formData.project.address.trim().replace(/[^a-zA-Z0-9А-Яа-я\s-]/gi, '').replace(/\s+/g, '_') || 'Project';
            const filename = `Бриф_${clientName}_${projectAddress}.html`;

            // Создаем Blob из HTML контента
            const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
            const file = new File([blob], filename, { type: 'text/html' });

            // Формируем сообщение
            const message = `🎨 *Новый бриф на дизайн-проект*\n\n` +
                `👤 *Клиент:* ${formData.client.name}\n` +
                `📞 *Телефон:* ${formData.client.phone}\n` +
                `📧 *Email:* ${formData.client.email}\n` +
                `🏠 *Адрес:* ${formData.project.address}\n` +
                `📐 *Площадь:* ${formData.project.area} м²\n\n` +
                `📎 *Файл бриф:* ${filename}`;

            // Отправляем сообщение с файлом через Telegram Bot API
            const formData_telegram = new FormData();
            formData_telegram.append('chat_id', this.CHAT_ID);
            formData_telegram.append('text', message);
            formData_telegram.append('parse_mode', 'Markdown');
            formData_telegram.append('document', file);

            const response = await fetch(`https://api.telegram.org/bot${this.BOT_TOKEN}/sendDocument`, {
                method: 'POST',
                body: formData_telegram
            });

            if (response.ok) {
                const result = await response.json();
                return result.ok;
            } else {
                console.error('Ошибка отправки в Telegram:', await response.text());
                return false;
            }
        } catch (error) {
            console.error('Ошибка при отправке в Telegram:', error);
            return false;
        }
    }

    /**
     * Отправляет уведомление о новом бриф (без файла)
     */
    static async sendNotification(formData: IFormData): Promise<boolean> {
        try {
            const message = `🎨 *Новый бриф на дизайн-проект*\n\n` +
                `👤 *Клиент:* ${formData.client.name}\n` +
                `📞 *Телефон:* ${formData.client.phone}\n` +
                `📧 *Email:* ${formData.client.email}\n` +
                `🏠 *Адрес:* ${formData.project.address}\n` +
                `📐 *Площадь:* ${formData.project.area} м²\n\n` +
                `💬 *Мессенджер:* ${formData.client.messenger.join(', ')}\n` +
                `⏰ *Сроки:* ${formData.budget.deadline}\n` +
                `💰 *Бюджет:* ${formData.budget.range}`;

            const response = await fetch(`https://api.telegram.org/bot${this.BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: this.CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown'
                })
            });

            if (response.ok) {
                const result = await response.json();
                return result.ok;
            } else {
                console.error('Ошибка отправки уведомления в Telegram:', await response.text());
                return false;
            }
        } catch (error) {
            console.error('Ошибка при отправке уведомления в Telegram:', error);
            return false;
        }
    }

    /**
     * Проверяет, настроен ли сервис
     */
    static isConfigured(): boolean {
        return this.BOT_TOKEN !== 'YOUR_BOT_TOKEN' && this.CHAT_ID !== 'YOUR_CHAT_ID';
    }
}
