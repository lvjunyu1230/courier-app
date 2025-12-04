// app/profile/page.tsx (添加上传 UI)

'use client';

// 1. 导入 useRef
import { useEffect, useState, useRef } from 'react';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button'; // 导入 Button
import { updateProfile } from './actions'; // 导入我们的 Server Action


interface ProfileData {
  user: User | null;
  profile: Profile | null;
}

export default function ProfilePage() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 2. 创建一个 ref 来引用文件输入框
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      // ... (这部分代码保持不变)
      try {
        const response = await fetch('/api/profile');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '获取数据失败');
        }
        const profileData = await response.json();
        console.log('--- [客户端验证] ---');
        console.log('从 /api/profile 获取到的最终数据:', profileData);
        console.log('即将用于渲染的 avatar_url:', profileData?.profile?.avatar_url);
        console.log('----------------------');
        setData(profileData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  // 3. 创建一个函数来处理头像点击事件
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return <ProfileSkeleton />;
  }
  if (error) {
    return <p className="text-red-500">错误: {error}</p>;
  }
  if (!data || !data.user || !data.profile) {
    return <p>无法加载用户信息，请尝试重新登录。</p>;
  }

  return (
    <div className="flex justify-center items-start py-8">
      {/* 4. 将所有内容包裹在一个 form 中 */}
      <form 
        action={updateProfile} 
        encType="multipart/form-data"  // <--- 添加这个属性！
        className="w-full max-w-2xl"
      >

        <Card>
          <CardHeader>
            <CardTitle>个人资料</CardTitle>
            <CardDescription>在这里查看并更新您的个人信息。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* 5. 添加文件输入框和可点击的头像 */}
            <div className="space-y-2">
              <Label>头像</Label>
              <div className="flex items-center space-x-4">
                {/* 让头像变得可点击，并添加一个悬停效果 */}
                <Avatar 
                  key={data.profile.avatar_url} // 使用 avatar_url 作为 key
                  className="h-20 w-20 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={handleAvatarClick}
                >
                  <AvatarImage src={data.profile.avatar_url || ''} alt={data.profile.username || 'User'} />
                  <AvatarFallback>{data.profile.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="text-sm text-gray-500">
                  <p>点击头像更换</p>
                  <p>支持 PNG, JPG, GIF, 最大 1MB</p>
                </div>
                {/* 隐藏的文件输入框 */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  name="avatar"
                  className="hidden"
                  accept="image/png, image/jpeg, image/gif"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">昵称</Label>
              {/* 让输入框变为可编辑 */}
              <Input id="username" name="username" defaultValue={data.profile.username || ''} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">注册邮箱</Label>
              <Input id="email" value={data.user.email || ''} readOnly disabled />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="joined_at">加入时间</Label>
              <Input id="joined_at" value={new Date(data.user.created_at).toLocaleDateString()} readOnly disabled />
            </div>

          </CardContent>
          {/* 6. 添加 CardFooter 和提交按钮 */}
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit">更新资料</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

// ProfileSkeleton 组件保持不变
function ProfileSkeleton() {
  // ... (骨架屏代码保持不变)
  return (
    <div className="flex justify-center items-start py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-2/3 mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Skeleton className="h-10 w-24" />
        </CardFooter>
      </Card>
    </div>
  );
}
