# A.K Enterprises Full-Stack Project

> A modern, full-stack clone of AK Enterprises website — telecom/radio/CCTV equipment supplier with government contractor credentials.

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **React Router v6** for routing
- **Vite** for build tooling
- **Axios** for API calls
- **CSS Modules** for styling

### Backend
- **Laravel 11** REST API
- **MySQL/MariaDB** database
- **Laravel Sanctum** for API token authentication
- **Laravel Mail** for transactional emails

## Project Structure

```
ak-enter project/
├── frontend-react-ts/frontend/    (React TypeScript SPA)
│   ├── src/
│   │   ├── pages/                 (7 routed pages)
│   │   ├── components/            (UI components)
│   │   ├── context/               (Auth, ProductFilter context)
│   │   ├── hooks/                 (useAuth, useProductFilter, useProducts, etc.)
│   │   ├── services/              (API client, product/category/contact services)
│   │   ├── types/                 (TypeScript interfaces)
│   │   └── styles/                (Global CSS, variables)
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── backend-laravel/backend/       (Laravel REST API)
    ├── app/
    │   ├── Models/                (User, Product, Category, etc.)
    │   ├── Http/Controllers/Api/  (Public & admin API endpoints)
    │   └── Mail/                  (Email templates)
    ├── database/
    │   ├── migrations/            (Database schema)
    │   └── seeders/               (Sample data)
    ├── routes/api.php             (API route definitions)
    └── .env.example               (Environment template)
```

## Quick Start

### 1. Frontend Setup (React TypeScript)

```bash
cd frontend-react-ts/frontend

# Install dependencies
npm install

# Start development server (localhost:5173)
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

**Features:**
- ✅ Full responsive design
- ✅ 7 pages: Home, About, Products, ProductDetail, SecuritySolutions, Contact, NotFound
- ✅ Form validation (Contact, Quote Request, Newsletter)
- ✅ Category filters, search functionality
- ✅ Mock data fallback (works without backend)
- ✅ TypeScript for type safety

### 2. Backend Setup (Laravel API)

**Prerequisites:** PHP 8.1+, MySQL 8.0+, Composer

```bash
cd backend-laravel/backend

# 1. Install dependencies
composer install

# 2. Setup environment
cp .env.example .env
php artisan key:generate

# 3. Configure database in .env
DB_DATABASE=ak_enterprises
DB_USERNAME=root
DB_PASSWORD=

# 4. Run migrations & seed data
php artisan migrate
php artisan db:seed

# 5. Create storage symlink
php artisan storage:link

# 6. Start server (localhost:8000)
php artisan serve
```

**Default Admin Credentials:**
- Email: `admin@akenterprises.test`
- Password: `password123`

**API Documentation:** See [backend-laravel/backend/README_BACKEND.md](backend-laravel/backend/README_BACKEND.md)

## Features

### Public Features (No Authentication)
- Browse products by category/brand
- Search products by name/brand
- View product details (specs, accessories, pricing)
- Submit contact inquiries
- Request quotes for products
- Subscribe to newsletter
- View "Security Solutions" offerings

### Admin Features (Requires Login)
- View all inquiries/quotes submitted
- Create, edit, delete product categories
- Create, edit, delete products with images
- Upload product images and specs
- Manage newsletter subscribers

## API Endpoints

### Public (No Auth Required)
```
GET  /api/categories
GET  /api/categories/featured
GET  /api/products?category=&search=&featured=
GET  /api/products/{slug}
POST /api/inquiries
POST /api/newsletter/subscribe
```

### Admin (Requires Sanctum Token)
```
POST /api/admin/login
POST /api/admin/logout
GET  /api/admin/inquiries
POST /api/admin/categories
PUT  /api/admin/categories/{id}
DELETE /api/admin/categories/{id}
POST /api/admin/products
PUT  /api/admin/products/{id}
DELETE /api/admin/products/{id}
```

## Development Workflow

### Full Stack Development

**Terminal 1: Backend**
```bash
cd backend-laravel/backend
php artisan serve
```

**Terminal 2: Frontend**
```bash
cd frontend-react-ts/frontend
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Testing the API

Use Postman/Insomnia to test:

1. **Login**
   ```
   POST http://localhost:8000/api/admin/login
   Body: { "email": "admin@akenterprises.test", "password": "password123" }
   ```

2. **Use token in requests**
   ```
   GET http://localhost:8000/api/admin/inquiries
   Header: Authorization: Bearer {token}
   ```

## Build Status

| Component | Status |
|-----------|--------|
| Frontend TypeScript | ✅ Compiles |
| Frontend Build | ✅ 316 KB production bundle |
| Frontend Linter | ✅ Zero warnings |
| Frontend Dev Server | ✅ Running on 5173 |
| Backend Structure | ✅ Complete |
| Database Schema | ✅ All migrations ready |
| Admin Auth | ✅ Sanctum configured |
| Seeders | ✅ 4 categories + 4 products + admin user |

## Fixes Applied in This Session

### Frontend
1. ✅ Fixed missing `SectionHeading` import in ProductsPage.tsx
2. ✅ Refactored React context architecture for Fast Refresh compliance
   - Split contexts into separate definition files
   - Moved hooks to dedicated hook files
3. ✅ Eliminated all linter warnings (oxlint)

### Backend
1. ✅ Added safe fallback for contact email config
2. ✅ Created missing `User` model with Sanctum support
3. ✅ Created users table migration with is_admin column
4. ✅ Made add_is_admin migration idempotent
5. ✅ Created `UserSeeder` to seed admin user
6. ✅ Updated `DatabaseSeeder` to call UserSeeder
7. ✅ Added comprehensive backend README and setup guide

## Environment Variables

### Frontend (`.env` in frontend-react-ts/frontend/)
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_SITE_NAME=A.K Enterprises
```

### Backend (`.env` in backend-laravel/backend/)
```env
APP_NAME="A.K Enterprises API"
APP_ENV=local
DB_CONNECTION=mysql
DB_DATABASE=ak_enterprises
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:5173
FRONTEND_URL=http://localhost:5173

MAIL_MAILER=smtp
CONTACT_NOTIFICATION_EMAIL=admin@akenterprises.test
```

## Deployment Checklist

- [ ] Set `APP_ENV=production` in backend .env
- [ ] Set `APP_DEBUG=false` in backend .env
- [ ] Run `npm run build` for frontend production build
- [ ] Run `php artisan migrate` on production database
- [ ] Configure proper SMTP service for email
- [ ] Update `SANCTUM_STATEFUL_DOMAINS` for your domain
- [ ] Enable HTTPS and update CORS settings
- [ ] Change admin password from default
- [ ] Set strong `APP_KEY` in backend .env
- [ ] Enable database backups
- [ ] Set up CI/CD pipeline (GitHub Actions, etc.)

## Troubleshooting

### Frontend won't start
```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install
npm run dev
```

### Backend migration errors
```bash
# Reset database (development only!)
php artisan migrate:reset
php artisan migrate
php artisan db:seed
```

### API connection errors
- Check backend is running: `http://localhost:8000`
- Check CORS is enabled in Laravel
- Verify `SANCTUM_STATEFUL_DOMAINS` includes frontend URL
- Check `.env` variables match your environment

## Next Steps

1. **Run locally** — Follow Quick Start section
2. **Test API** — Use Postman to test endpoints
3. **Build UI** — Develop admin dashboard (not yet implemented)
4. **Add real images** — Replace placeholder product images
5. **Configure email** — Setup Mailtrap/SendGrid for production
6. **Deploy** — See Deployment Checklist

## Documentation

- **Frontend Details:** See [frontend-react-ts/frontend/README.md](frontend-react-ts/frontend/README.md)
- **Backend Details:** See [backend-laravel/backend/README_BACKEND.md](backend-laravel/backend/README_BACKEND.md)
- **Project Spec:** See [AK-Enterprises-Clone-Spec.md](AK-Enterprises-Clone-Spec.md) (original specification)

## Support

For issues or questions:
1. Check the README files for your component
2. Review the spec document for requirements
3. Check browser console for frontend errors
4. Check `php artisan tinker` for backend testing

## License

Proprietary - A.K Enterprises
