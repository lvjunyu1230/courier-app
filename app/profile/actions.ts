// app/profile/actions.ts

'use server';

import { createClient } from '@/lib/supabase/actions'; // 导入可写客户端
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';



export async function updateProfile(formData: FormData) {
  console.log('--- [Server Action] updateProfile 被调用！---');
  console.log('收到的 FormData 内容:');
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`  - ${key}: [File] name=${value.name}, size=${value.size}, type=${value.type}`);
    } else {
      console.log(`  - ${key}: ${value}`);
    }
  }
  console.log('------------------------------------------');
  const supabase = createClient();

  // 1. 获取当前用户
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    // 理论上不应该发生，因为页面已经做了检查
    redirect('/login');
  }

  // 2. 从 FormData 中提取数据
  const newUsername = formData.get('username') as string;
  const avatarFile = formData.get('avatar') as File;

  let avatarUrl: string | undefined = undefined;

  // --- 头像上传逻辑 ---
  // 3. 检查用户是否上传了新文件
  if (avatarFile && avatarFile.size > 0) {
    console.log('检测到新头像文件:', avatarFile.name);

    // 4. 为文件创建一个唯一的路径和文件名
    //    我们使用用户的 UID 作为文件夹，确保每个用户的文件都隔离存储
    //    添加时间戳确保即使上传同名文件也不会覆盖
    const fileExt = avatarFile.name.split('.').pop();
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;

    // 5. 使用 Supabase Storage 上传文件
    const { error: uploadError } = await supabase.storage
      .from('avatars') // 我们之前创建的 Bucket
      .upload(filePath, avatarFile);

    if (uploadError) {
      console.error('头像上传失败:', uploadError);
      // 在生产环境中，你可能想返回一个错误信息给用户
      // return { error: '头像上传失败。' };
      throw new Error('头像上传失败: ' + uploadError.message);
    }

    // 6. 如果上传成功，获取该文件的公开 URL
 // app/profile/actions.ts

    const { data: urlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath, {
        // 使用 Supabase 的图片转换功能
        // 这会生成一个经过 CDN 优化的、可公开访问的、但源文件仍是私有的 URL
        transform: {
        width: 200, // 我们可以指定一个宽度，让 Supabase 自动缩放图片
        height: 200,
        resize: 'cover', // 裁剪模式
        },
    });

    avatarUrl = urlData.publicUrl;

    console.log('头像上传成功，URL:', avatarUrl);
  }

  // --- 数据库更新逻辑 ---
  // 7. 构建要更新到 'profiles' 表的数据对象
  const profileUpdateData: { username: string; avatar_url?: string } = {
    username: newUsername,
  };

  // 只有在成功上传了新头像后，才将 avatar_url 添加到更新对象中
  if (avatarUrl) {
    profileUpdateData.avatar_url = avatarUrl;
  }

  // 8. 执行数据库更新
  const { error: updateError } = await supabase
    .from('profiles')
    .update(profileUpdateData)
    .eq('id', user.id);

  if (updateError) {
    console.error('更新个人资料失败:', updateError);
    throw new Error('更新个人资料失败: ' + updateError.message);
  }

  console.log('个人资料更新成功！');

  // 9. 重定向到个人资料页，强制浏览器重新加载所有数据
redirect('/profile');
}
