import { createClient } from '@/utils/supabase/server';
import ScriptTabs from '@/components/ScriptTabs';

export const revalidate = 3600; // Cache for 1 hour

export default async function Home() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  let savedWordsList: string[] = [];
  if (user) {
    const { data: vocab } = await supabase.from('user_vocabularies').select('word').eq('user_id', user.id);
    if (vocab) savedWordsList = vocab.map(v => v.word.toLowerCase());
  }

  // Fetch the latest script
  const { data, error } = await supabase
    .from('daily_scripts')
    .select('*')
    .order('script_date', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return (
      <div className="w-full max-w-4xl flex flex-col items-center justify-center p-8 mt-10 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">No Daily Script Found</h1>
        <p className="text-gray-500">
          Please check back later or ensure the daily cron job has run successfully.
        </p>
        <div className="mt-6 text-sm">
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full border">
            Admin: Run local /api/cron/process-daily-script
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 animate-in mb-8">
      <header className="flex flex-col gap-2 border-b border-gray-200 pb-5 pt-4 px-2 md:px-0">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 flex flex-wrap items-center gap-3">
          Today's English
          <span className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium text-gray-600 bg-gray-50/80 px-3 py-1.5 rounded-full border border-gray-200 shadow-sm w-fit mt-1 sm:mt-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            매일 오전 6시 자동 갱신
          </span>
        </h1>
        <p className="text-base md:text-lg font-medium text-blue-600 mt-1">
          {new Date(data.script_date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
          })} 주요 뉴스
        </p>
      </header>

      <div className="w-full">
        <ScriptTabs 
          rawText={data.raw_text}
          translation={data.translated_content?.fullTranslation}
          grammarAnalysis={data.translated_content?.grammarAnalysis}
          savedWords={savedWordsList}
        />
      </div>
    </div>
  );
}
