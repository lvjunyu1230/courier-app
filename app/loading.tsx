// app/loading.tsx

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  // 模仿看板的三列布局
  return (
    <div className="space-y-8">
      {/* 模仿页面标题 */}
      <Skeleton className="h-10 w-1/3" />

      {/* 模仿看板容器 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 模仿第一列 */}
        <div className="flex flex-npm run devcol space-y-4">
          <Skeleton className="h-8 w-1/2" /> {/* 列标题 */}
          <CardSkeleton /> {/* 卡片骨架 */}
          <CardSkeleton /> {/* 卡片骨架 */}
        </div>

        {/* 模仿第二列 */}
        <div className="flex flex-col space-y-4">
          <Skeleton className="h-8 w-1/2" /> {/* 列标题 */}
          <CardSkeleton /> {/* 卡片骨架 */}
        </div>

        {/* 模仿第三列 */}
        <div className="flex flex-col space-y-4">
          <Skeleton className="h-8 w-1/2" /> {/* 列标题 */}
          <CardSkeleton /> {/* 卡片骨架 */}
          <CardSkeleton /> {/* 卡片骨架 */}
          <CardSkeleton /> {/* 卡片骨架 */}
        </div>

      </div>
    </div>
  );
}

// 创建一个可复用的卡片骨架组件，让代码更整洁
function CardSkeleton() {
  return (
    <div className="flex flex-col space-y-3 p-4 border rounded-lg">
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="h-4 w-3/5" />
      <div className="space-y-2 pt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="flex justify-between items-center pt-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-8 w-1/3" />
      </div>
    </div>
  );
}
