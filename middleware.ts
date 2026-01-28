import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Skip middleware for admin routes - handled by admin layout
    if (pathname.startsWith('/admin')) {
        return NextResponse.next();
    }

    // Skip middleware for API routes
    if (pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    // Apply i18n middleware for all other routes
    return intlMiddleware(request);
}

export const config = {
    // Match only internationalized pathnames
    matcher: [
        // Match all pathnames except for
        // - api routes
        // - _next/static (static files)
        // - _next/image (image optimization files)
        // - favicon.ico, sitemap.xml, robots.txt (metadata files)
        // - Public files with extensions
        '/((?!api|_next|_vercel|.*\\..*).*)',
    ],
};
