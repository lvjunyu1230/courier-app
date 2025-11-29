// components/Header.tsx (修正版)

import { createClient as createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from './ui/button';
import { logout } from '@/app/login/actions-logout'; // 1. ✅ 导入你的 logout Server Action

export default async function Header() {
  const supabase = await createServerSupabaseClient();
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
              
              {/* 2. ✅ 将 form 的 action 直接绑定到导入的 logout 函数上 */}
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
