// app/login/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

// --- 定义返回状态的类型 ---
type State = {
  error?: string;
  message?: string;
};

// --- 登录函数 ---
export async function login(formData: FormData): Promise<State> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: '登录失败：凭据无效。' };
  }

  redirect('/');
}

// --- 注册函数 ---
export async function signup(formData: FormData): Promise<State> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  // 因为关闭了邮件确认，signUp 会直接返回一个有效的 session
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    // 我们不再需要 emailRedirectTo 了
  });

  if (error) {
    console.error('Signup Error:', error);
    return { error: '注册失败：无法创建用户。' };
  }

  // 检查是否成功获取了用户和会话
  if (data.user && data.session) {
    // 注册成功并直接登录，重定向到首页
    redirect('/');
  }

  // 如果因为某些未知原因没有获取到 session，则提示用户手动登录
  return { message: '注册成功！现在您可以直接登录了。' };
}