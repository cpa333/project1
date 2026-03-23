'use client';

import { useTransition } from 'react';
import { deleteAccount } from '@/app/actions/user';

export default function DeleteAccountButton() {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm('정말 계정을 삭제하시겠습니까? 저장된 모든 단어장 데이터와 계정 정보가 영구적으로 삭제되며 복구할 수 없습니다.')) return;
    
    startTransition(async () => {
      const res = await deleteAccount();
      if (res?.error) {
        alert(res.error);
      }
    });
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className={`px-4 py-2 text-sm font-semibold text-gray-500 bg-gray-100 rounded-lg transition-colors border border-gray-200 ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50 hover:text-red-600 hover:border-red-200 active:scale-95'}`}
      title="회원 탈퇴"
    >
      {isPending ? '처리 중...' : '회원 탈퇴'}
    </button>
  );
}
