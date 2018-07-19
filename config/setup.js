global.env = process.env.NODE_ENV;
global.tenant = 'AU';
global.baseUrl = 'https://www.ratemyagent.com.au';

global.chai = require('chai');
global.expect = chai.expect;
global.puppeteer = require('puppeteer')

global.devices = require(`../data/devices.json`);
global.testData = require(`../data/testData${tenant}.json`);
global.visualTestHelpers = require('../utils/visualTestHelpers');

const path = require('path');
const rootDir = path.resolve(__dirname, '..');
global.imageDir = `${rootDir}/images`;
global.actualDir = `${imageDir}/actual`;
global.baselineDir = `${imageDir}/baseline`;
global.diffDir = `${imageDir}/diff`;

const fs = require('fs');
if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir);
if (!fs.existsSync(actualDir)) fs.mkdirSync(actualDir);
if (!fs.existsSync(baselineDir)) fs.mkdirSync(baselineDir);
if (!fs.existsSync(diffDir)) fs.mkdirSync(diffDir);
