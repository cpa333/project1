const key = 'bb8f21c12038643887e7a12f282a32e6bf374a7506ee5815d5289b8641b32032';

const urlsToTest = [
  `https://apis.data.go.kr/B551024/openArirangNewsApi/news?serviceKey=${key}&pageNo=1&numOfRows=1`,
  `https://apis.data.go.kr/B551024/openArirangNewsApi/NewsList?serviceKey=${key}&pageNo=1&numOfRows=1`,
  `https://apis.data.go.kr/B551024/openArirangNewsApi?serviceKey=${key}&pageNo=1&numOfRows=1`,
  `https://apis.data.go.kr/B551024/openArirangNewsApi/getNewsList?serviceKey=${key}&pageNo=1&numOfRows=1`
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
