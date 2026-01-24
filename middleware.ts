import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

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
