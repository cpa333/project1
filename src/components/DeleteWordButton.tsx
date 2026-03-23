'use client';

import { useTransition } from 'react';
import { deleteFromVocabulary } from '@/app/actions/vocabulary';

export default function DeleteWordButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm('이 단어를 단어장에서 삭제하시겠습니까?')) return;
    
    startTransition(async () => {
      await deleteFromVocabulary(id);
    });
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className={`text-red-400 p-1 transition-all ${isPending ? 'opacity-50 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100 hover:text-red-600 active:scale-95'}`}
      title="삭제"
    >
      {isPending ? '...' : '삭제'}
    </button>
  );
}
