using System.Text.Json;
using TechStore.API.Models;

namespace TechStore.API.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (context.Categories.Any())
            return;

        var categories = new List<Category>
        {
            new Category
            {
                Name = "Смартфоны",
                Description = "Мобильные телефоны и аксессуары",
                CreatedAt = DateTime.UtcNow
            },
            new Category
            {
                Name = "Ноутбуки",
                Description = "Ноутбуки и портативные компьютеры",
                CreatedAt = DateTime.UtcNow
            },
            new Category
            {
                Name = "Комплектующие",
                Description = "Компоненты для ПК и периферия",
                CreatedAt = DateTime.UtcNow
            },
            new Category
            {
                Name = "Аксессуары",
                Description = "Аксессуары для электроники",
                CreatedAt = DateTime.UtcNow
            }
        };

        await context.Categories.AddRangeAsync(categories);
        await context.SaveChangesAsync();

        var products = new List<Product>
        {
            // Смартфоны
            new Product
            {
                Name = "iPhone 15 Pro",
                Description = "Флагманский смартфон Apple с процессором A17 Pro и титановым корпусом. Инновационный дизайн из титана aerospace-grade обеспечивает прочность и лёгкость. Дисплей Super Retina XDR с технологией ProMotion 120 Гц и Always-On Display. Революционная кнопка Action для быстрого доступа к функциям. Профессиональная камерная система Pro с главным сенсором 48 МП, телеобъективом 5x и улучшенным ночным режимом. Поддержка пространственного видео для Apple Vision Pro. USB-C порт с поддержкой USB 3 для сверхбыстрой передачи данных.",
                Price = 89999m,
                StockQuantity = 50,
                CategoryId = categories[0].Id,
                ImageUrl = "https://i.ibb.co/3mLPs346/toppng-com-apple-iphone-15-pro-max-natural-titanium-png-3200x3200.png",
                Specifications = JsonSerializer.Serialize(new Dictionary<string, string>
                {
                    { "Диагональ", "6.1 дюйма" },
                    { "ОЗУ", "8 ГБ" },
                    { "Процессор", "A17 Pro" },
                    { "Камера", "48 МП" },
                    { "Батарея", "3274 мАч" }
                }),
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Samsung Galaxy S24 Ultra",
                Description = "Премиальный флагман Samsung с встроенным стилусом S Pen и революционной камерой 200 МП. Процессор Snapdragon 8 Gen 3 for Galaxy обеспечивает максимальную производительность. Яркий 6.8\" Dynamic AMOLED 2X дисплей с адаптивной частотой до 120 Гц и защитой Gorilla Armor. Квадрокамера с продвинутым зумом Space Zoom 100x и ночной съёмкой Nightography. Встроенный Galaxy AI для интеллектуальной обработки фото, перевода в реальном времени и работы с текстом. Батарея 5000 мАч с быстрой зарядкой 45W. Защита IP68 и прочный титановый корпус.",
                Price = 99999m,
                StockQuantity = 35,
                CategoryId = categories[0].Id,
                ImageUrl = "https://i.ibb.co/KxcVj79P/Samsung-Galaxy-S24-Ultra-flagship-smartphone-transparent-PNG-image-1.png",
                Specifications = JsonSerializer.Serialize(new Dictionary<string, string>
                {
                    { "Диагональ", "6.8 дюйма" },
                    { "ОЗУ", "12 ГБ" },
                    { "Процессор", "Snapdragon 8 Gen 3" },
                    { "Камера", "200 МП" },
                    { "Батарея", "5000 мАч" }
                }),
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Xiaomi 14 Pro",
                Description = "Топовый флагман Xiaomi с профессиональной оптикой Leica Summilux и сверхбыстрой зарядкой 120W. Snapdragon 8 Gen 3 обеспечивает флагманскую производительность в играх и многозадачности. Потрясающий 6.73\" AMOLED дисплей с разрешением 3200x1440 и яркостью до 3000 нит. Тройная камера Leica с оптической стабилизацией, переменной апертурой и режимами профессиональной съёмки. HyperOS на базе Android для плавной работы. Зарядка 120W полностью заряжает за 18 минут, беспроводная 50W за 28 минут. Премиальный дизайн со стеклом и металлом.",
                Price = 64999m,
                StockQuantity = 45,
                CategoryId = categories[0].Id,
                ImageUrl = "https://i.ibb.co/Qjc8TX50/image-removebg-preview.png",
                Specifications = JsonSerializer.Serialize(new Dictionary<string, string>
                {
                    { "Диагональ", "6.73 дюйма" },
                    { "ОЗУ", "12 ГБ" },
                    { "Процессор", "Snapdragon 8 Gen 3" },
                    { "Камера", "50 МП Leica" },
                    { "Батарея", "4880 мАч" }
                }),
                CreatedAt = DateTime.UtcNow
            },

            // Ноутбуки
            new Product
            {
                Name = "MacBook Pro 16",
                Description = "Профессиональный ноутбук Apple с революционным чипом M3 Pro для максимальной производительности. 16-дюймовый Liquid Retina XDR дисплей с яркостью до 1600 нит, поддержкой ProMotion 120 Гц и миллиардом цветов. До 18 ГБ объединённой памяти для работы с большими проектами. Мощная система охлаждения позволяет раскрыть весь потенциал чипа. До 22 часов автономной работы. Шесть динамиков с пространственным звуком и студийное качество микрофонов. Три порта Thunderbolt 4, HDMI, слот для SD-карт и MagSafe 3. Идеален для видеомонтажа, 3D-рендеринга, разработки и музыкального производства.",
                Price = 249999m,
                StockQuantity = 20,
                CategoryId = categories[1].Id,
                ImageUrl = "https://i.ibb.co/n8Dgt4cR/image-removebg-preview.png",
                Specifications = JsonSerializer.Serialize(new Dictionary<string, string>
                {
                    { "Диагональ", "16 дюймов" },
                    { "ОЗУ", "18 ГБ" },
                    { "Процессор", "Apple M3 Pro" },
                    { "SSD", "512 ГБ" },
                    { "Видеокарта", "Integrated GPU" }
                }),
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "ASUS ROG Strix G16",
                Description = "Мощный игровой ноутбук с флагманской видеокартой NVIDIA GeForce RTX 4070 и процессором Intel Core i9-13980HX 13-го поколения. Быстрый 16\" дисплей с частотой 240 Гц, временем отклика 3 мс и покрытием 100% sRGB для плавного геймплея. 32 ГБ DDR5 памяти и NVMe SSD 1 ТБ для мгновенной загрузки игр. Продвинутая система охлаждения ROG Intelligent Cooling с жидким металлом. RGB-подсветка Aura Sync по всему корпусу. Dolby Atmos и Hi-Res аудио. Wi-Fi 6E для стабильного онлайн-гейминга. Работает на Windows 11 с предустановленным Armoury Crate для тонкой настройки производительности.",
                Price = 179999m,
                StockQuantity = 25,
                CategoryId = categories[1].Id,
                ImageUrl = "https://i.ibb.co/d0RddDBh/laptop-asus-rog-zephyrus-gx501-intel-geforce-laptop-25f3671bab6e4667497fa0b96d49b580.png",
                Specifications = JsonSerializer.Serialize(new Dictionary<string, string>
                {
                    { "Диагональ", "16 дюймов" },
                    { "ОЗУ", "32 ГБ" },
                    { "Процессор", "Intel Core i9-13980HX" },
                    { "SSD", "1 ТБ" },
                    { "Видеокарта", "NVIDIA RTX 4070" }
                }),
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Lenovo ThinkPad X1 Carbon",
                Description = "Премиальный бизнес-ноутбук с легендарной надёжностью ThinkPad и исключительной автономностью. Сверхлёгкий корпус из углеродного волокна весом всего 1.12 кг с военным стандартом прочности MIL-STD-810H. 14\" дисплей с низким энергопотреблением, антибликовым покрытием и яркостью до 400 нит. Процессор Intel Core i7-1365U с технологией Intel Evo для мгновенного отклика. До 16 часов работы от батареи с быстрой зарядкой Rapid Charge. Легендарная клавиатура ThinkPad с TrackPoint. Защита данных: сканер отпечатков, ИК-камера для Windows Hello, физическая шторка камеры. Thunderbolt 4, HDMI 2.0, идеален для бизнеса и командировок.",
                Price = 139999m,
                StockQuantity = 30,
                CategoryId = categories[1].Id,
                ImageUrl = "https://i.ibb.co/G4wNMvYS/favpng-ddc8380ac039a8e9a92f30133dd3eb20.png",
                Specifications = JsonSerializer.Serialize(new Dictionary<string, string>
                {
                    { "Диагональ", "14 дюймов" },
                    { "ОЗУ", "16 ГБ" },
                    { "Процессор", "Intel Core i7-1365U" },
                    { "SSD", "512 ГБ" },
                    { "Вес", "1.12 кг" }
                }),
                CreatedAt = DateTime.UtcNow
            },

            // Комплектующие
            new Product
            {
                Name = "NVIDIA GeForce RTX 4080",
                Description = "Флагманская видеокарта NVIDIA для игр в 4K с максимальными настройками и трассировкой лучей в реальном времени. Архитектура Ada Lovelace обеспечивает невероятную производительность и энергоэффективность. 16 ГБ сверхбыстрой памяти GDDR6X для работы с высокими разрешениями и текстурами. Технология DLSS 3 с Frame Generation увеличивает FPS в несколько раз. Ray Tracing третьего поколения для фотореалистичного освещения. NVIDIA Reflex снижает задержку ввода для киберспорта. Поддержка AV1 кодирования для стриминга. PCIe 4.0 x16 интерфейс. Требуется блок питания минимум 750W. Три DisplayPort 1.4a и один HDMI 2.1 для подключения до четырёх мониторов.",
                Price = 119999m,
                StockQuantity = 15,
                CategoryId = categories[2].Id,
                ImageUrl = "https://i.ibb.co/LDnwv9TV/xlr8-geforce-rtx-4080-16gb-uprising-epic-x-tf-top-1.png",
                Specifications = JsonSerializer.Serialize(new Dictionary<string, string>
                {
                    { "Память", "16 ГБ GDDR6X" },
                    { "TDP", "320W" },
                    { "Интерфейс", "PCIe 4.0" },
                    { "DLSS", "3.0" }
                }),
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "AMD Ryzen 9 7950X",
                Description = "Топовый 16-ядерный процессор AMD на архитектуре Zen 4 для максимальной производительности в играх, рендеринге и профессиональных задачах. 32 потока обеспечивают невероятную многозадачность. Частота до 5.7 ГГц в Precision Boost для рекордной производительности в одном потоке. Поддержка DDR5 памяти и PCIe 5.0 для будущего расширения. 5нм техпроцесс обеспечивает высокую энергоэффективность. 80 МБ кэш-памяти (L2+L3) для быстрого доступа к данным. Встроенная графика RDNA 2 позволяет работать без дискретной видеокарты. Разблокированный множитель для разгона. Сокет AM5 с долгосрочной поддержкой. TDP 170W, совместим с кулерами AM4 через адаптер.",
                Price = 49999m,
                StockQuantity = 40,
                CategoryId = categories[2].Id,
                ImageUrl = "https://i.ibb.co/8QTVNTR/750fd953f.png",
                Specifications = JsonSerializer.Serialize(new Dictionary<string, string>
                {
                    { "Ядра", "16" },
                    { "Потоки", "32" },
                    { "Частота", "4.5 - 5.7 ГГц" },
                    { "TDP", "170W" },
                    { "Сокет", "AM5" }
                }),
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Samsung 990 PRO 2TB",
                Description = "Сверхбыстрый NVMe SSD накопитель с рекордными скоростями чтения до 7450 МБ/с и записи до 6900 МБ/с для мгновенной загрузки игр и приложений. Интерфейс PCIe 4.0 x4, NVMe 2.0 для максимальной пропускной способности. Контроллер Samsung и 3-bit MLC V-NAND обеспечивают надёжность и долговечность. До 1200 TBW (терабайт записи) гарантирует долгий срок службы. Никелевое покрытие для эффективного теплоотвода. Поддержка AES 256-bit шифрования для защиты данных. Технология TRIM и S.M.A.R.T. для поддержания производительности. Совместим с PlayStation 5 для расширения хранилища. Включает ПО Samsung Magician для мониторинга и оптимизации. 5 лет гарантии.",
                Price = 19999m,
                StockQuantity = 60,
                CategoryId = categories[2].Id,
                ImageUrl = "https://i.ibb.co/nqC8Gj2S/10245825.png",
                Specifications = JsonSerializer.Serialize(new Dictionary<string, string>
                {
                    { "Объём", "2 ТБ" },
                    { "Чтение", "7450 МБ/с" },
                    { "Запись", "6900 МБ/с" },
                    { "Интерфейс", "PCIe 4.0 NVMe" }
                }),
                CreatedAt = DateTime.UtcNow
            },

            // Аксессуары
            new Product
            {
                Name = "AirPods Pro 2",
                Description = "Беспроводные наушники премиум-класса от Apple с активным шумоподавлением нового уровня, подавляющим в два раза больше шума. Чип H2 обеспечивает кристально чистый звук, адаптивную прозрачность и пространственное аудио с динамическим отслеживанием головы. Персонализированный пространственный звук с профилем для ваших ушей. До 6 часов прослушивания с ANC и до 30 часов с зарядным чехлом MagSafe. Защита от пота и воды IPX4 для тренировок. Сенсорное управление громкостью на ножке наушника. Чехол с динамиком для поиска через Find My, USB-C зарядка. Четыре размера силиконовых насадок для идеальной посадки.",
                Price = 24999m,
                StockQuantity = 100,
                CategoryId = categories[3].Id,
                ImageUrl = "https://i.ibb.co/0jbHbNM2/pngtree-apple-airpods-pro-wireless-earbuds-in-char-no-bg-preview-carve-photos.png",
                Specifications = JsonSerializer.Serialize(new Dictionary<string, string>
                {
                    { "Тип", "Вкладыши" },
                    { "Шумоподавление", "Активное" },
                    { "Время работы", "6 часов" },
                    { "Зарядка", "USB-C" }
                }),
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Logitech MX Master 3S",
                Description = "Профессиональная эргономичная беспроводная мышь для продуктивности с бесшумными кликами и сенсором 8000 DPI для точности на любой поверхности, включая стекло. Технология MagSpeed electromagnetic scroll обеспечивает плавную и быструю прокрутку 1000 строк в секунду. 7 настраиваемых кнопок через приложение Logi Options+ для персонализации рабочего процесса. Эргономичная форма снижает нагрузку на запястье при длительной работе. Flow позволяет работать на 3 компьютерах и переносить файлы между ними. Подключение через Bluetooth Low Energy или USB-ресивер Logi Bolt. До 70 дней работы от одного заряда, быстрая зарядка USB-C: 3 часа за 1 минуту. Бесшумные клики Quiet Clicks.",
                Price = 9999m,
                StockQuantity = 75,
                CategoryId = categories[3].Id,
                ImageUrl = "https://i.ibb.co/r2j5tfrC/wireless-mouse-logitech-mx-master-3s-pale-gray-optical-o09a-Dx-F-600.png",
                Specifications = JsonSerializer.Serialize(new Dictionary<string, string>
                {
                    { "Тип", "Беспроводная" },
                    { "DPI", "8000" },
                    { "Кнопки", "7" },
                    { "Батарея", "До 70 дней" }
                }),
                CreatedAt = DateTime.UtcNow
            },
        };

        await context.Products.AddRangeAsync(products);
        await context.SaveChangesAsync();
    }
}