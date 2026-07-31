import 'server-only';

import { createServerClient } from '@supabase/ssr';

export function createAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    if (!url || !secretKey) {
        throw new Error('Supabase admin environment variables are not configured.');
    }

    return createServerClient(url, secretKey, {
        cookies: {
            getAll() {
                return [];
            },
            setAll() {
                // This elevated client must never inherit a browser auth session.
            },
        },
    });
}
