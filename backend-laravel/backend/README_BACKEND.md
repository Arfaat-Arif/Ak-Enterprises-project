# A.K Enterprises Backend API

Laravel 11 API backend for the A.K Enterprises website (telecom/radio/CCTV equipment supplier).

## Quick Start

### Prerequisites
- PHP 8.1+
- MySQL 8.0+ (or MariaDB 10.6+)
- Composer
- Node.js (for frontend only)

### Installation

1. **Clone and install dependencies**
   ```bash
   cd backend-laravel/backend
   composer install
   ```

2. **Setup environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Configure database in `.env`**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=ak_enterprises
   DB_USERNAME=root
   DB_PASSWORD=
   ```

4. **Configure mail (optional but recommended)**
   ```env
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.mailtrap.io
   MAIL_PORT=2525
   MAIL_USERNAME=your_mailtrap_username
   MAIL_PASSWORD=your_mailtrap_password
   CONTACT_NOTIFICATION_EMAIL=admin@akenterprises.test
   ```

5. **Configure Sanctum for frontend development**
   ```env
   SANCTUM_STATEFUL_DOMAINS=localhost:5173
   SESSION_DOMAIN=localhost
   FRONTEND_URL=http://localhost:5173
   ```

6. **Run migrations and seed sample data**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

7. **Symlink public storage**
   ```bash
   php artisan storage:link
   ```

8. **Start the development server**
   ```bash
   php artisan serve
   ```
   API will be available at `http://localhost:8000`

## Admin Login

After seeding, use these credentials to log in to the admin panel:
- **Email:** `admin@akenterprises.test`
- **Password:** `password123`

**⚠️ Important:** Change this password in production!

## Database Schema

### Users Table
- `id` (primary key)
- `name` (string)
- `email` (string, unique)
- `email_verified_at` (timestamp, nullable)
- `password` (string, hashed)
- `is_admin` (boolean, default: false)
- `remember_token` (string, nullable)
- `timestamps` (created_at, updated_at)

### Categories Table
- `id` (primary key)
- `name` (string)
- `slug` (string, unique)
- `type` (enum: 'brand', 'product_type', 'security')
- `image_path` (string, nullable)
- `is_featured` (boolean, default: false)
- `sort_order` (unsigned integer, default: 0)
- `timestamps` (created_at, updated_at)

### Products Table
- `id` (primary key)
- `category_id` (foreign key → categories.id)
- `brand` (string)
- `name` (string)
- `slug` (string, unique)
- `sku` (string, unique)
- `short_description` (string)
- `description` (text)
- `specs` (JSON, nullable)
- `accessories` (JSON, nullable)
- `price` (decimal, nullable)
- `is_featured` (boolean, default: false)
- `is_active` (boolean, default: true)
- `timestamps` (created_at, updated_at)

### Product Images Table
- `id` (primary key)
- `product_id` (foreign key → products.id, cascade delete)
- `image_path` (string)
- `alt` (string, nullable)
- `sort_order` (unsigned integer, default: 0)
- `timestamps` (created_at, updated_at)

### Inquiries Table
- `id` (primary key)
- `product_id` (foreign key → products.id, nullable, set null on delete)
- `name` (string)
- `email` (string)
- `phone` (string, nullable)
- `company` (string, nullable)
- `message` (text)
- `status` (enum: 'new', 'contacted', 'closed', default: 'new')
- `timestamps` (created_at, updated_at)

### Newsletter Subscribers Table
- `id` (primary key)
- `email` (string, unique)
- `subscribed_at` (timestamp)
- `is_active` (boolean, default: true)
- `timestamps` (created_at, updated_at)

### Site Settings Table
- `id` (primary key)
- `site_name`, `tagline`, `sub_tagline`
- `logo_path`, `favicon_path` (Laravel public Storage paths, nullable)
- `contact_email`, `contact_phone`, `address`, `business_hours`
- `timestamps` (created_at, updated_at)

## API Endpoints

### Public Endpoints (No Authentication Required)

#### Categories
- `GET /api/categories` — List all categories, optional filter by type: `?type=brand`
- `GET /api/categories/featured` — List featured categories (homepage tiles)

#### Products
- `GET /api/products` — List all active products with pagination
  - Query params: `category=slug`, `search=term`, `featured=1`, `page=2`
- `GET /api/products/{slug}` — Get single product with images, specs, accessories

#### Contact & Newsletter
- `POST /api/inquiries` — Submit contact form or quote request
  - Body: `{ productId?, name, email, phone?, company?, message }`
- `POST /api/newsletter/subscribe` — Subscribe to newsletter

#### Site Settings
- `GET /api/settings` — Read the public site settings
  - Body: `{ email }`

### Protected Endpoints (Requires Sanctum Token)

#### Admin Authentication
- `POST /api/admin/login` — Login and receive token
  - Body: `{ email, password }`
  - Returns: `{ token }`
- `POST /api/admin/logout` — Logout (invalidate token)

#### Admin: Inquiries
- `GET /api/admin/inquiries` — View all inquiries (paginated)

#### Admin: Categories
- `POST /api/admin/categories` — Create category
  - Body: `{ name, type, image?, is_featured?, sort_order? }`
- `PUT /api/admin/categories/{id}` — Update category
- `DELETE /api/admin/categories/{id}` — Delete category

#### Admin: Products
- `POST /api/admin/products` — Create product (multipart form-data)
  - Body: `{ category_id, brand, name, sku, short_description, description, specs?, accessories?, price?, is_featured?, is_active?, images?[] }`
- `PUT /api/admin/products/{id}` — Update product
- `DELETE /api/admin/products/{id}` — Delete product

#### Admin: Site Settings
- `GET /api/admin/settings` — Read the current settings
- `PUT /api/admin/settings` — Update settings and optionally upload `logo`/`favicon`

The settings endpoints require a valid Sanctum token belonging to an admin user. Uploaded media is stored on
the `public` Laravel Storage disk and returned as usable `logoUrl` and `faviconUrl` values.

## API Response Format

### Success Response
```json
{
  "data": { /* resource or array of resources */ },
  "meta": { /* pagination meta if list endpoint */ }
}
```

### Error Response
```json
{
  "message": "Error description",
  "errors": { /* validation errors if applicable */ }
}
```

## Testing with Postman/Insomnia

### 1. Login and Get Token
```
POST http://localhost:8000/api/admin/login
Content-Type: application/json

{
  "email": "admin@akenterprises.test",
  "password": "password123"
}
```
Save the returned `token`.

### 2. Use Token in Requests
```
GET http://localhost:8000/api/admin/inquiries
Authorization: Bearer {token}
```

## Troubleshooting

### Database Connection Error
- Ensure MySQL is running
- Check `.env` database credentials
- Run `php artisan migrate:status` to verify migrations

### Storage Link Error
- Run `php artisan storage:link` in backend directory
- Ensure `storage/app/public` directory exists

### Mail Not Sending
- Check `.env` mail configuration
- Use [Mailtrap](https://mailtrap.io/) for testing (free)
- Verify `CONTACT_NOTIFICATION_EMAIL` is set

### Sanctum Token Issues
- Ensure `SANCTUM_STATEFUL_DOMAINS` includes frontend URL
- Check `SESSION_DOMAIN` matches your domain
- Verify token is being sent in `Authorization: Bearer {token}` header

## Production Deployment

1. Set `APP_ENV=production` and `APP_DEBUG=false` in `.env`
2. Run `php artisan config:cache` to cache configuration
3. Run `php artisan route:cache` to cache routes
4. Ensure `FRONTEND_URL` and `SANCTUM_STATEFUL_DOMAINS` are set correctly
5. Use a proper SMTP service for email
6. Set up HTTPS and update CORS configuration
7. Run migrations on production: `php artisan migrate --force`
8. Don't commit `.env` to version control

## License

Proprietary - A.K Enterprises
