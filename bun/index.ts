import puppeteer from "puppeteer";

const scrapeInfiniteScroll = async (url:string, numScrolls:number):Promise<string[]> => {
	const browser = await puppeteer.launch({
		headless:"new",
		// executablePath:'/Applications/Google Chrome.app'
	});
	const page = await browser.newPage()

	await page.goto(url);
	
	async function scrollDown(){
		await page.evaluate(() => {
			window.scrollTo(0,document.body.scrollHeight);
		});
		await page.waitForTimeout(1000);
	}

	for (let i:number = 0; i<numScrolls; i++){
		await scrollDown();
	};
	
	const scrapedData:string[] = await page.evaluate(()=> {
		const items = document.querySelectorAll('div[id^="t3_"]:not([id$="share-menu"]):not([id*="="])');

		const data:string[] = [];
		items.forEach(item => {
			data.push(item.innerText);
		});
		return data;
	})

	await browser.close();
	return scrapedData;
};

try {
	await scrapeInfiniteScroll('https://reddit.com/WorkReform',5).then((data)=>{
		console.log(data);
	})
} catch (err) {
	console.error(err);
}
