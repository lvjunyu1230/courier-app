// app/my-orders/actions.ts

'use server';

import { createClient as createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

type ActionResult = {
  success?: string;
  error?: string;
};

// completeOrder 函数保持不变，它已经是完整的了
export async function completeOrder(orderId: number): Promise<ActionResult> {
  console.log(`[Server Action] 正在尝试完成订单，ID: ${orderId}`);
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: '用户未登录，无法完成订单。' };
  }

  const { error } = await supabase
    .from('orders')
    .update({ status: 'completed' })
    .eq('id', orderId)
    .eq('requester_id', user.id)
    .eq('status', 'in_progress'); // 注意：这里我们之前用了 in_progress，如果你的状态是 taken，需要改成 .eq('status', 'taken')

  if (error) {
    console.error('完成订单数据库操作失败:', error);
    return { error: `操作失败: ${error.message}` };
  }

  revalidatePath('/my-orders');
  return { success: `订单 #${orderId} 已成功完成！` };
}

// --- 我们将在这里启用 cancelOrder 的真实逻辑 ---
export async function cancelOrder(orderId: number): Promise<ActionResult> {
  console.log(`[Server Action] 正在尝试取消订单，ID: ${orderId}`);

  // 1. 创建 Supabase 客户端实例
  const supabase = await createServerSupabaseClient();
  
  // 2. 获取当前用户信息，用于权限检查
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: '用户未登录，无法取消订单。' };
  }

  // 3. 执行数据库删除操作
  const { error } = await supabase
    .from('orders') // 从 'orders' 表
    .delete() // 删除记录
    .eq('id', orderId) // 条件1: 匹配我们传入的订单 ID
    .eq('requester_id', user.id) // 条件2: 权限检查！确保只有订单的发布者才能删除
    .eq('status', 'pending'); // 条件3: 确保只在订单是 'pending' 状态时才能删除

  // 4. 处理数据库操作可能返回的错误
  if (error) {
    console.error('取消订单数据库操作失败:', error);
    return { error: `操作失败: ${error.message}` };
  }

  // 5. 清除缓存并触发页面重新渲染
  revalidatePath('/my-orders');
  
  // 6. 返回成功信息
  return { success: `订单 #${orderId} 已成功取消！` };
}
