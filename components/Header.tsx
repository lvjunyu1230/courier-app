// components/Header.tsx (最终、绝对安全版)

// 1. ✅ 关键修正：确保导入路径是 @/utils/supabase/server
import { createClient } from '@/utils/supabase/server'; 

import Link from 'next/link';
import { Button } from './ui/button';
import { logout } from '@/app/login/actions-logout';

// Header 是一个 async 组件，它自己获取数据
export default async function Header() {
  // 2. ✅ 现在这个 createClient() 调用的是我们全新的、安全的客户端
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          代取快递平台
        </Link>
        <nav>
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/my-orders" className="hover:text-gray-300">
                我的订单
              </Link>
              <span className="text-sm">{user.email}</span>
              <form action={logout}>
                <Button type="submit" variant="secondary" size="sm">退出</Button>
              </form>
            </div>
          ) : (
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
