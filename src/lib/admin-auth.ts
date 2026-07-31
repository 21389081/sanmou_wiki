import 'server-only';

import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'sanmou_admin_session';
const ADMIN_SESSION_SECONDS = 60 * 60 * 8;

function getAdminPassword(): string {
    const password = process.env.ADMIN_PASSWORD;
    if (!password) {
        throw new Error('ADMIN_PASSWORD is not configured.');
    }
    return password;
}

function hash(value: string): Buffer {
    return createHash('sha256').update(value).digest();
}

function safeEqual(left: string, right: string): boolean {
    return timingSafeEqual(hash(left), hash(right));
}

function signExpiry(expiresAt: number): string {
    return createHmac('sha256', getAdminPassword())
        .update(`sanmou-admin:${expiresAt}`)
        .digest('base64url');
}

export function verifyAdminPassword(candidate: string): boolean {
    return safeEqual(candidate, getAdminPassword());
}

export async function createAdminSession(): Promise<void> {
    const expiresAt = Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS;
    const token = `${expiresAt}.${signExpiry(expiresAt)}`;
    const cookieStore = await cookies();

    cookieStore.set(ADMIN_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: ADMIN_SESSION_SECONDS,
        path: '/admin_join_team',
    });
}

export async function isAdminSessionValid(): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token) return false;

    const separator = token.indexOf('.');
    if (separator < 1) return false;

    const expiresAtText = token.slice(0, separator);
    const signature = token.slice(separator + 1);
    const expiresAt = Number(expiresAtText);

    if (!Number.isSafeInteger(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) {
        return false;
    }

    return safeEqual(signature, signExpiry(expiresAt));
}

export async function destroyAdminSession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_COOKIE_NAME);
}
