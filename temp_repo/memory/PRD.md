# Sophie Lamour - Life Coaching Website PRD

## Original Problem Statement
Build a modern, elegant, SEO-optimised life coaching website for Sophie Lamour. French (primary) with English toggle. Non-technical admin panel for blogs and testimonials. Blue gradient color palette. Native contact form with RGPD consent, WhatsApp contact button, Google Maps (Chateau-Landon 77570), Rich Text Editor for blog creation.

## Architecture
- **Frontend**: React 19 + Tailwind CSS + Shadcn/UI
- **Backend**: FastAPI + MongoDB (Motor async driver)
- **Auth**: JWT (httpOnly cookies) with bcrypt password hashing
- **Rich Text**: Vanilla Quill 2.x (mounted via useRef, React 19 concurrent-safe)
- **i18n**: Custom LanguageContext (FR/EN toggle)
- **File Storage**: MongoDB binary (base64) for Kubernetes persistence

## What's Been Implemented
- Multi-page site: Home, About, Services (4 main + 3 technique sub-pages), Blog, Testimonials, Contact
- French/English language toggle
- Blue gradient color palette (#03045E to #CAF0F8)
- Admin panel: Login, Dashboard, Blog Editor (WYSIWYG), Testimonial Editor
- Blog CRUD with rich text editor (create + edit)
- Testimonials CRUD (create + edit)
- WhatsApp floating contact button (+33 689844778)
- Google Maps embed (Chateau-Landon 77570)
- Enhanced contact form with service checkboxes, RGPD consent, admin view
- SEO: Helmet meta tags on all pages
- Custom brand logo (sophie_logo.jpg) in header and footer
- Custom SVG favicon (botanical flower, navy circle background)
- "Mes outils & approches" techniques section on homepage

## Site Structure (Current)
### Navigation: Accueil | Qui suis-je ? | Services (dropdown) | Blog | Contact

### Services (bookable, in dropdown):
1. Accompagnement personnel
2. Accompagnement professionnel
3. Accompagnement parentalite
4. Home Organising

### Techniques (homepage section, individual pages):
1. Ikigai
2. Yoga du Rire
3. Art-therapie
4. Pleine conscience

## Key Endpoints
- POST /api/auth/login, GET /api/auth/me, POST /api/auth/logout
- GET/POST /api/blog/posts, GET/PUT/DELETE /api/blog/posts/:id
- GET/POST /api/testimonials, PUT/DELETE /api/testimonials/:id
- POST /api/contact (enhanced: firstName, lastName, interestedServices, consent)
- GET /api/contact/requests (admin only)
- POST /api/uploads, GET /api/uploads/:id

## Admin Credentials
- Email: admin@sophielamour.com
- Password: SophieAdmin2025!

## P0 - None (all critical features implemented)

## P1 - Upcoming
- Update sitemap.xml and meta titles/descriptions for new URL structure
- Backend refactoring: split server.py into route modules

## P2 - Backlog
- Social media auto-posting for blogs
- Social media feed sync on homepage
- Delete Appointment.js file (no longer routed)
