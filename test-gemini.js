const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  
  const modelsToTest = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro", "gemini-1.0-pro"];
  
  for (const modelName of modelsToTest) {
    console.log(`\nTesting model: ${modelName}...`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("say hello");
      console.log(`✅ Success for ${modelName}:`, result.response.text().trim());
    } catch (e) {
      console.log(`❌ Failed for ${modelName}:`, e.message);
    }
  }
}

testModels();
