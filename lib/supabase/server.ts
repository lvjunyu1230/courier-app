// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    // 关键修正：读取服务端的、没有 NEXT_PUBLIC_ 前缀的变量！
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: async (name: string) => (await cookieStore).get(name)?.value,
        set: async (name, value, options) => { (await cookieStore).set({ name, value, ...options }); },
        remove: async (name, options) => { (await cookieStore).set({ name, value: '', ...options }); },
      },
    }
  );
}
