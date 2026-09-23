# TechStore Client

Фронтенд-приложение для интернет-магазина электроники TechStore, построенное на React + Vite + Tailwind CSS.

## 🚀 Технологии

- **React 18** - UI библиотека
- **Vite** - быстрый сборщик и dev-сервер
- **React Router** - маршрутизация
- **Tailwind CSS** - utility-first CSS фреймворк
- **Axios** - HTTP клиент для работы с API
- **Lucide React** - набор иконок

## 📁 Структура проекта

```
TechStore.Client/
├── public/              # Статические файлы
├── src/
│   ├── components/      # React компоненты
│   │   ├── Header.jsx   # Шапка сайта с навигацией
│   │   ├── Catalog.jsx  # Каталог товаров с фильтрами
│   │   ├── Cart.jsx     # Корзина покупок
│   │   ├── Orders.jsx   # Список заказов пользователя
│   │   ├── Login.jsx    # Авторизация и регистрация
│   │   └── ProtectedRoute.jsx # HOC для защиты роутов
│   ├── services/
│   │   └── api.js       # API клиент и сервисы
│   ├── App.jsx          # Главный компонент приложения
│   ├── main.jsx         # Точка входа
│   └── index.css        # Глобальные стили
├── .dockerignore
├── Dockerfile
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎨 Дизайн

Приложение использует современный темный интерфейс с акцентами:

- **Основной цвет**: Deep Navy (#0F172A, #1E293B)
- **Акцент холодный**: Cyan (#22D3EE) - для кнопок и ссылок
- **Акцент теплый**: Orange (#F97316) - для важных действий (CTA)
- **Текст**: Off-white (#F8FAFC) на темном фоне
- **Шрифт**: Inter

## 🛠 Установка и запуск

### Предварительные требования

- Node.js 18+ и npm
- Запущенный TechStore.API на `http://localhost:5000`

### Локальный запуск

1. Перейдите в директорию клиента:
```bash
cd TechStore.Client
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите dev-сервер:
```bash
npm run dev
```

4. Откройте браузер: http://localhost:5173

### Запуск через Docker Compose

Из корня проекта Project_1:

```bash
docker-compose up --build
```

Приложение будет доступно на:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MySQL**: localhost:3306

### Сборка для продакшена

```bash
npm run build
```

Собранные файлы будут в папке `dist/`.

## 🔑 Функционал

### Публичные страницы
- **Каталог товаров** (`/`) - просмотр всех товаров
  - Фильтрация по категориям
  - Поиск по названию
  - Пагинация (10 товаров на странице)
  - Просмотр спецификаций товара

### Защищенные страницы (требуется авторизация)
- **Корзина** (`/cart`)
  - Добавление товаров
  - Изменение количества
  - Удаление товаров
  - Расчет итоговой суммы
  - Оформление заказа

- **Заказы** (`/orders`)
  - Просмотр истории заказов
  - Оплата заказов (мок-платежи)
  - Отслеживание статусов

### Авторизация
- **Вход** (`/login`)
- **Регистрация** (`/login`)
- JWT токен хранится в `localStorage`
- Автоматическое добавление токена в заголовки запросов

## 🧪 Тестовые аккаунты

```
Admin:
Email: admin@techstore.com
Пароль: Admin123!

User:
Email: user@techstore.com
Пароль: User123!
```

## 📡 API Endpoints

Все запросы идут на `http://localhost:5000/api`:

### Auth
- `POST /Auth/register` - регистрация
- `POST /Auth/login` - вход

### Products
- `GET /Products` - список товаров (с пагинацией и фильтрами)
- `GET /Products/{id}` - товар по ID

### Categories
- `GET /Categories` - список категорий

### Cart
- `GET /Cart` - получить корзину
- `POST /Cart` - добавить товар
- `PUT /Cart` - обновить количество
- `DELETE /Cart/{productId}` - удалить товар
- `DELETE /Cart/clear` - очистить корзину

### Orders
- `GET /Orders/my` - мои заказы
- `POST /Orders` - создать заказ

### Payments
- `POST /Payments/process` - оплатить заказ

## 🔧 Конфигурация

### Изменение API URL

Отредактируйте `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://your-api-url.com/api';
```

### Изменение порта dev-сервера

Отредактируйте `vite.config.js`:

```javascript
server: {
  port: 3000, // измените порт
}
```

## 🚢 Деплой

### Netlify / Vercel

1. Соберите проект: `npm run build`
2. Загрузите папку `dist/` на хостинг
3. Настройте переменную окружения `VITE_API_URL` с адресом вашего API

### Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/techstore-client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 📦 Доступные скрипты

- `npm run dev` - запуск dev-сервера
- `npm run build` - сборка для продакшена
- `npm run preview` - предпросмотр production сборки
- `npm run lint` - проверка кода ESLint

## 🐛 Troubleshooting

### CORS ошибки
Убедитесь, что в API (TechStore.API/Program.cs) настроен CORS для вашего frontend URL.

### 401 Unauthorized
Проверьте, что JWT токен действителен и не истек. Попробуйте выйти и войти снова.

### Товары не загружаются
Убедитесь, что API запущен и доступен на `http://localhost:5000`.

## 📄 Лицензия

MIT License
