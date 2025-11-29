// app/login/actions-logout.ts
"use server"; // 声明这是一个 Server Action 文件

import { createClient } from "@/lib/supabase/actions"; // ✅ 指向我们新的、可写的 actions.ts 文件

import { redirect } from "next/navigation";

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login"); // 退出后重定向到登录页面
}
