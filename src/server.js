const puppeteer = require('puppeteer')

const express = require('express')
const nodeApp = express()

const cors = require('cors')
const bodyParser = require('body-parser')

nodeApp.use(cors())
nodeApp.use(bodyParser.json({limit:'100mb'}))
nodeApp.use(bodyParser.urlencoded({limit:'100mb', extended:true}))


 // nodeApp.use( async(req, res, next) => {})
 

nodeApp.get('/', async (req, res) => {
    const browser = await puppeteer.launch({
        headless : false,
        ignoreDefaultArgs: ['--disable-extensions'],
        executablePath : '/Users/jyuns/Desktop/shipmacro/src/Chromium.app/Contents/MacOS/chromium'
    });

    const page = await browser.newPage()

    await page.goto('https://sell.smartstore.naver.com/#/login');

    // login

    while(1) {
        try {
            await page.focus('#loginId')
            await page.keyboard.type('mamels2')
        
            await page.focus('#loginPassword')
            await page.keyboard.type('duddn8978!')
        
            await page.click('#loginButton')
            break
        } catch {
            continue
        }
    }

    await page.waitForSelector('.result-info')
    
    await page.goto('https://sell.smartstore.naver.com/#/naverpay/sale/delivery/situation?summaryInfoType=DELIVERING')

    await page.waitForSelector('#__naverpay')

    const element = await page.evaluate(async () => {
        let test = await document.querySelector('span.shop').innerHTML
        return test
    })
    
    console.log(element)
})


nodeApp.listen(8085, () => {
    console.log('node listen 8083 port')
})

//server.timeout = 10000;
