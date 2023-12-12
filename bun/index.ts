import puppeteer from "puppeteer";
import fs from 'fs';

const scrapeInfiniteScroll = async (url:string, numScrolls:number):Promise<object[]> => {
	const browser = await puppeteer.launch({
		headless:"new",
		// executablePath:'/Applications/Google Chrome.app'
	});
	const page = await browser.newPage()

	await page.goto(`https://www.reddit.com/r/${url}/top/?t=year`);

	async function scrollDown(){
		await page.evaluate(() => {
			window.scrollTo(0,document.body.scrollHeight);
		});
		await page.waitForTimeout(1000);
	}

	for (let i:number = 0; i<numScrolls; i++){
		await scrollDown();
	};
	
	const scrapedData:object[] = await page.evaluate(()=> {
		const items = document.querySelectorAll('div[id^="t3_"]:not([id$="share-menu"]):not([id*="="])');

		const data:object[] = [];
		items.forEach(item => {
			data.push(
				{
					'subreddit':url,
					'postTitle':item.innerText
				}
			);
		});
		return data;
	})

	await browser.close();
	return scrapedData;
};

const writeDataToFile = async (data:object[]) => {
	 fs.appendFile('./output.txt', data.join('\n'),"utf-8",(err)=>{
										 if(err){
												console.error(err);
										 } else {
												console.log('Data has been successfully appended');
										 }});
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

const subreddits:string[] = ['WorkReform','jobs','antiwork','wfh','managers'];

for(let subR of subreddits){
	try {
		await scrapeInfiniteScroll(subR,5).then((data)=>{
			writeDataToFile(data);
		})
	} catch (err) {
		console.error(err);
	}
};
