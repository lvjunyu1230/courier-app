import Link from 'next/link';
// 1. 从你的服务端文件 '@/lib/supabase/server' 导入
//    注意：由于你的 server.ts 和 client.ts 都导出了 createClient，
//    我们在这里使用 `as` 关键字重命名，以避免混淆。
import { createClient as createServerSupabaseClient } from '@/lib/supabase/server';
import { Button } from './ui/button';

/**
 * 这是一个服务端组件 (Server Component)。
 * 它在服务器上渲染，直接获取用户数据，避免了客户端加载闪烁问题。
 */
export default async function Header() {
  // 2. 调用你自己的服务端 createClient 函数。
  //    因为你的函数是 async 的，所以这里必须使用 `await`。
  const supabase = await createServerSupabaseClient();

  // 3. 在服务端直接异步获取用户信息
  const { data: { user } } = await supabase.auth.getUser();

  // 根据获取到的 user 状态，直接渲染最终的 UI
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          代取快递平台
        </Link>
        <nav>
          {user ? (
            // 如果用户已登录，渲染用户信息和退出按钮
            <div className="flex items-center gap-4">
              <Link href="/my-orders" className="hover:text-gray-300">
                我的订单
              </Link>
              <span className="text-sm" title={user.email}>
                {user.email}
              </span>
              <form action="/auth/sign-out" method="post">
                <Button type="submit" variant="secondary" size="sm">
                  退出
                </Button>
              </form>
            </div>
          ) : (
            // 如果用户未登录，渲染登录/注册按钮
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="secondary">登录/注册</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
