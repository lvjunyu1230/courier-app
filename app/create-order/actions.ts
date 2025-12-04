// app/create-order/actions.ts
"use server";

import { createClient } from '@/lib/supabase/actions'; // ✅ 指向我们为 Actions 创建的可写客户端


import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 我们不再需要 FormState，因为 action 不再返回状态给 hook
// export async function createOrder(prevState, formData) { ... } // 旧签名
export async function createOrder(formData: FormData) { // <--- 新签名：只接收 formData
  const supabase = createClient(); // ✅ 无需 await


  // 1. 验证用户是否登录
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    // 在这个模式下，如果出错，我们只能抛出错误
    throw new Error("用户未登录，无法创建订单。");
  }

  // 2. 从 FormData 中提取数据
  const description = formData.get("description") as string;
  const pickup_location = formData.get("pickup_location") as string;
  const delivery_location = formData.get("delivery_location") as string;
  const reward = formData.get("reward") as string;

  // 3. 数据校验 (基础)
  if (!description || !pickup_location || !delivery_location || !reward) {
    throw new Error("所有字段均为必填项。");
  }
  const rewardValue = parseFloat(reward);
  if (isNaN(rewardValue) || rewardValue <= 0) {
    throw new Error("悬赏金额必须是一个大于零的数字。");
  }

  // 4. 构建要插入数据库的对象
  const orderData = {
    requester_id: user.id,
    description,
    pickup_location,
    delivery_location,
    reward: rewardValue,
  };

  // 5. 将数据插入到 'orders' 表
  const { error } = await supabase.from("orders").insert(orderData);

  if (error) {
    console.error("创建订单失败:", error);
    throw new Error(`数据库错误：${error.message}`);
  }

  // 6. 操作成功后的处理
  revalidatePath("/"); 
  redirect("/");
}
