import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get('word')?.toLowerCase().trim();

  if (!word) {
    return NextResponse.json({ error: 'Word parameter is required' }, { status: 400 });
  }

  try {
    // 1. 발음기호 추출용 무료 영어 사전 API (api.dictionaryapi.dev)
    let phonetic = `/${word}/`;
    try {
      const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, { cache: 'force-cache' });
      if (dictRes.ok) {
        const dictData = await dictRes.json();
        if (dictData[0]?.phonetics) {
          const p = dictData[0].phonetics.find((p: any) => p.text);
          if (p) phonetic = p.text;
        }
      }
    } catch (e) {
      console.warn("Phonetic API error:", e);
    }

    // 2. 다중 뜻풀이 제공용 Google Translate 범용 API (비공식 엔드포인트 - 과금 $0)
    // dt=t (번역), dt=bd (사전 뜻 여러개)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ko&dt=t&dt=bd&q=${encodeURIComponent(word)}`;
    const transRes = await fetch(url, { cache: 'force-cache' });
    const transData = await transRes.json();

    let meanings: string[] = [];

    // transData[1] 에는 사전 형태의 품사별 배열이 들어있습니다.
    if (transData[1] && transData[1].length > 0) {
      transData[1].forEach((posGroup: any) => {
        const pos = posGroup[0]; // e.g., "noun", "verb"
        const translations = posGroup[1] as string[]; // e.g., ["은행", "둑"]

        let posKr = pos;
        if (pos === "noun") posKr = "명사";
        else if (pos === "verb") posKr = "동사";
        else if (pos === "adjective") posKr = "형용사";
        else if (pos === "adverb") posKr = "부사";
        else if (pos === "pronoun") posKr = "대명사";
        else if (pos === "preposition") posKr = "전치사";
        else if (pos === "conjunction") posKr = "접속사";

        // 품사별로 최대 5개의 뜻을 쉼표로 연결
        meanings.push(`[${posKr}] ${translations.slice(0, 5).join(', ')}`);
      });
    } else if (transData[0] && transData[0][0] && transData[0][0][0]) {
      // 사전 데이터가 없고 일대일 번역만 있을 경우
      meanings.push(transData[0][0][0]);
    }

    if (meanings.length === 0) {
      meanings.push("검색 결과 없음");
    }

    return NextResponse.json({
      phonetic: phonetic,
      meaning: meanings.join('\n') // "\n" 텍스트 형태로 프론트엔드에 전달
    });

  } catch (error: any) {
    console.error("Dictionary Lookup Error:", error);
    return NextResponse.json({ phonetic: `/${word}/`, meaning: "단어 뜻을 불러올 수 없습니다." }, { status: 500 });
  }
}
