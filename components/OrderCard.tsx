// components/OrderCard.tsx

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { takeOrder } from "@/app/actions";

// 定义组件接收的 props 类型
interface OrderCardProps {
  order: {
    id: string;
    description: string;
    pickup_location: string;
    delivery_location: string;
    reward: number;
    created_at: string;
    requester_id: string;
    status: string;
  };
  user: { id: string } | null; // 当前登录用户
}

export function OrderCard({ order, user }: OrderCardProps) {
  // ==================== ↓↓↓ 核心逻辑：判断是否为自己的订单 ↓↓↓ ====================
  const isMyOrder = user?.id === order.requester_id;
  // ==================== ↑↑↑ 核心逻辑：判断是否为自己的订单 ↑↑↑ ====================

  return (
    // ==================== ↓↓↓ 核心修改 1：添加 relative 定位容器 ↓↓↓ ====================
    <Card className="flex flex-col relative"> 
      {/* 如果是自己的订单，就在右上角显示一个 Badge */}
      {isMyOrder && (
        <Badge 
          variant="default" 
          className="absolute top-2 right-2 bg-indigo-500 text-white"
        >
          我的
        </Badge>
      )}
    {/* ==================== ↑↑↑ 核心修改 1：添加 relative 定位容器 ↑↑↑ ==================== */}

      <CardHeader>
        <CardTitle className="truncate pr-12">{order.description}</CardTitle> {/* 增加右边距，避免与 Badge 重叠 */}
        <CardDescription>
          发布于: {new Date(order.created_at).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <p><strong>从:</strong> {order.pickup_location}</p>
        <p><strong>到:</strong> {order.delivery_location}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Badge variant="secondary">悬赏 ¥{order.reward}</Badge>
        
        {/* ==================== ↓↓↓ 核心修改 2：简化按钮逻辑 ↓↓↓ ==================== */}
        {/* 只有在 'pending' 状态且非自己的订单时，才显示“接单”按钮 */}
        {order.status === 'pending' && !isMyOrder && user && (
          <form action={takeOrder.bind(null, order.id)}>
            <Button type="submit">接单</Button>
          </form>
        )}

        {/* 只有在 'in_progress' 状态且是自己的订单时，才显示“确认完成”按钮 */}
        {order.status === 'in_progress' && isMyOrder && (
          <Button disabled>确认完成</Button> // 暂时禁用
        )}
        {/* ==================== ↑↑↑ 核心修改 2：简化按钮逻辑 ↑↑↑ ==================== */}
      </CardFooter>
    </Card>
  );
}
