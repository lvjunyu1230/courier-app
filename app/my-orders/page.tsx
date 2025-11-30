// app/my-orders/page.tsx (修正版)

import { createClient as createServerSupabaseClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { MyOrderCard } from '@/components/MyOrderCard';
import type { Order } from '@/types';

export default async function MyOrdersPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .or(`requester_id.eq.${user.id},taker_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  const orders: Order[] = data || [];

  if (error) {
    return <p className="text-red-500">加载订单数据时出错。</p>;
  }

  const publishedOrders = orders.filter(order => order.requester_id === user.id);
  const takenOrders = orders.filter(order => order.taker_id === user.id);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">我的订单</h1>

      <section>
        <h2 className="text-2xl font-semibold mb-4">我发布的 ({publishedOrders.length})</h2>
        {publishedOrders.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {publishedOrders.map(order => (
              // ✅ 关键修正: 将 "published" 改为 "requester"
              <MyOrderCard key={order.id} order={order} mode="requester" />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8 border-2 border-dashed rounded-lg">
            <p>您还没有发布任何订单。</p>
            <Link href="/create-order" className="text-blue-500 hover:underline mt-2 block">
              去发布一个新订单
            </Link>
          </div>
        )}
      </section>

      <Separator />

      <section>
        <h2 className="text-2xl font-semibold mb-4">我接受的 ({takenOrders.length})</h2>
        {takenOrders.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {takenOrders.map(order => (
              // ✅ 关键修正: 将 "taken" 改为 "taker"
              <MyOrderCard key={order.id} order={order} mode="taker" />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8 border-2 border-dashed rounded-lg">
            <p>您还没有接受任何订单。</p>
            <Link href="/" className="text-blue-500 hover:underline mt-2 block">
              去订单大厅看看
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
