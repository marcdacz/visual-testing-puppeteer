const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
const compareScreenshotsPM = (fileName, tolerance = 0) => {
	return new Promise((resolve, reject) => {
		const img1 = fs.createReadStream(`${actualDir}/${fileName}.png`).pipe(new PNG()).on('parsed', doneReading);
		const img2 = fs.createReadStream(`${baselineDir}/${fileName}.png`).pipe(new PNG()).on('parsed', doneReading);

		let filesRead = 0;
		function doneReading() {
			if (++filesRead < 2) return;

			expect(img1.width, 'image widths are the same').equal(img2.width);
			expect(img1.height, 'image heights are the same').equal(img2.height);

			const diff = new PNG({ width: img1.width, height: img2.height });
			const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, img1.width, img1.height, { threshold: 0.55 });

			if (numDiffPixels > tolerance)
				diff.pack().pipe(fs.createWriteStream(`${diffDir}/${fileName}.png`));

			expect(numDiffPixels, `number of different pixels within tolerance of ${tolerance}`).equal(tolerance);
			resolve();
		}
	});
};

const looksSame = require('looks-same');
const compareScreenshotsLS = (fileName) => {
	return new Promise(async (resolve, reject) => {
		let actualImage = `${actualDir}/${fileName}.png`;
		let baselineImage = `${baselineDir}/${fileName}.png`;
		let diffImage = `${diffDir}/${fileName}.png`;

		await looksSame(actualImage, baselineImage, { strict: false, ignoreAntialiasing: true, pixelRatio: 1, tolerance: 5 }, (error, equal) => {
			if (equal === false) {
				looksSame.createDiff({
					reference: baselineImage,
					current: actualImage,
					diff: diffImage,
					highlightColor: '#FFFF00',
					strict: false,
					ignoreAntialiasing: true,
					pixelRatio: 1,
					tolerance: 5
				}, (error) => { });
			}
			expect(equal, `validating image ${fileName}`).to.be.true;
			resolve();
		});
	});
};

module.exports = {
	compareScreenshotsPM,
	compareScreenshotsLS
};
