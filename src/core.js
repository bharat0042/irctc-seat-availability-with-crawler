import { datesList } from "./dateUtil.js";
import puppeteer from 'puppeteer';
import { cwd } from 'node:process';

export const handleSeatAvailability = async toFromList => {
    const browser = await puppeteer.launch({
        headless: true, executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox', '--unlimited-storage', '--disable-gpu', '--disable-dev-shm-usage', '--full-memory-crash-report', '--disable-setuid-sandbox']
    });

    let data = {};
    for (let key in datesList) {
        let dateSat = getDateString(datesList[key].sat, true);
        data[dateSat] = {};
        for (let stnCode of toFromList) {
            data[dateSat][`${stnCode.from} - ${stnCode.to}`] = await getTrainDataJSONArr(browser, stnCode, datesList[key].sat);
        }

        let dateSun = getDateString(datesList[key].sun, true);
        data[dateSun] = {};
        for (let stnCode of toFromList) {
            data[dateSun][`${stnCode.from} - ${stnCode.to}`] = await getTrainDataJSONArr(browser, stnCode, datesList[key].sun);
        }
    }

    await browser.close();

    return data;
};

const getTrainDataJSONArr = async (browser, stnCode, dateToCheck) => {
    try {
        let trainDataJSONArray = [];
        const url = await getUrl(stnCode, dateToCheck);

        let page = await browser.newPage();

        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36");

        await page.goto(url, { waitUntil: 'networkidle0', timeout: 600000 });

        let trainList = await page.$('#root > div > div:nth-child(2) > div:nth-child(3) > div > div.right-side-container > div.train-list');

        let singleTrainList = await trainList.$$(".single-train-detail");
        for (let train of singleTrainList) {
            trainDataJSONArray.push(await getSingleTrainDataJSON(train));
        }
        await sleep(10000);
        await page.close();
        return trainDataJSONArray;
    } catch (error) {
        console.log(`Failure for ${JSON.stringify(stnCode)}-${dateToCheck}`, error);
    }
};

const getSingleTrainDataJSON = async train => {
    let trainData = {};

    let trainNameJSHandle = await train.$(".train-name");
    trainData.trainName = await (await trainNameJSHandle.getProperty('textContent')).jsonValue();

    let trainNumJSHandle = await train.$(".flex .train-depart-number");
    trainData.trainNumber = (await (await trainNumJSHandle.getProperty('textContent')).jsonValue()).split("|")[0];

    let classAndFairInfo = await train.$$(".card ");
    trainData.classAndFairInfoCard = [];
    for (let item of classAndFairInfo) {
        let classAndFairInfoCard = {};

        try {
            classAndFairInfoCard.berthClass = await (await ((await item.$(".rail-class")).getProperty('textContent'))).jsonValue();
        } catch (error) {
            classAndFairInfoCard.berthClass = "NA";
            console.log("berth class not found!!")
        }

        try {
            classAndFairInfoCard.cost = await (await ((await item.$(".ticket-price")).getProperty('textContent'))).jsonValue();
        } catch (error) {
            classAndFairInfoCard.cost = "NA";
            console.log("cost info not found")
        }

        try {
            classAndFairInfoCard.availibilty = await (await ((await item.$(".availibilty-info")).getProperty('textContent'))).jsonValue();
        } catch (error) {
            classAndFairInfoCard.availibilty = "NA";
            console.log("availibilty info not found")
        }
        trainData.classAndFairInfoCard.push(classAndFairInfoCard);
    }
    return trainData;
};

const getUrl = async (stnCode, dateToCheck) => {
    let date = getDateString(dateToCheck);

    console.log(`https://www.makemytrip.com/railways/listing?classCode=&className=All%20Classes&date=${date}&destStn=${stnCode.to}&srcStn=${stnCode.from}`);

    return `https://www.makemytrip.com/railways/listing?classCode=&className=All%20Classes&date=${date}&destStn=${stnCode.to}&srcStn=${stnCode.from}`;
};

const getDateString = (date, withDash) => {
    let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
    let month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
    let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
    let dateStr = `${year}${month}${day}`;
    if (withDash) {
        dateStr = `${year}-${month}-${day}`;
    }
    return dateStr;
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

//  below functions no longer in use

const saveTrainDataAsImages = async (stnCode, dateToCheck) => {
    const url = await getUrl(stnCode, dateToCheck);

    const browser = await puppeteer.launch({
        headless: true, args: ['--no-sandbox', '--unlimited-storage', '--disable-gpu', '--disable-dev-shm-usage', '--full-memory-crash-report', '--disable-setuid-sandbox']
    });

    let page = await browser.newPage();

    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36");

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 600000 });

    //await page.waitForXPath('//*[@id="root"]/div/div[2]/div[3]/div/div[2]/div[3]');

    const trainList = await page.$('#root > div > div:nth-child(2) > div:nth-child(3) > div > div.right-side-container > div.train-list');

    await page.$eval("#railModifySearch", el => el.remove());

    let path = `${cwd()}` + "/target/" + getImageName(stnCode, dateToCheck) + ".png";
    await trainList.screenshot({
        path: path
    });

    let imageName = getImageName(stnCode, dateToCheck) + ".png";
    sendToMail("Train Ticket", "xxxxxxx", path, imageName)

    await page.close();
    await browser.close();
    await sleep(10000);
};

const getImageName = (stnCode, dateToCheck) => {
    let date = getDateString(dateToCheck);
    return `Date:${date}_From:${stnCode.from}_To:${stnCode.to}`;
};