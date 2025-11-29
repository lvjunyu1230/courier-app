// app/login/page.tsx
'use client';

import { useFormStatus } from 'react-dom';
import { useState } from 'react';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { login, signup } from "./actions";

// --- 定义组件内部的状态类型 ---
type State = {
  error?: string;
  message?: string;
};

// --- 登录表单组件 ---
function LoginForm() {
  const [state, setState] = useState<State | undefined>();
  
  const handleSubmit = async (formData: FormData) => {
    const result = await login(formData);
    setState(result);
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email-login">邮箱</Label>
        <Input id="email-login" name="email" type="email" required placeholder="you@example.com" />
      </div>
      <div>
        <Label htmlFor="password-login">密码</Label>
        <Input id="password-login" name="password" type="password" required />
      </div>
      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      <SubmitButton text="登录" pendingText="登录中..." />
    </form>
  );
}

// --- 注册表单组件 ---
function SignupForm() {
  const [state, setState] = useState<State | undefined>();

  const handleSubmit = async (formData: FormData) => {
    const result = await signup(formData);
    setState(result);
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email-signup">邮箱</Label>
        <Input id="email-signup" name="email" type="email" required placeholder="you@example.com" />
      </div>
      <div>
        <Label htmlFor="password-signup">密码</Label>
        <Input id="password-signup" name="password" type="password" required />
      </div>
      {state?.message && <p className="text-sm text-green-500">{state.message}</p>}
      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      <SubmitButton text="注册" pendingText="注册中..." />
    </form>
  );
}

// --- 统一的提交按钮 ---
function SubmitButton({ text, pendingText }: { text: string, pendingText: string }) {
  const { pending } = useFormStatus();
  return <Button type="submit" className="w-full" disabled={pending}>{pending ? pendingText : text}</Button>;
}

// --- 主页面组件 ---
export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">登录</TabsTrigger>
          <TabsTrigger value="signup">注册</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>登录</CardTitle>
              <CardDescription>输入您的凭据以访问您的账户。</CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>注册</CardTitle>
              <CardDescription>创建一个新账户以开始使用。</CardDescription>
            </CardHeader>
            <CardContent>
              <SignupForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
