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

    // Redirects for restructured pages
    if (pathname.includes('/partners')) {
        const url = request.nextUrl.clone();
        url.pathname = pathname.replace('/partners', '/about');
        // Hash isn't passed to server, but we can append it to the redirect URL string
        // However, NextUrl object handles it? No, hash is client-side.
        // We construct the string.
        return NextResponse.redirect(new URL(`${url.pathname}#partnerships`, request.url));
    }

    if (pathname.includes('/market-insights')) {
        const url = request.nextUrl.clone();
        url.pathname = pathname.replace('/market-insights', '');
        // Ensure trailing slash logic matches (if emptied, it becomes root / or /en)
        if (url.pathname === '' || url.pathname === '/' || url.pathname.match(/^\/[a-z]{2}$/)) {
            // fine
        } else if (url.pathname.endsWith('/')) {
            url.pathname = url.pathname.slice(0, -1);
        }
        return NextResponse.redirect(url);
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
