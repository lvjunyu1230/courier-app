import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getUserFromAction } from './actions';

// 这是一个客户端组件，用于处理按钮点击和显示结果
import TestButton from './TestButton'; 

export default async function TestCookiePage() {
  // --- 错误复现区 ---
  // 我们将在这里尝试直接在服务端组件中创建一个可能写入 cookie 的客户端
  
  let initialUser = null;
  let initialError = '';

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // 在服务端组件的渲染期间，调用 set 会导致你遇到的错误
        set(name: string, value: string, options) {
          // 为了防止页面直接崩溃，我们用 try-catch 包裹
          // 在你的实际情况中，这里就是错误的来源
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            console.error('!!! CAUGHT EXPECTED ERROR in Server Component render:', error);
            initialError = '错误复现：在服务端组件渲染期间尝试设置 Cookie 失败。';
          }
        },
        remove(name: string, options) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            console.error('!!! CAUGHT EXPECTED ERROR in Server Component render:', error);
            initialError = '错误复现：在服务端组件渲染期间尝试移除 Cookie 失败。';
          }
        },
      },
    }
  );

  // 这个调用可能会触发上面的 set 方法，从而导致错误
  const { data } = await supabase.auth.getUser();
  if (data.user) {
    initialUser = data.user;
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Supabase Cookie 写入测试</h1>
      <p>这个页面用来测试在不同上下文中调用 Supabase Auth 的行为。</p>
      
      <hr style={{ margin: '2rem 0' }} />

      <h2>1. 服务端组件直接加载</h2>
      <p>
        我们在页面加载时（服务端组件渲染期间）直接调用 <code>supabase.auth.getUser()</code>。
        如果你的 Supabase token 需要刷新，这将尝试写入 cookie 并触发错误。
      </p>
      <div style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '8px' }}>
        <strong>加载时获取的用户信息:</strong>
        {initialError ? (
          <p style={{ color: 'red' }}>{initialError}</p>
        ) : (
          <pre>{JSON.stringify(initialUser, null, 2) || '未登录'}</pre>
        )}
      </div>

      <hr style={{ margin: '2rem 0' }} />

      <h2>2. 在 Server Action 中调用</h2>
      <p>
        点击下面的按钮，将在一个 Server Action 中安全地调用 <code>supabase.auth.getUser()</code>。
        这是 Next.js App Router 的推荐做法。
      </p>
      {/* 我们需要一个客户端组件来处理点击事件 */}
      <TestButton action={getUserFromAction} />
    </div>
  );
}
