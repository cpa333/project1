import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import DeleteWordButton from '@/components/DeleteWordButton';
import DeleteAccountButton from '@/components/DeleteAccountButton';

export const revalidate = 0; // Dynamic route

export default async function VocabularyPage() {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  const { data: words, error } = await supabase
    .from('user_vocabularies')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-8 text-center font-bold text-red-500">단어장 데이터를 불러오는데 실패했습니다.</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 animate-in mb-8">
      <header className="flex flex-col gap-2 border-b border-gray-200 pb-5 pt-4 px-2 md:px-0">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 flex flex-wrap items-center gap-3">
          My Vocabulary
        </h1>
        <p className="text-base md:text-lg font-medium text-gray-500 mt-1">
          뉴스 스크립트를 읽으며 저장한 나만의 영단어장입니다.
        </p>
      </header>

      {!words || words.length === 0 ? (
        <div className="text-center p-16 bg-white rounded-3xl border border-gray-100 shadow-sm mt-4 mx-2 md:mx-0">
          <h3 className="text-xl font-bold text-gray-800 mt-4">아직 저장된 단어가 없습니다.</h3>
          <p className="text-md text-gray-500 mt-2">홈으로 돌아가 뉴스 스크립트의 단어를 클릭해 첫 단어를 저장해보세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 px-2 md:px-0">
          {words.map((w: any) => (
            <div key={w.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3 group hover:shadow-md hover:-translate-y-1 hover:border-blue-200 transition-all">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-extrabold text-blue-700 tracking-tight">{w.word}</h3>
                <DeleteWordButton id={w.id} />
              </div>
              <span className="text-md font-medium text-gray-500">{w.phonetic}</span>
              <p className="text-gray-800 font-bold text-lg leading-snug break-words">{w.meaning}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-6 mb-12">
        <DeleteAccountButton />
      </div>
    </div>
  );
}
