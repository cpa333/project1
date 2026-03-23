const key = process.env.PUBLIC_DATA_API_KEY;
const baseUrl = process.env.PUBLIC_DATA_API_ENDPOINT;

const urlsToTest = [
  `${baseUrl}/news?serviceKey=${key}&pageNo=1&numOfRows=1`,
  `${baseUrl}/NewsList?serviceKey=${key}&pageNo=1&numOfRows=1`,
  `${baseUrl}?serviceKey=${key}&pageNo=1&numOfRows=1`,
  `${baseUrl}/getNewsList?serviceKey=${key}&pageNo=1&numOfRows=1`
];

async function run() {
  for (const url of urlsToTest) {
    console.log("Testing:", url.split('?')[0]);
    try {
      const res = await fetch(url);
      const text = await res.text();
      console.log("Status:", res.status);
      console.log("Response snippet:", text.substring(0, 250).replace(/\n/g, ' '));
    } catch (e) {
      console.log("Error:", e.message);
    }
    console.log("---");
  }
}
run();
