// app/create-order/page.tsx
import { createClient, createClient as createServerSupabaseClient } from '@/utils/supabase/server'; // ✅ 指向我们新的、安全的、只读的 utils/supabase/server.ts 文件

import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // 我们需要一个多行文本框
import { createOrder } from "./actions"; // 导入我们即将创建的 Server Action

export default async function CreateOrderPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 安全检查：如果用户未登录，则不允许访问此页面
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>请先登录</CardTitle>
            <CardDescription>您需要登录后才能发布新的代取订单。</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button>前往登录页面</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 如果用户已登录，则显示表单
  return (
    <div className="flex justify-center items-start py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>发布新的代取订单</CardTitle>
          <CardDescription>请填写下方的订单详情，您的订单将会出现在订单大厅中。</CardDescription>
        </CardHeader>
        <CardContent>
          {/* 将 Server Action 绑定到 form 的 action 属性 */}
          <form action={createOrder} className="space-y-6">
            
            {/* 物品描述 */}
            <div className="space-y-2">
              <Label htmlFor="description">需求描述</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="例如：一个中号快递，取件码 1-2-3456"
                required
              />
            </div>

            {/* 取件地址 */}
            <div className="space-y-2">
              <Label htmlFor="pickup_location">取件地址</Label>
              <Input
                id="pickup_location"
                name="pickup_location"
                placeholder="例如：西区菜鸟驿站"
                required
              />
            </div>

            {/* 送达地址 */}
            <div className="space-y-2">
              <Label htmlFor="delivery_location">送达地址</Label>
              <Input
                id="delivery_location"
                name="delivery_location"
                placeholder="例如：东区 12 号宿舍楼 501"
                required
              />
            </div>

            {/* 悬赏金额 */}
            <div className="space-y-2">
              <Label htmlFor="reward">悬赏金额 (元)</Label>
              <Input
                id="reward"
                name="reward"
                type="number"
                step="0.1" // 允许输入小数
                placeholder="例如：5.5"
                required
              />
            </div>

            <Button type="submit" className="w-full">发布订单</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
