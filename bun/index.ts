import puppeteer from "puppeteer";
import fs from 'fs';
// import { RedditObject } from './classes';

class RedditObject {
	url:string;
	innerText:string;
	constructor(url:string, innerText:string){
		this.url = url;
		this.innerText = innerText;
	}
}

const scrapeInfiniteScroll = async (url:string, numScrolls:number):Promise<RedditObject[]> => {
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
	try {
		const scrapedData:RedditObject[] = await page.evaluate(()=> {
			const items = document.querySelectorAll('div[id^="t3_"]:not([id$="share-menu"]):not([id*="="])');

			const data:RedditObject[] = [];
			items.forEach((item) => {
				const itemObj = new RedditObject("","");
				itemObj.url = url;
				itemObj.innerText = item.innerText
				data.push(itemObj);
			});
			return data;
		})}
	catch (err){
		await browser.close();
		console.error(err);
	}

	await browser.close();
	return scrapedData;
};

const writeDataToFile = async (data:RedditObject[]) => {
	 fs.appendFile('./output.txt', data.join('\n'),"utf-8",(err)=>{
										 if(err){
												console.error(err);
										 } else {
												console.log('Data has been successfully appended');
										 }});
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//invoking the scrape
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//


const subreddits:string[] = ['WorkReform'];/* ,'jobs','antiwork','wfh','managers']; */

for(let subR of subreddits){
	try {
		await scrapeInfiniteScroll(subR,10).then((data)=>{
			writeDataToFile(data);
		})
	} catch (err) {
		console.error(err);
	};
};
