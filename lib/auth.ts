import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { loginSchema } from '@/lib/validations';

// Role type (matches Prisma enum)
type Role = 'ADMIN' | 'EDITOR';

// Simple in-memory rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(email: string): { allowed: boolean; remainingTime?: number } {
    const now = Date.now();
    const attempt = loginAttempts.get(email);

    if (!attempt) {
        loginAttempts.set(email, { count: 1, lastAttempt: now });
        return { allowed: true };
    }

    // Reset if lockout period has passed
    if (now - attempt.lastAttempt > LOCKOUT_DURATION) {
        loginAttempts.set(email, { count: 1, lastAttempt: now });
        return { allowed: true };
    }

    // Check if locked out
    if (attempt.count >= MAX_ATTEMPTS) {
        const remainingTime = Math.ceil((LOCKOUT_DURATION - (now - attempt.lastAttempt)) / 1000);
        return { allowed: false, remainingTime };
    }

    // Increment attempt
    attempt.count++;
    attempt.lastAttempt = now;
    return { allowed: true };
}

function resetRateLimit(email: string) {
    loginAttempts.delete(email);
}

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email: string;
            name?: string | null;
            role: Role;
        };
    }

    interface User {
        id: string;
        email: string;
        name?: string | null;
        role: Role;
    }
}

// Extend JWT type
interface ExtendedJWT {
    id: string;
    role: Role;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                // Validate credentials format
                const parsed = loginSchema.safeParse(credentials);
                if (!parsed.success) {
                    throw new Error('Invalid credentials format');
                }

                const { email, password } = parsed.data;

                // Check rate limiting
                const rateLimit = checkRateLimit(email);
                if (!rateLimit.allowed) {
                    throw new Error(`Too many login attempts. Please try again in ${rateLimit.remainingTime} seconds.`);
                }

                // Find user
                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user) {
                    throw new Error('Invalid email or password');
                }

                // Check if user is active
                if (!user.isActive) {
                    throw new Error('Account has been deactivated');
                }

                // Verify password
                const isValid = await bcrypt.compare(password, user.passwordHash);
                if (!isValid) {
                    throw new Error('Invalid email or password');
                }

                // Reset rate limit on successful login
                resetRateLimit(email);

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as Role;
            }
            return session;
        },
    },
    pages: {
        signIn: '/admin/login',
        error: '/admin/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60, // 24 hours
    },
    trustHost: true,
});

// Helper to get current session on server
export async function getSession() {
    return await auth();
}

// Helper to require authentication
export async function requireAuth() {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }
    return session;
}

// Helper to require admin role
export async function requireAdmin() {
    const session = await requireAuth();
    if (session.user.role !== 'ADMIN') {
        throw new Error('Forbidden');
    }
    return session;
}
