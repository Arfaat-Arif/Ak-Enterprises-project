# A.K. ENTERPRISES — FULLY DYNAMIC IMPLEMENTATION PLAN

## 1. PURPOSE
Convert the existing A.K. Enterprises website into a genuinely backend-driven, fully dynamic system.

**Mentor requirement:** “hur cheez dynamic honi chahiye”.

Extend the existing project; do not rebuild it from scratch.

## 2. STACK
**Frontend:** React, TypeScript, Vite, React Router, Axios, Framer Motion, existing Tailwind/CSS/UI.

**Backend:** Laravel 11, PHP, Sanctum, MySQL, Laravel Storage.

Reuse the existing architecture and conventions.

## 3. CRITICAL AGENT RULES
1. Inspect the existing project before changing anything.
2. Do not rebuild the project.
3. Do not replace the existing architecture unnecessarily.
4. Do not delete working features.
5. Do not redesign unless implementation requires it.
6. Preserve current visual design, responsiveness, and animations.
7. Never invent A.K. Enterprises information.
8. Move existing business content into the database.
9. Do not silently use large hardcoded business-data fallbacks.
10. Reusable UI structure may remain in React.
11. Business content/data must come from Laravel.
12. Admin changes must appear publicly without React source edits.
13. Do not store arbitrary CSS/layout code in the database.
14. Use validation, authorization, secure uploads, and proper errors.
15. Reuse existing Sanctum authentication; do not create duplicate auth.
16. Run migrations, seeders/tests/checks/build where applicable.
17. Fix errors before completing a phase.
18. Implement one phase at a time.
19. After each phase, report and STOP. Do not continue automatically.

## 4. WHAT “FULLY DYNAMIC” MEANS
If an administrator changes editable business content in the backend/admin panel, the React website must show the new value without changing React source code.

Eventually dynamic:
- site name, logo, favicon
- tagline/sub-tagline
- contact details/address/hours
- navigation
- hero content, images, videos, CTAs
- brands/logos
- industries
- services
- products/categories
- product images/videos/descriptions/specifications
- case studies
- insights/news
- trust statistics
- footer/social links
- editable page content
- ordering, visibility, featured status
- relevant SEO metadata

React owns reusable presentation/layout/responsiveness/animations. Laravel/MySQL owns business content.

## 5. TARGET ARCHITECTURE
```text
Admin Panel
    ↓
Laravel API
    ├── MySQL
    └── Laravel Storage
    ↓
React Frontend
```

Public React pages consume Laravel APIs. Admin APIs are protected with the existing Sanctum authentication.

## 6. TARGET DATABASE / CMS MODULES

Existing:
- users
- categories
- products
- product_images
- inquiries
- newsletter_subscribers

Add as needed:

### site_settings
id, site_name, tagline, sub_tagline, logo_path, favicon_path, contact_email, contact_phone, address, business_hours, timestamps.

### navigation_items
id, label, url, parent_id nullable, sort_order, is_active, open_in_new_tab, timestamps.

### hero_sections
id, title, description, badge, background_image_path, background_video_path, primary_button_text, primary_button_url, secondary_button_text, secondary_button_url, sort_order, is_active, timestamps.

### brands
id, name, logo_path, website_url, sort_order, is_featured, is_active, timestamps.

### industries
id, name, slug, short_description, description, image_path, icon, url, sort_order, is_featured, is_active, timestamps.

### services
id, name, slug, short_description, description, image_path, icon, url, sort_order, is_featured, is_active, timestamps.

### case_studies
id, title, slug, client_name, summary, description, image_path, url, sort_order, is_featured, is_active, timestamps.

### insights
id, title, slug, excerpt, content, image_path, published_at, author, sort_order, is_featured, is_active, timestamps.

### trust_stats
id, label, value, suffix, sort_order, is_active, timestamps.

### footer_links
id, group_name, label, url, sort_order, is_active, timestamps.

### social_links
id, platform, label, url, icon, sort_order, is_active, timestamps.

### pages / page_sections
Use only if needed for editable static content such as About, Contact, Security Solutions. Do not create an unnecessarily complex page builder and do not store arbitrary CSS/layout code in DB.

## 7. RELATIONSHIPS
- Category hasMany Products.
- Product belongsTo Category.
- Product hasMany ProductImages.
- NavigationItem belongsTo parent NavigationItem.
- NavigationItem hasMany child NavigationItems.
- Other modules remain independent unless a real business relationship is required.

# 8. IMPLEMENTATION PHASES

## PHASE 1 — SITE SETTINGS
Implement:
- migration/model/controller/resource as appropriate
- public `GET /api/settings`
- protected `GET /api/admin/settings`
- protected `PUT /api/admin/settings`
- validation
- logo and favicon uploads
- Laravel Storage
- seeder using existing A.K. Enterprises information
- frontend API service/hook/state
- dynamic Header logo/site name
- dynamic Footer contact information
- dynamic metadata where appropriate
- minimum admin Settings UI

**Acceptance:** admin can change logo/contact/site settings and the public site updates without React source edits.

**STOP after Phase 1.**

## PHASE 2 — NAVIGATION
Implement migration/model, public API, protected admin CRUD, admin UI, nesting, ordering, active/inactive state and external-link support. Replace hardcoded Header navigation while preserving its appearance/dropdowns.

**STOP after Phase 2.**

## PHASE 3 — HERO
Implement hero model/migration/API/admin CRUD, image/video uploads, CTA text/URLs, ordering, active state and admin UI. Replace hardcoded HeroBanner content while preserving design, responsiveness and Framer Motion.

**STOP after Phase 3.**

## PHASE 4 — BRANDS
Implement brands migration/model/API/admin CRUD, logo uploads, website URL, ordering, active/featured state and admin UI. Replace hardcoded BrandsMarquee data.

**STOP after Phase 4.**

## PHASE 5 — INDUSTRIES
Implement industries migration/model/API/admin CRUD, image/icon support, ordering, active/featured state and admin UI. Replace hardcoded Industries data.

**STOP after Phase 5.**

## PHASE 6 — SERVICES
Implement services migration/model/API/admin CRUD, media, ordering, active/featured state and admin UI. Replace hardcoded Security Solutions service data.

**STOP after Phase 6.**

## PHASE 7 — PRODUCTS AND CATEGORIES
Improve the existing backend rather than rebuilding it. Add/fix product media/video, descriptions, specifications, featured/active state, ordering, filtering/search, slugs, image replacement/removal and admin UI.

Remove large mock-data fallbacks. API failures must show proper loading/error/empty states instead of fake business data.

**STOP after Phase 7.**

## PHASE 8 — CASE STUDIES
Implement migration/model, public API, protected admin CRUD, media, ordering, active/featured state and admin UI. Replace hardcoded CaseStudiesSection data.

**STOP after Phase 8.**

## PHASE 9 — INSIGHTS / NEWS
Implement migration/model, public API, protected admin CRUD, image, published date, author, status, featured state, slug, content and excerpt. Replace hardcoded Insights/news data.

**STOP after Phase 9.**

## PHASE 10 — TRUST / STATISTICS
Implement migration/model, public API, protected admin CRUD, ordering and active state. Replace hardcoded TrustBar statistics.

**Do not invent statistics.**

**STOP after Phase 10.**

## PHASE 11 — FOOTER AND SOCIAL
Implement footer_links/social_links migrations/models/APIs/admin CRUD, ordering and active state. Replace hardcoded Footer/social data.

**STOP after Phase 11.**

## PHASE 12 — STATIC PAGES
Review About, Contact, Security Solutions and other business-content pages. Move editable business text into backend page/section data where appropriate while preserving React layout/design. Keep Contact submission through Laravel.

**STOP after Phase 12.**

## 9. FINAL ADMIN PANEL
Final sections:
- Dashboard
- Settings
- Navigation
- Hero
- Brands
- Industries
- Services
- Categories
- Products
- Case Studies
- Insights/News
- Trust Statistics
- Footer Links
- Social Links
- Inquiries
- Newsletter Subscribers

Where applicable: create/read/update/delete, search/filter, active/featured, ordering, media upload/replacement/removal.

All admin APIs must be protected.

## 10. MEDIA
Backend-controlled media includes logo, favicon, hero images/videos, brand logos, industry/service images, product images/videos, case-study images and insight images.

Use Laravel Storage. Return usable media URLs through the API. On replacement/deletion, safely clean old files and avoid orphaned media. Validate MIME type and upload size.

## 11. DATA ENTRY
After each module is implemented, enter the existing A.K. Enterprises data.

The final CMS must not be empty.

Use existing:
- project content
- images/media
- product/category data
- company information

Do not invent company facts, statistics, products, brands or claims.

Use seeders and/or the admin panel.

Required flow:
```text
Real A.K. Enterprises Data
        ↓
      MySQL
        ↓
     Laravel
        ↓
       API
        ↓
React Frontend
```

## 12. REMOVE HARDCODED BUSINESS DATA
Audit and eventually remove hardcoded business data from:
- SITE_CONFIG business values
- Header navigation
- Footer
- HeroBanner
- BrandsMarquee
- IndustriesSection
- Services/Security Solutions
- CaseStudiesSection
- InsightsSection
- TrustBar
- ShopForSection
- TechnologySection
- TopCollections
- mockData
- hardcoded product/category fallback data

**Allowed in React:** reusable UI components, layout, CSS, animations, technical configuration.

**Must come from Laravel:** business names, product names, brands, statistics, descriptions, nav labels, images, videos, links, contact information.

## 13. API DESIGN
Eventually provide public APIs such as:
```text
GET /api/settings
GET /api/navigation
GET /api/hero
GET /api/brands
GET /api/industries
GET /api/services
GET /api/categories
GET /api/products
GET /api/case-studies
GET /api/insights
GET /api/trust-stats
GET /api/footer-links
GET /api/social-links
```

Admin APIs should follow the existing protected pattern:
```text
GET    /api/admin/settings
PUT    /api/admin/settings
GET    /api/admin/navigation
POST   /api/admin/navigation
PUT    /api/admin/navigation/{id}
DELETE /api/admin/navigation/{id}
```

Use consistent HTTP statuses, JSON responses, validation errors, resources where useful and pagination for large collections.

## 14. FRONTEND
Use the existing architecture. Prefer reusable API services, hooks and types. Provide loading/error/empty states. Do not hide backend failures with large hardcoded mock arrays.

## 15. PERFORMANCE / UX
Preserve responsive design, animations and accessibility. Use optimized/lazy media where appropriate, pagination for large datasets, efficient Laravel queries and eager loading where appropriate. Avoid unnecessary API requests and overengineering.

## 16. SECURITY
Use Sanctum/admin authorization, request validation, mass-assignment protection, safe file validation, MIME/size restrictions and secure storage paths.

Never expose passwords, API secrets, database credentials or `.env` secrets. Do not commit sensitive `.env` values.

## 17. TESTING
After each phase verify:

### Backend
- migrations
- models
- validation
- public APIs
- admin authentication
- CRUD
- uploads where applicable

### Frontend
- API services
- loading/error/empty states
- TypeScript
- production build
- actual integration

Fix errors before completing the phase.

## 18. FINAL FULL-DYNAMIC AUDIT
Search React for hardcoded:
- business names
- navigation
- contact information
- statistics
- products/categories
- brands
- services/industries
- case studies
- insights/news
- image/video paths
- mock data
- large API fallbacks

Classify remaining hardcoded values as:
1. UI structure — allowed
2. Business data — must come from Laravel
3. Technical configuration — may remain in code/env

## 19. FINAL ACCEPTANCE CRITERIA
Complete only when:
- Laravel is the business-content source of truth.
- React primarily consumes backend APIs.
- Admin can manage website content.
- Logo/settings/navigation/hero are dynamic.
- Hero media is dynamic.
- Brands/industries/services/products/categories are dynamic.
- Product media is dynamic.
- Case studies and insights/news are dynamic.
- Trust statistics are dynamic.
- Footer/social links are dynamic.
- Relevant page content is dynamic.
- Real A.K. Enterprises data has been entered.
- Mock business fallbacks are removed.
- Media is served through Laravel Storage/API.
- Admin APIs are protected.
- Existing design/functionality remains intact.

## 20. HOW THE AGENT MUST WORK
For every phase:
1. Inspect existing implementation.
2. Briefly explain required changes.
3. Implement the phase.
4. Run migrations/checks/tests/build.
5. Fix errors.
6. Verify backend API.
7. Verify frontend integration.
8. Report exactly what changed and what was verified.
9. STOP.

Do not automatically continue.

## 21. FIRST COMMAND FOR THE CODING AGENT
After placing this file in the project root, give the coding agent:

> Read `IMPLEMENTATION_PLAN.md` completely.
>
> Inspect the existing A.K. Enterprises project.
>
> Start **ONLY PHASE 1 — SITE SETTINGS**.
>
> Do not implement Phase 2 or any later phase.
>
> Follow every rule in `IMPLEMENTATION_PLAN.md`.
>
> Actually modify the project files.
>
> Run the required migrations, checks, and frontend/backend verification.
>
> Fix any errors you encounter.
>
> At the end, report exactly what you changed and what was verified.
>
> Then STOP.
