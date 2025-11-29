'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';

type User = {
  id: string;
  email?: string;
};

type ActionResult = {
  user: User | null;
  error: string | null;
};

// Server Action 现在作为 formAction 传递，我们需要一个初始状态
const initialState: ActionResult = {
  user: null,
  error: null,
};

// 1. 创建一个独立的组件来处理按钮的 pending 状态
function SubmitButton() {
  // useFormStatus 必须在 <form> 的子组件中使用
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? '正在调用 Server Action...' : '点击这里，在 Server Action 中获取用户'}
    </Button>
  );
}

export default function TestButton({ action }: { action: (prevState: ActionResult, formData: FormData) => Promise<ActionResult> }) {
  // 2. 使用 useFormState hook 来管理表单状态
  const [state, formAction] = useFormState(action, initialState);

  return (
    // 3. 将 Server Action 绑定到 form 上
    <form action={formAction}>
      <SubmitButton />
      {state && (
        <div style={{ marginTop: '1rem', background: '#e6ffed', padding: '1rem', borderRadius: '8px' }}>
          <strong>Server Action 返回结果:</strong>
          {state.error ? (
            <p style={{ color: 'red' }}>{state.error}</p>
          ) : (
            <pre>{JSON.stringify(state.user, null, 2) || '未登录'}</pre>
          )}
        </div>
      )}
    </form>
  );
}
