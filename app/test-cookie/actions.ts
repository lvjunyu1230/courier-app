'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function getUserFromAction(prevState: any, formData: FormData) {
  // 1. 在 Server Action 内部获取可写的 cookieStore
  const cookieStore = cookies();

  // 2. 在 Server Action 内部创建 Supabase 客户端
  //    这个客户端现在可以安全地读写 Cookie
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // 在 Server Action 中，这里不应该再报错
            console.error('Error setting cookie in Server Action:', error);
          }
        },
        remove(name: string, options) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            console.error('Error removing cookie in Server Action:', error);
          }
        },
      },
    }
  );

  try {
    // 3. 执行会话刷新和用户信息获取
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      return { user: null, error: `Server Action Error: ${error.message}` };
    }
    
    // 4. 返回用户信息
    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: `Server Action Exception: ${error.message}` };
  }
}
