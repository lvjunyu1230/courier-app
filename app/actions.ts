// app/actions.ts

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// 我们不再需要 createOrder，因为创建订单的页面有自己的 Action
// export async function createOrder(...) { ... }

export async function takeOrder(orderId: string) {
  const supabase = await createClient();

  // 1. 验证用户
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("用户未登录，无法接单。");
  }

  // 2. 执行已被证明成功的、最纯粹的 UPDATE 操作
  const { error } = await supabase
    .from("orders")
    .update({
      status: 'in_progress',
      taker_id: user.id,
    })
    .eq('id', orderId)
    .eq('status', 'pending');

  // 3. 检查 UPDATE 操作本身是否失败
  if (error) {
    // 尽管我们的测试显示这里应该是 null，但保留这个检查是好的编程习惯
    console.error("最终 takeOrder 操作失败:", error);
    throw new Error(`数据库更新失败: ${error.message}`);
  }

  // 4. 只要 UPDATE 没报错，就立即刷新首页缓存
  revalidatePath("/");
  
  console.log(`订单 ${orderId} 已被用户 ${user.id} 成功接单！`);
}
