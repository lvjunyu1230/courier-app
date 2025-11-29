// app/test/page.tsx
import { createClient } from "@/lib/supabase/server";

export default async function TestPage() {
  const supabase = await createClient();

  // 1. 执行最基础的查询：不带任何 .eq() 或 .like() 过滤器
  const { data, error } = await supabase
    .from("orders")
    .select("*"); // 获取所有列，不加任何条件

  // 2. 在 VS Code 终端打印结果
  console.log("【/test 页面】错误:", error);
  console.log("【/test 页面】数据:", data);

  // 3. 在浏览器页面上直接显示原始数据
  return (
    <div>
      <h1>数据库读取测试页面</h1>
      
      <h2>错误信息:</h2>
      <pre>{JSON.stringify(error, null, 2)}</pre>
      
      <h2>数据:</h2>
      {/* 我们检查 data 是否是一个数组，以避免在 data 为 null 时出错 */}
      {Array.isArray(data) ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>返回的数据不是一个数组。</p>
      )}
    </div>
  );
}
