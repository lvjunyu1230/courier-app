// app/safe-test/page.tsx (使用全新的安全客户端)

// 1. ✅ 关键修改：从新的路径导入客户端
import { createClient } from '@/utils/supabase/server';

export default async function SafeTestPage() {
  
  // 2. ✅ 这个 createClient 是我们新创建的安全版本
  const supabase = createClient();

  // 3. ✅ 现在这个调用应该是绝对安全的
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">✅ Supabase 最终安全测试页面</h1>
      <p>此页面在渲染期间，使用【全新的、位于 utils/supabase/server.ts 的】客户端调用了 `supabase.auth.getUser()`。</p>
      
      <div className="mt-6 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-lg font-semibold">用户信息获取结果:</h2>
        {user ? (
          <pre className="mt-2 bg-white p-2 rounded">
            {JSON.stringify(user, null, 2)}
          </pre>
        ) : (
          <p className="mt-2 text-gray-500">当前未登录。</p>
        )}
      </div>

      <p className="mt-4 text-green-700 font-bold">
        如果你能看到这个页面，就证明我们找到了最终的解决方案！
      </p>
    </div>
  );
}
