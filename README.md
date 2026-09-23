# TechStore - Full-Stack E-commerce Platform

Полнофункциональная платформа интернет-магазина электроники с Backend на .NET 8 Web API и Frontend на React.

##  Обзор проекта

TechStore - это современное E-commerce решение для продажи электроники, включающее:

- **Backend API** (.NET 8 + MySQL + Entity Framework Core)
- **Frontend Client** (React 18 + Vite + Tailwind CSS)
- **Docker Compose** для легкого развертывания

##  Структура проекта

```
Project_1/
├── TechStore.API/           # Backend Web API
│   ├── Controllers/         # API контроллеры
│   ├── Models/             # Модели данных
│   ├── DTOs/               # Data Transfer Objects
│   ├── Data/               # DbContext и конфигурации
│   ├── Services/           # Бизнес-логика
│   ├── Dockerfile
│   └── Program.cs
├── TechStore.Client/        # Frontend React приложение
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── services/       # API клиент
│   │   └── App.jsx
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml       # Оркестрация всех сервисов
├── TechStore.sln           # Solution файл
└── README.md               # Этот файл
```

##  Быстрый старт

### Вариант 1: Docker Compose (Рекомендуется)

Самый простой способ запустить весь стек:

```bash
# Клонируйте или перейдите в директорию проекта
cd Project_1

# Запустите все сервисы
docker-compose up --build
```

После запуска будут доступны:
-  **Frontend**: http://localhost:3000
-  **Backend API**: http://localhost:5000
-  **Swagger UI**: http://localhost:5000/swagger
-  **MySQL**: localhost:3306

### Вариант 2: Локальный запуск

#### Backend

1. Установите .NET 8 SDK
2. Установите MySQL Server (или используйте Docker для MySQL)
3. Запустите API:

```bash
cd TechStore.API

# Восстановите пакеты
dotnet restore

# Примените миграции
dotnet ef database update

# Запустите API
dotnet run
```

API будет доступен на https://localhost:7001 (или http://localhost:5000)

#### Frontend

1. Установите Node.js 18+
2. Запустите клиент:

```bash
cd TechStore.Client

# Установите зависимости
npm install

# Запустите dev-сервер
npm run dev
```

Frontend будет доступен на http://localhost:5173

##  Функциональность

### Backend API

#### Основные модули:
- **Authentication** - JWT-авторизация для покупателей и администраторов
- **Catalog** - Управление категориями и товарами
- **Cart** - Корзина покупок
- **Orders** - Управление заказами
- **Payments** - Мок-система оплаты

#### Технологии:
- .NET 8 Web API
- Entity Framework Core 8
- MySQL (Pomelo.EntityFrameworkCore.MySql)
- JWT Bearer Authentication
- Swagger/OpenAPI
- Clean Architecture

#### API Endpoints:

**Auth**
- `POST /api/Auth/register` - Регистрация
- `POST /api/Auth/login` - Вход

**Products**
- `GET /api/Products` - Список товаров (пагинация, фильтры, поиск)
- `GET /api/Products/{id}` - Товар по ID
- `POST /api/Products` - Создать товар [Admin]
- `PUT /api/Products/{id}` - Обновить товар [Admin]
- `DELETE /api/Products/{id}` - Удалить товар [Admin]

**Categories**
- `GET /api/Categories` - Список категорий
- CRUD операции [Admin]

**Cart**
- `GET /api/Cart` - Получить корзину
- `POST /api/Cart` - Добавить товар
- `PUT /api/Cart` - Обновить количество
- `DELETE /api/Cart/{productId}` - Удалить товар
- `DELETE /api/Cart/clear` - Очистить корзину

**Orders**
- `GET /api/Orders/my` - Мои заказы
- `POST /api/Orders` - Создать заказ
- `GET /api/Orders` - Все заказы [Admin]

**Payments**
- `POST /api/Payments/process` - Обработать платеж

### Frontend Client

#### Страницы:
-  **Главная (Каталог)** - Сетка товаров с фильтрами и поиском
-  **Корзина** - Управление товарами в корзине
-  **Заказы** - История заказов и оплата
-  **Авторизация** - Вход и регистрация

#### Возможности:
- Адаптивный дизайн (mobile-first)
- Фильтрация по категориям
- Поиск товаров
- Пагинация
- JWT аутентификация
- Защищенные роуты
- Управление корзиной в реальном времени
- Оформление и оплата заказов

#### Технологии:
- React 18
- Vite
- React Router v6
- Tailwind CSS
- Axios
- Lucide Icons

## 🗄️ База данных

### Схема

```
Users (Пользователи)
├── Id (int, PK)
├── FullName (string)
├── Email (string, unique)
├── PasswordHash (string)
└── Role (string: "Admin" | "Customer")

Categories (Категории)
├── Id (int, PK)
├── Name (string)
└── Description (string)

Products (Товары)
├── Id (int, PK)
├── Name (string)
├── Description (string)
├── Price (decimal)
├── StockQuantity (int)
├── CategoryId (int, FK)
├── ImageUrl (string)
├── Specifications (JSON)
└── CreatedAt (DateTime)

Carts (Корзины)
├── Id (int, PK)
├── UserId (int, FK)
└── Items → CartItems

CartItems (Товары в корзине)
├── Id (int, PK)
├── CartId (int, FK)
├── ProductId (int, FK)
└── Quantity (int)

Orders (Заказы)
├── Id (int, PK)
├── UserId (int, FK)
├── OrderStatus (enum)
├── TotalAmount (decimal)
├── ShippingAddress (string)
├── CreatedAt (DateTime)
└── Items → OrderItems

OrderItems (Товары в заказе)
├── Id (int, PK)
├── OrderId (int, FK)
├── ProductId (int, FK)
├── Quantity (int)
└── PriceAtOrder (decimal)
```

## 🔧 Конфигурация

### Backend (appsettings.json)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=3306;Database=techstore;User=root;Password=yourpassword;"
  },
  "Jwt": {
    "SecretKey": "your-secret-key-min-32-chars",
    "Issuer": "TechStore",
    "Audience": "TechStoreClient",
    "ExpiryInMinutes": 1440
  }
}
```

### Frontend (src/services/api.js)

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## 🚢 Деплой на VPS/Хостинг

### Backend на Linux VPS

```bash
# Установите Docker и Docker Compose на сервере
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Клонируйте проект
git clone <your-repo>
cd Project_1

# Измените пароли в docker-compose.yml и appsettings.json

# Запустите
docker-compose up -d

# Настройте Nginx reverse proxy
# (пример конфига в TechStore.API/README.md)
```

### Frontend на Netlify/Vercel

```bash
cd TechStore.Client
npm run build

# Загрузите папку dist/ на хостинг
# Настройте переменную окружения VITE_API_URL
```

## NuGet пакеты (Backend)

```xml
<PackageReference Include="Microsoft.EntityFrameworkCore" Version="8.0.0" />
<PackageReference Include="Pomelo.EntityFrameworkCore.MySql" Version="8.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="8.0.0" />
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
<PackageReference Include="System.IdentityModel.Tokens.Jwt" Version="7.0.0" />
```

## Разработка

### Добавление миграции

```bash
cd TechStore.API
dotnet ef migrations add MigrationName
dotnet ef database update
```

### Запуск тестов (если добавлены)

```bash
dotnet test
```

### Проверка кода Frontend

```bash
cd TechStore.Client
npm run lint
```

## Troubleshooting

### Backend не запускается
- Проверьте, что MySQL запущен и доступен
- Убедитесь, что строка подключения в appsettings.json корректна
- Проверьте логи: `docker-compose logs api`

### Frontend не подключается к API
- Проверьте, что API запущен на http://localhost:5000
- Откройте консоль браузера и проверьте ошибки CORS
- Убедитесь, что API_BASE_URL в api.js указывает на правильный адрес

### CORS ошибки
Backend уже настроен на прием запросов от localhost:3000 и localhost:5173. Если используете другой порт, добавьте его в Program.cs:

```csharp
builder.Services.AddCors(options => {
    options.AddPolicy("AllowFrontend", policy => {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173", "http://your-domain.com")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

## Дополнительная документация

- [Backend README](TechStore.API/README.md) - Подробная документация API
- [Frontend README](TechStore.Client/README.md) - Документация клиента


