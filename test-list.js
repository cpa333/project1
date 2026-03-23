async function checkModels() {
  try {
    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyAQUfpMiSoFsxkxyhT85IZCPGfCnLe6ZCo");
    const data = await res.json();
    
    if (data.error) {
      console.log("Google API returned an error:", data.error);
      return;
    }
    
    const validModels = data.models
      .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
      .map(m => m.name);
      
    console.log("Your API Key is authorized for the following generateContent models:");
    console.log(validModels.join("\n"));
  } catch (e) {
    console.error("Fetch failed:", e);
  }
}
checkModels();
