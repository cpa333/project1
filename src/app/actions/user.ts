'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function deleteAccount() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: '로그인이 필요합니다.' };
  }

  // Use the custom RPC strictly built to allow a user to cascade-delete their own profile and auth.users row
  const { error } = await supabase.rpc('delete_user_account');
  
  if (error) {
    console.error("Account delete error:", error);
    return { error: `[오류 상세] ${error.message}` };
  }
  
  // Ignore signOut errors if the user was successfully deleted
  await supabase.auth.signOut().catch(() => {});
  
  redirect('/');
}
