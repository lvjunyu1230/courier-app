// components/FormattedDate.tsx
'use client';

import { useState, useEffect } from 'react';

interface FormattedDateProps {
  dateString: string;
}

export function FormattedDate({ dateString }: FormattedDateProps) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    // useEffect 只在客户端运行，所以这里的 new Date() 是在浏览器环境中执行的
    setFormattedDate(new Date(dateString).toLocaleString());
  }, [dateString]);

  // 初始渲染时返回 null 或一个占位符，避免水合错误
  // 水合完成后，useEffect 会更新状态，并显示正确的客户端格式化日期
  return <>{formattedDate || '...'}</>;
}
