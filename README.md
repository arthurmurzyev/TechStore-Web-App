# TechStore — Web Application

Современное веб-приложение интернет-магазина электроники с полноценной REST API архитектурой, ролевой моделью авторизации и развертыванием в облачной инфраструктуре.

**Live Demo:** [https://techstore-client-en2y.onrender.com](https://techstore-client-en2y.onrender.com)  
**API Endpoint:** [https://techstore-api-mp5z.onrender.com/api/products](https://techstore-api-mp5z.onrender.com/api/products)

---

## Интерфейс приложения

| Главный каталог товаров | Форма авторизации |
| :---: | :---: |
| ![Каталог](./Screenshots/catalog.png) | ![Авторизация](./Screenshots/login.png) |

---


### Backend
* **Платформа:** .NET 8 Web API
* **База данных:** MySQL (Managed Service on Aiven Cloud)
* **ORM:** Entity Framework Core
* **Аутентификация:** JWT (JSON Web Tokens) & ASP.NET Core Identity
* **Документация API:** Swagger / OpenAPI


## Локальный запуск

### 1. Клонирование репозитория
```bash
git clone [https://github.com/arthurmurzyev/TechStore-Web-App.git](https://github.com/arthurmurzyev/TechStore-Web-App.git)
cd TechStore-Web-App
