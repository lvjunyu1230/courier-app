// utils/supabase/server.ts (添加调试代码后)

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createClient = () => {
  const cookieStore = cookies();

  // ==================== ↓↓↓ 添加这行调试代码 ↓↓↓ ====================
  console.log('DEBUG: Reading NEXT_PUBLIC_SUPABASE_URL in utils/supabase/server.ts:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  // ==================== ↑↑↑ 添加这行调试代码 ↑↑↑ ====================

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
};
