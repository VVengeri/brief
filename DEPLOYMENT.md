# Инструкция по развертыванию на GitHub Pages

## Настройка Telegram бота

### 1. Создание бота
1. Найдите [@BotFather](https://t.me/botfather) в Telegram
2. Отправьте команду `/newbot`
3. Следуйте инструкциям для создания бота
4. Сохраните полученный токен

### 2. Получение Chat ID
1. Добавьте бота в группу или отправьте ему сообщение
2. Перейдите по ссылке: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. Найдите `chat.id` в ответе

### 3. Настройка в коде
Откройте файл `services/telegramService.ts` и замените:
```typescript
private static readonly BOT_TOKEN = 'YOUR_BOT_TOKEN'; // Замените на токен вашего бота
private static readonly CHAT_ID = 'YOUR_CHAT_ID'; // Замените на ID чата для получения сообщений
```

## Развертывание на GitHub Pages

### 1. Создание репозитория
1. Создайте новый репозиторий на GitHub
2. Загрузите код в репозиторий

### 2. Настройка GitHub Pages
1. Перейдите в Settings → Pages
2. В разделе Source выберите "GitHub Actions"
3. Workflow автоматически запустится при push в main/master ветку

### 3. Настройка домена (опционально)
1. В Settings → Pages добавьте custom domain
2. Настройте DNS записи у вашего провайдера

## Локальная разработка

### Установка зависимостей
```bash
npm install
```

### Запуск в режиме разработки
```bash
npm run dev
```

### Сборка для продакшена
```bash
npm run build
```

## Структура проекта

```
├── components/          # React компоненты
├── services/           # Сервисы (HTML генерация, Telegram)
├── assets/            # Изображения и ресурсы
├── .github/workflows/ # GitHub Actions
├── dist/              # Собранное приложение
└── public/            # Статические файлы
```

## Переменные окружения

Создайте файл `.env.local` для локальной разработки:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

## Безопасность

⚠️ **Важно**: Не добавляйте токены ботов и API ключи в публичный репозиторий!

Используйте GitHub Secrets для хранения чувствительных данных:
1. Settings → Secrets and variables → Actions
2. Добавьте необходимые секреты
3. Используйте их в workflow файлах

## Поддержка

При возникновении проблем:
1. Проверьте логи GitHub Actions
2. Убедитесь в правильности настроек бота
3. Проверьте права доступа к репозиторию
