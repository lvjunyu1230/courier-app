// components/Header.tsx (添加了发布订单按钮)

import { createClient } from '@/utils/supabase/server'; 
import Link from 'next/link';
import { Button } from './ui/button';
import { logout } from '@/app/login/actions-logout';
import { PlusIcon } from 'lucide-react'; // ✅ 导入 PlusIcon

export default async function Header() {
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

              <Link href="/profile" className="hover:text-gray-300">
              个人资料
              </Link>

              {/* ✅ 添加了指向 /create-order 的链接按钮 */}
              <Link href="/create-order">
                <Button variant="default" size="sm">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  发布订单
                </Button>
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
