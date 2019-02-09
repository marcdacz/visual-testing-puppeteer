for (let device of devices) {
	describe(`visual tests for ${device.name}`, () => {

		before(async () => {
			browser = await puppeteer.launch({
				headless: false
			});
			page = await browser.newPage();
			await page.emulate(device);
		});

		after(async () => {
			await browser.close();
		});

		for (let testItem of testData) {
			it(`should display correctly for url: ${testItem.description}`, async () => {
				await page.goto(baseUrl + testItem.path);
				
				let screenshotCounter = 1;
				for (let selector of testItem.selectors) {
					let pageElement = await page.$(selector);
					expect(pageElement, `verifying element selector '${selector}'`).to.not.be.null;
					let pageElementFileName = `${device.name} - ${testItem.description}_${screenshotCounter}`;
					await pageElement.screenshot({ path: `${actualDir}/${pageElementFileName}.png` });
					await visualTestHelpers.compareScreenshotsLS(pageElementFileName);
					screenshotCounter++;
				}

				let fullPageFileName = `${device.name} - ${testItem.description}_page`
				await page.screenshot({ path: `${actualDir}/${fullPageFileName}.png` });				
			});
		}
	});
}
