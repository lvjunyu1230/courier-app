// components/MyOrderCard.tsx (最终版)

'use client'; // 这是一个交互式组件，因为它包含按钮和状态

import type { Order } from '@/types';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormattedDate } from './FormattedDate';
import { completeOrder, cancelOrder } from '@/app/my-orders/actions'; // 导入两个 Server Actions

// 定义组件接收的 props 类型
interface MyOrderCardProps {
  order: Order;
  mode: 'requester' | 'taker';
}

export function MyOrderCard({ order, mode }: MyOrderCardProps) {
  // 为按钮操作添加 loading 状态，防止重复点击
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 创建一个包装函数来调用 completeOrder Server Action
  const handleCompleteSubmit = async () => {
    setIsSubmitting(true);
    try {
      await completeOrder(order.id);
      // 成功后，revalidatePath 会自动刷新页面，这里无需做其他事
    } catch (error) {
      console.error("完成订单失败:", error);
      alert("操作失败，请稍后再试。");
      setIsSubmitting(false); // 如果出错，需要恢复按钮状态
    }
  };

  // 创建一个包装函数来调用 cancelOrder Server Action
  const handleCancelSubmit = async () => {
    // 增加一个二次确认，防止用户误触
    if (!confirm(`您确定要取消这个订单吗？\n描述: ${order.description}`)) {
      return;
    }
    setIsSubmitting(true);
    try {
      await cancelOrder(order.id);
    } catch (error) {
      console.error("取消订单失败:", error);
      alert("操作失败，请稍后再试。");
      setIsSubmitting(false);
    }
  };

  // 根据 mode 和订单状态，决定渲染哪个操作按钮
  const renderActions = () => {
    switch (mode) {
      case 'requester':
        if (order.status === 'pending') {
          return (
            <form onSubmit={(e) => { e.preventDefault(); handleCancelSubmit(); }}>
              <Button type="submit" variant="destructive" size="sm" disabled={isSubmitting}>
                {isSubmitting ? '处理中...' : '取消订单'}
              </Button>
            </form>
          );
        } else if (order.status === 'in_progress') {
          return (
            <form onSubmit={(e) => { e.preventDefault(); handleCompleteSubmit(); }}>
              <Button type="submit" variant="default" size="sm" disabled={isSubmitting}>
                {isSubmitting ? '处理中...' : '确认完成'}
              </Button>
            </form>
          );
        }
        return null; // 'completed' 状态不显示任何操作按钮

      case 'taker':
        if (order.status === 'in_progress') {
          // 未来可以添加“放弃订单”的逻辑
          return <Button variant="outline" size="sm" disabled>已接单</Button>;
        }
        return null;

      default:
        return null;
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="truncate">{order.description}</CardTitle>
        <CardDescription>
          <FormattedDate dateString={order.created_at} />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <p><strong>从:</strong> {order.pickup_location}</p>
        <p><strong>到:</strong> {order.delivery_location}</p>
        <p><strong>状态:</strong> {order.status}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="font-bold text-lg">¥{order.reward}</span>
        {renderActions()}
      </CardFooter>
    </Card>
  );
}
