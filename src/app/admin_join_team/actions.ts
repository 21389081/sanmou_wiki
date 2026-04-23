"use server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function verifyAdminPassword(password: string): Promise<boolean> {
    if (!ADMIN_PASSWORD) {
        console.error('ADMIN_PASSWORD not configured in environment');
        return false;
    }
    return password === ADMIN_PASSWORD;
}