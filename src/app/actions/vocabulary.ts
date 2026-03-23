'use server';

import { createClient } from '@/utils/supabase/server';

export async function saveToVocabulary(word: string, phonetic: string, meaning: string) {
  const supabase = createClient();
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: '로그인이 필요한 기능입니다. 오른쪽 상단에서 로그인해주세요.' };
  }

  const { error } = await supabase
    .from('user_vocabularies')
    .insert({
      user_id: user.id,
      word: word,
      meaning: meaning,
      phonetic: phonetic,
      context_sentence: "" // Optionally handled later
    });

  if (error) {
    // Unique constraint violation (code 23505) if the user already saved this word
    if (error.code === '23505') {
      return { error: '이미 단어장에 저장된 단어입니다.' };
    }
    console.error("Vocabulary Insert Error:", error);
    return { error: '단어 저장 중 서버 오류가 발생했습니다.' };
  }

  return { success: true };
}

import { revalidatePath } from 'next/cache';

export async function deleteFromVocabulary(id: number) {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '권한이 없습니다.' };

  const { error } = await supabase
    .from('user_vocabularies')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error("Vocabulary Delete Error:", error);
    return { error: '단어 삭제 중 서버 오류가 발생했습니다.' };
  }

  revalidatePath('/vocabulary');
  return { success: true };
}
