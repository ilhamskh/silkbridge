# SilkBridge Admin Panel

A secure, role-based admin panel for managing website content with full localization support.

## Features

- 🔐 **Secure Authentication** - Auth.js with credentials provider, rate limiting, and session management
- 👥 **Role-Based Access Control** - ADMIN and EDITOR roles with different permissions
- 🌐 **Multi-Locale Support** - Manage content in multiple languages with locale management
- 📝 **Visual Content Editor** - Block-based content editing with live preview
- ⚙️ **Site Settings** - Centralized configuration for branding, contact info, and social links
- 📊 **Dashboard** - Overview of content status across all pages and locales

## Tech Stack

- **Next.js 14** - App Router
- **PostgreSQL** - Database
- **Prisma** - ORM
- **Auth.js (NextAuth v5)** - Authentication
- **Zod** - Validation
- **Tailwind CSS** - Styling

## Setup Instructions

### 1. Environment Variables

Create or update your `.env` file:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/silkbridge?schema=public"

# Auth.js Secret (generate with: openssl rand -base64 32)
AUTH_SECRET="your-secret-key-at-least-32-characters"

# Initial Admin Credentials
ADMIN_EMAIL="admin@silkbridge.com"
ADMIN_PASSWORD="your-secure-password"
```

### 2. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed initial data (creates admin user and sample content)
npm run db:seed
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Access Admin Panel

Navigate to `http://localhost:3000/admin` and login with your admin credentials.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed initial data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | Reset database and re-seed |

## User Roles

### ADMIN
- Full access to all features
- Can manage users (create, edit, delete)
- Can manage locales (add, enable/disable, delete)
- Can manage all content and settings

### EDITOR
- Can view and edit page content
- Can manage site settings
- Cannot manage users or locales

## Admin Panel Structure

```
/admin
├── /login          # Login page
├── /               # Dashboard (stats overview)
├── /pages          # Pages list
│   └── /[slug]     # Page editor with locale selector
├── /settings       # Site settings (general, contact, social, translations)
├── /locales        # Locale management (ADMIN only)
└── /users          # User management (ADMIN only)
```

## Content Blocks

The page editor supports the following block types:

| Block Type | Description |
|------------|-------------|
| `hero` | Hero section with tagline, subtagline, and CTAs |
| `intro` | Page intro with eyebrow, headline, and text |
| `heading` | Simple heading (H1-H4) |
| `paragraph` | Rich text paragraph |
| `bullets` | Bullet list |
| `quote` | Blockquote with attribution |
| `callout` | Highlighted callout box |
| `stats` | Statistics grid |
| `statsRow` | Horizontal stats row |
| `about` | About section with pillars |
| `services` | Services section with features |
| `serviceDetails` | Individual service details |
| `partners` | Partners section |
| `contact` | Contact section with form/map options |
| `insights` | Blog insights section |
| `values` | Company values grid |
| `team` | Team members section |
| `milestones` | Timeline of milestones |
| `process` | Step-by-step process |
| `story` | Multi-paragraph story section |
| `cta` | Call-to-action section |
| `divider` | Visual divider |
| `image` | Image with caption |

## Database Schema

### Models

- **User** - Admin users with role and authentication
- **Locale** - Available languages (code, name, nativeName, RTL support)
- **Page** - Website pages (slug-based)
- **PageTranslation** - Localized page content (title, SEO, blocks)
- **SiteSettings** - Global site configuration
- **SiteSettingsTranslation** - Localized site settings (tagline, footer)

## Integrating with Public Pages

To use database content in public pages, import the helpers from `@/lib/content`:

```typescript
import { getPageContent, findBlock, getPublicSiteSettings } from '@/lib/content';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const content = await getPageContent('about', locale);
    
    if (!content) {
        // Fallback to static content or 404
        return notFound();
    }
    
    const heroBlock = findBlock(content.blocks, 'hero');
    const introBlock = findBlock(content.blocks, 'intro');
    
    return (
        <>
            {heroBlock && <HeroSection {...heroBlock} />}
            {introBlock && <IntroSection {...introBlock} />}
            {/* ... */}
        </>
    );
}
```

## Security Features

- **Rate Limiting** - Login attempts limited to 5 per 15 minutes per IP
- **Password Hashing** - bcrypt with automatic salt
- **Session Management** - JWT-based sessions with role claims
- **Route Protection** - Server-side auth checks on all admin routes
- **RBAC Enforcement** - Admin-only routes protected at page and action level

## Troubleshooting

### "Invalid credentials" error
- Ensure the user exists in the database
- Check that `isActive` is true for the user
- Verify password is correct

### Database connection issues
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check network/firewall settings

### Missing admin user
Run the seed script to create the initial admin:
```bash
npm run db:seed
```

### Rate limit exceeded
Wait 15 minutes or restart the server (clears in-memory rate limit store).

## Production Deployment

1. Set all environment variables in your hosting platform
2. Run database migrations: `npx prisma migrate deploy`
3. The seed script should NOT run in production - create admin via direct DB access or a secure setup route

## License

Proprietary - All rights reserved.
