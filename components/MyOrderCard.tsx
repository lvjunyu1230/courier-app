// components/MyOrderCard.tsx

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types";
// 1. 导入我们新创建的 Server Actions
import { completeOrder, cancelOrder } from "@/app/my-orders/actions";
import { FormattedDate } from './FormattedDate'; // 导入新组件

interface MyOrderCardProps {
  order: Order;
  mode: 'published' | 'taken';
}

export function MyOrderCard({ order, mode }: MyOrderCardProps) {
  
  // 2. 修改点击处理函数，使其调用 Server Action
  const handleCancel = async () => {
    console.log(`[客户端] 正在调用 cancelOrder, ID: ${order.id}`);
    const result = await cancelOrder(order.id); // 调用 Server Action
    if (result.error) {
      alert(`错误: ${result.error}`);
    } else {
      alert(`成功: ${result.success}`); // 显示从服务器返回的消息
    }
  };

  const handleComplete = async () => {
    console.log(`[客户端] 正在调用 completeOrder, ID: ${order.id}`);
    const result = await completeOrder(order.id); // 调用 Server Action
    if (result.error) {
      alert(`错误: ${result.error}`);
    } else {
      alert(`成功: ${result.success}`); // 显示从服务器返回的消息
    }
  };

  // renderActions 函数保持不变...
  const renderActions = () => {
    if (mode === 'published') {
      if (order.status === 'pending') {
        return <Button variant="destructive" onClick={handleCancel}>取消订单</Button>;
      }
      if (order.status === 'in_progress' || order.status === 'taken') {
        return <Button variant="default" onClick={handleComplete}>确认完成</Button>;
      }
    }
    if (mode === 'taken') {
      if (order.status === 'in_progress' || order.status === 'taken') {
        return <Button disabled>已接单</Button>;
      }
    }
    if (order.status === 'completed') {
      return <span className="text-sm text-gray-500">已完成</span>;
    }
    return null;
  };

  // Card 的 JSX 结构保持不变...
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span className="truncate pr-4">{order.description || '无描述'}</span>
          <Badge variant={order.status === 'pending' ? 'default' : 'secondary'}>
            {order.status}
          </Badge>
        </CardTitle>
        <CardDescription>
          发布于: <FormattedDate dateString={order.created_at} />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <p><strong>从:</strong> {order.pickup_location}</p>
        <p><strong>到:</strong> {order.delivery_location}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="font-bold text-xl text-red-500">¥{order.reward}</span>
        {renderActions()}
      </CardFooter>
    </Card>
  );
}
