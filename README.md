# ORAZA.RU - Крымскотатарское приложение

Приложение для крымских татар, проживающих в Крыму. Включает встречи сел, обрядовый гид, этно-календарь и систему взаимопомощи.

## Функции

- **Встречи сел** - расписание и организация встреч жителей крымскотатарских сёл
- **Микро-Ярдым** - система срочной помощи (доноры крови, волонтёры, сборы)
- **Обрядовый гид** - подробное описание традиционных обрядов (Дженазе, Никях)
- **Этно-календарь** - значимые даты и праздники
- **Карта сёл** - крымскотатарские сёла и поселения
- **Личный кабинет** - профиль пользователя с историей активности
- **Админ-панель** - управление контентом, пользователями и ролями

## Технологии

- **Next.js 14** - React фреймворк
- **TypeScript** - типизация
- **Tailwind CSS** - стилизация
- **Prisma** - ORM для работы с базой данных
- **NextAuth.js** - аутентификация (Google, Telegram)
- **PostgreSQL** - база данных (Vercel Postgres / Neon)
- **Framer Motion** - анимации

## Деплой на Vercel

### 1. Подготовка

1. Создайте аккаунт на [Vercel](https://vercel.com)
2. Создайте проект PostgreSQL (рекомендуется [Neon](https://neon.tech) или [Supabase](https://supabase.com))
3. Создайте OAuth приложение в [Google Cloud Console](https://console.cloud.google.com)

### 2. Переменные окружения

В настройках проекта на Vercel добавьте следующие переменные:

```
DATABASE_URL="postgresql://user:password@host:port/database"
NEXTAUTH_SECRET="your-random-secret-key"
NEXTAUTH_URL="https://your-project.vercel.app"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. База данных

После деплоя выполните миграции:

```bash
# Локально
npx prisma migrate dev

# Или через Vercel CLI
vercel --prod
```

Затем заполните базу начальными данными:

```bash
npx prisma db seed
```

### 4. PWA

Приложение поддерживает установку на мобильные устройства как PWA:
- iOS: Safari → Поделиться → "На экран Домой"
- Android: Chrome → Меню → "Установить приложение"

## Роли пользователей

- **USER** - обычный пользователь (может участвовать во встречах, откликаться на помощь)
- **MODERATOR** - модератор (может одобрять контент)
- **ADMIN** - администратор (полный доступ к админ-панели)
- **SUPERADMIN** - супер-администратор (может назначать администраторов)

## API Endpoints

### Meetings
- `GET /api/meetings` - список встреч
- `POST /api/meetings` - создать встречу
- `POST /api/meetings/[id]/attend` - подтвердить участие

### Emergency Help
- `GET /api/emergency` - список запросов помощи
- `POST /api/emergency` - создать запрос
- `POST /api/emergency/[id]/respond` - откликнуться

### Villages
- `GET /api/villages` - список сёл

### Calendar
- `GET /api/calendar` - события календаря

### Rituals
- `GET /api/rituals` - список обрядов

### Admin
- `GET /api/admin/stats` - статистика
- `GET /api/admin/users` - список пользователей
- `PUT /api/admin/users/[id]/role` - изменить роль

## Разработка

```bash
# Установка зависимостей
npm install

# Настройка переменных окружения
cp .env.local.example .env.local
# Отредактируйте .env.local

# Применение миграций
npx prisma migrate dev

# Заполнение базы данных
npx prisma db seed

# Запуск сервера разработки
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Лицензия

MIT License
