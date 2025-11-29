// app/page.tsx (看板布局 - 完整版)

import { createClient } from "@/lib/supabase/server";
import { OrderCard } from "@/components/OrderCard"; // 导入我们新的可复用组件

// 定义 Order 类型的接口，以获得 TypeScript 的类型提示
// 确保它与 OrderCard 组件期望的 order prop 类型一致
interface Order {
  id: string;
  description: string;
  pickup_location: string;
  delivery_location: string;
  reward: number;
  created_at: string;
  requester_id: string;
  status: string;
}

// 定义 User 类型的接口，以获得 TypeScript 的类型提示
interface User {
  id: string;
  // 可以根据需要添加更多用户属性，如 email, user_metadata 等
}

export default async function HomePage() {
  const supabase = await createClient();
  
  // 1. 获取当前登录用户的信息
  const { data: { user } } = await supabase.auth.getUser();

  // 2. 获取所有订单，不再只筛选 'pending'
  const { data: allOrders, error } = await supabase
    .from("orders")
    .select(`*`)
    .order("created_at", { ascending: false });

  // 3. 错误处理
  if (error) {
    console.error("获取订单失败:", error);
    return <p className="text-center text-red-500">无法加载订单列表，请稍后再试。</p>;
  }

  // 4. 在服务器端对订单按状态进行分组
  const pendingOrders = allOrders.filter((order) => order.status === 'pending');
  const inProgressOrders = allOrders.filter((order) => order.status === 'in_progress');
  const completedOrders = allOrders.filter((order) => order.status === 'completed');

  // 5. 渲染三栏看板布局
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">订单看板</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* 待接单栏 */}
        <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold text-center sticky top-0 bg-gray-50 py-2 z-10">
            待接单 <span className="text-gray-500 font-normal">({pendingOrders.length})</span>
          </h2>
          <div className="flex flex-col gap-4">
            {pendingOrders.length > 0 ? (
              pendingOrders.map((order) => (
                <OrderCard key={order.id} order={order as Order} user={user as User | null} />
              ))
            ) : (
              <p className="text-center text-gray-500 mt-4">暂无待接单订单</p>
            )}
          </div>
        </div>

        {/* 进行中栏 */}
        <div className="flex flex-col gap-4 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold text-center sticky top-0 bg-blue-50 py-2 z-10">
            进行中 <span className="text-blue-500 font-normal">({inProgressOrders.length})</span>
          </h2>
          <div className="flex flex-col gap-4">
            {inProgressOrders.length > 0 ? (
              inProgressOrders.map((order) => (
                <OrderCard key={order.id} order={order as Order} user={user as User | null} />
              ))
            ) : (
              <p className="text-center text-gray-500 mt-4">暂无进行中订单</p>
            )}
          </div>
        </div>

        {/* 已完成栏 */}
        <div className="flex flex-col gap-4 p-4 bg-green-50 rounded-lg">
          <h2 className="text-xl font-semibold text-center sticky top-0 bg-green-50 py-2 z-10">
            已完成 <span className="text-green-500 font-normal">({completedOrders.length})</span>
          </h2>
          <div className="flex flex-col gap-4">
            {completedOrders.length > 0 ? (
              completedOrders.map((order) => (
                <OrderCard key={order.id} order={order as Order} user={user as User | null} />
              ))
            ) : (
              <p className="text-center text-gray-500 mt-4">暂无已完成订单</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
