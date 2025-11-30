// components/OrderCard.tsx (在你的代码基础上修改)

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { takeOrder } from "@/app/actions";

// 定义组件接收的 props 类型 (保持不变)
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
  user: { id: string } | null;
}

export function OrderCard({ order, user }: OrderCardProps) {
  const isMyOrder = user?.id === order.requester_id;

  // ==================== ↓↓↓ 新增：渲染状态徽章的函数 ↓↓↓ ====================
  const renderStatusBadge = () => {
    switch (order.status) {
      case 'pending':
        return <Badge variant="default">待接单</Badge>; // 蓝色
      case 'in_progress':
        return <Badge variant="secondary">进行中</Badge>; // 灰色
      case 'completed':
        // 使用自定义颜色让“已完成”更突出
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">已完成</Badge>;
      default:
        // 对于任何未知状态，显示一个通用的徽章
        return <Badge variant="outline">{order.status}</Badge>;
    }
  };
  // ==================== ↑↑↑ 新增：渲染状态徽章的函数 ↑↑↑ ====================

  return (
    <Card className="flex flex-col relative"> 
      {isMyOrder && (
        <Badge 
          variant="default" 
          className="absolute top-2 right-2 bg-indigo-500 text-white"
        >
          我的
        </Badge>
      )}

      <CardHeader>
        <CardTitle className="truncate pr-12">{order.description}</CardTitle>
        <CardDescription>
          发布于: {new Date(order.created_at).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        {/* ==================== ↓↓↓ 新增：在这里调用状态徽章函数 ↓↓↓ ==================== */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-600">状态:</span>
          {renderStatusBadge()}
        </div>
        {/* ==================== ↑↑↑ 新增：在这里调用状态徽章函数 ↑↑↑ ==================== */}
        <p><strong>从:</strong> {order.pickup_location}</p>
        <p><strong>到:</strong> {order.delivery_location}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Badge variant="secondary">悬赏 ¥{order.reward}</Badge>
        
        {/* 接单按钮逻辑保持完全不变 */}
        {order.status === 'pending' && !isMyOrder && user && (
          <form action={takeOrder.bind(null, order.id)}>
            <Button type="submit">接单</Button>
          </form>
        )}

        {/* 这里的禁用按钮逻辑也保持完全不变 */}
        {order.status === 'in_progress' && isMyOrder && (
          <Button disabled>确认完成</Button>
        )}
      </CardFooter>
    </Card>
  );
}
