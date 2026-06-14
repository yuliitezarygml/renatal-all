# 📦 Rental Service Platform (Bot + Admin Panel)

Добро пожаловать в современную платформу для сервиса аренды вещей! Этот проект представляет собой мощную связку из **Telegram-бота** для клиентов и красивой **Admin-панели** (Next.js) для управления бизнесом.

## 🌟 Основные возможности

### Для клиентов (Telegram Bot)
* **Каталог вещей:** Удобный просмотр доступных товаров по категориям.
* **Календарь аренды:** Визуальный интерфейс выбора дат (с проверкой доступности).
* **Способы доставки:** Выбор между самовывозом (с выбором пункта выдачи) и курьерской доставкой.
* **Соглашение:** Автоматический запрос на согласие с Политикой конфиденциальности.
* **Уведомления:** Бот моментально присылает уведомление, когда администратор одобряет, завершает или отменяет заказ.

### Для администратора (Next.js Dashboard)
* **Статистика в реальном времени:** Общий доход, активные аренды, количество клиентов.
* **Управление арендой (Rentals):** Быстрое изменение статусов заказа (Approve, Complete, Pending, Cancel).
* **Быстрая связь:** Кнопки прямого звонка, написания в Telegram или Viber в один клик.
* **Досье клиента (Users):** Полная история заказов каждого конкретного пользователя.
* **Локации (Locations):** Управление пунктами самовывоза.
* **Удобный интерфейс:** Поддержка светлой и темной темы с сохранением выбора.

---

## 🛠 Технологический стек

* **Бэкенд:** Node.js, Express.js, TypeScript
* **База данных:** PostgreSQL, Prisma ORM
* **Телеграм Бот:** Telegraf
* **Фронтенд (Админка):** React, Next.js (App Router), Tailwind CSS, Framer Motion, Lucide Icons

---

## 🚀 Руководство по установке и запуску (Гайд)

### 1. Подготовка
Убедитесь, что у вас установлены **Node.js** и **PostgreSQL**.

### 2. Клонирование и зависимости
```bash
# Клонировать репозиторий
git clone https://github.com/yuliitezarygml/renatal-all.git
cd renatal-all

# Установить зависимости для бэкенда
npm install

# Установить зависимости для фронтенда
cd admin
npm install
cd ..
```

### 3. Настройка окружения (.env)
Создайте файл `.env` в корневой папке (`D:/projecy/rental/.env`) и заполните его:
```env
PORT=3001
DATABASE_URL="postgresql://ИМЯ_ПОЛЬЗОВАТЕЛЯ:ПАРОЛЬ@localhost:5432/rental?schema=public"
BOT_TOKEN="ВАШ_TELEGRAM_BOT_TOKEN"
```

### 4. Инициализация базы данных
```bash
# Создание таблиц
npx prisma db push

# Генерация клиента Prisma
npx prisma generate
```

### 5. Запуск платформы

Для работы системы необходимо запустить два сервера одновременно (в двух разных терминалах):

**Терминал 1 (Бэкенд и Бот):**
```bash
cd renatal-all
npm run dev
# Ожидаемый вывод: "Telegram bot started. Server is running on http://localhost:3001"
```

**Терминал 2 (Админ-панель):**
```bash
cd renatal-all/admin
npm run dev
# Ожидаемый вывод: "ready - started server on 0.0.0.0:3000"
```

Теперь откройте в браузере `http://localhost:3000` и наслаждайтесь управлением!

---

## 👨‍💻 Разработка и Архитектура

### 1. Глобальная Архитектура (System Architecture)
```mermaid
flowchart TD
    %% Styling (3D Effects)
    classDef frontend fill:#3b82f6,stroke:#1d4ed8,stroke-width:4px,color:#fff;
    classDef backend fill:#10b981,stroke:#047857,stroke-width:4px,color:#fff;
    classDef db fill:#8b5cf6,stroke:#5b21b6,stroke-width:4px,color:#fff;
    classDef tg fill:#0ea5e9,stroke:#0369a1,stroke-width:4px,color:#fff;
    
    subgraph ClientLayer ["🖥 Клиентский Слой"]
        AdminUI["💻 Админ-панель\n(Next.js / React)"]:::frontend
        TGBot["📱 Telegram App\n(Пользователь)"]:::tg
    end

    subgraph ServerLayer ["⚙️ Серверный Слой"]
        API["🌐 REST API\n(Express.js + Node.js)"]:::backend
        Telegraf["🤖 Bot Logic\n(Telegraf.js)"]:::backend
    end

    subgraph DataLayer ["🗄 Слой Данных"]
        Prisma["🛠 Prisma ORM"]:::backend
        DB[("🛢️ PostgreSQL\nБаза Данных")]:::db
    end

    %% Connections
    AdminUI <==>|"HTTP JSON (Port 3001)"| API
    TGBot <==>|"Telegram API"| Telegraf
    API -.->|"Уведомления"| Telegraf
    
    API <==>|"Запросы"| Prisma
    Telegraf <==>|"Запросы"| Prisma
    
    Prisma <==>|"SQL"| DB
```

### 2. Жизненный цикл заказа (User Flow)
```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 Клиент
    participant Bot as 🤖 Telegram Бот
    participant DB as 🗄 PostgreSQL
    actor Admin as 👨‍💼 Администратор
    participant Dashboard as 💻 Админ-панель
    
    User->>Bot: Выбирает вещь и даты
    Bot->>DB: Проверка доступности (Prisma)
    DB-->>Bot: Вещь свободна ✅
    Bot->>User: Выбор доставки и принятие Правил
    User->>Bot: Согласен (Подтверждает заказ)
    Bot->>DB: Создание заказа со статусом PENDING
    Bot-->>User: 🎉 "Бронь успешно создана!"
    
    Note over Admin,Dashboard: Работа администратора
    Admin->>Dashboard: Открывает список аренд
    Dashboard->>DB: GET /api/rentals
    DB-->>Dashboard: Возвращает новый заказ
    Admin->>Dashboard: Нажимает "Approve & Activate"
    Dashboard->>DB: PUT status = ACTIVE
    DB->>Bot: Сигнал: Статус изменен
    Bot-->>User: 🔔 "Ваша аренда подтверждена!"
```

### 3. Схема Базы Данных (ER Diagram)
```mermaid
erDiagram
    User ||--o{ Rental : makes
    User ||--o{ Review : writes
    Category ||--o{ Item : contains
    Item ||--o{ Rental : rented_in
    Item ||--o{ Review : receives
    Discount ||--o{ Rental : applied_to
    Location ||--o{ Rental : pickup_at

    User {
        Int id PK
        String telegramId
        String name
        String phone
        DateTime createdAt
    }
    
    Item {
        Int id PK
        String name
        String description
        Float pricePerDay
        Float deposit
        String imageUrl
    }
    
    Rental {
        Int id PK
        DateTime startDate
        DateTime endDate
        Float totalPrice
        String status "PENDING, ACTIVE, COMPLETED, CANCELLED"
        String deliveryType "PICKUP, DELIVERY"
    }

    Location {
        Int id PK
        String name
        String address
        Boolean isActive
    }
```

### 4. Жизненный цикл статусов аренды (State Machine)
```mermaid
stateDiagram-v2
    [*] --> PENDING : Клиент оформляет заказ
    
    PENDING --> ACTIVE : Админ одобряет
    PENDING --> CANCELLED : Админ отклоняет
    
    ACTIVE --> COMPLETED : Клиент возвращает вещь
    ACTIVE --> CANCELLED : Форс-мажор / Отмена
    
    COMPLETED --> [*]
    CANCELLED --> [*]
    
    note right of PENDING
        Товар забронирован,
        ожидает подтверждения
    end note
    
    note right of ACTIVE
        Товар выдан клиенту
    end note
```

Проект построен с использованием четкого разделения логики. API бэкенда (`/src/routes`) живет отдельно от бота (`/src/bot`), но они разделяют один экземпляр базы данных через Prisma. Админ-панель общается с бэкендом через защищенную обертку `fetchApi`.
