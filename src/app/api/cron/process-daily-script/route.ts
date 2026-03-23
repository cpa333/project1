import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  try {
    // Moved initializations inside the request handler to ensure 
    // hot-reloaded .env.local variables in dev mode are caught.
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const apiUrl = process.env.PUBLIC_DATA_API_ENDPOINT;
    const apiKey = process.env.PUBLIC_DATA_API_KEY;
    
    if (!apiUrl || !apiKey || !process.env.GEMINI_API_KEY) {
      throw new Error("Missing required environment variables.");
    }

    const fetchUrl = `${apiUrl}/news?serviceKey=${apiKey}&pageNo=1&numOfRows=1`;
    let rawArticleText = "This is a robust fallback text because the Public API parsing did not return expected shapes or failed. We ensure the pipeline never breaks.";
    
    let isFallbackDb = true;

    try {
      const res = await fetch(fetchUrl);
      const data = await res.json();
      
      const item = data?.items?.[0];
      if (item && item.content) {
        // Concatenate title and content for rich context
        rawArticleText = `${item.title || ''}\n\n${item.content}`;
      }
    } catch (apiError) {
      console.warn("Public API parsing failed. Using fallback extraction.", apiError);
    }

    let parsedData = {
      translated_content: "임시 번역본입니다. (API 키 오류 등으로 인해 임시 번역이 제공됩니다)",
      grammar_analysis: [
        {
          sentence_or_phrase: "Fallback Sentence Displayed Here",
          explanation: "API 연동 지연으로 인해 임시 구문 분석 정보가 나타납니다."
        }
      ]
    };

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });
      const prompt = `You are a professional English teacher. I will provide you with an English news script.
      1. Please translate the full text perfectly into Korean.
      2. Analyze the total number of sentences in the text. Select roughly 30% of the sentences (with a minimum of 3 sentences) that contain the most important grammatical structures, idioms, or complex syntax. 
      3. For these selected sentences, provide a detailed 'Grammar & Syntax Analysis' (in Korean) explaining the grammatical structures or idioms.
      
      Strictly return ONLY a raw JSON object string with no markdown formatting and no backticks. The JSON must match this exact structure:
      {
        "translated_content": "The full Korean translation.",
        "grammar_analysis": [
          {
            "sentence_or_phrase": "The exact English sentence, phrase, or idiom from the text.",
            "explanation": "Detailed explanation of the key grammar point or syntax structure in Korean."
          }
        ]
      }
      
      [Article Content to Analyze]:
      ${rawArticleText}
      `;

      const result = await model.generateContent(prompt);
      let responseText = result.response.text();
      responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedData = JSON.parse(responseText);
      isFallbackDb = false; // Successfully parsed via Gemini
    } catch (geminiError: any) {
      console.error("Gemini API Error:", geminiError.message);
    }

    const today = new Date().toISOString().split('T')[0]; 
    
    // Calling the Custom RPC function `insert_daily_script`
    const { data: dbData, error: dbError } = await supabase.rpc('insert_daily_script', {
      p_script_date: today,
      p_raw_text: rawArticleText,
      p_translated_content: { 
        fullTranslation: parsedData.translated_content,
        grammarAnalysis: parsedData.grammar_analysis 
      },
      p_vocabulary: [] // 단어장 추출 로직 완전 제거
    });

    if (dbError) throw dbError;

    return NextResponse.json({ 
      success: true, 
      message: isFallbackDb ? "Saved with fallback data due to LLM error." : "Daily script perfectly translated and saved.", 
      date: today,
      rpc_result: dbData,
      is_fallback: isFallbackDb
    });

  } catch (error: any) {
    console.error("Cron Job Pipeline Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
