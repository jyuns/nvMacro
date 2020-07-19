const puppeteer = require('puppeteer')

const express = require('express')
const nodeApp = express()

const cors = require('cors')
const bodyParser = require('body-parser')

nodeApp.use(cors())
nodeApp.use(bodyParser.json({limit:'100mb'}))
nodeApp.use(bodyParser.urlencoded({limit:'100mb', extended:true}))

const homedir = require('os').homedir();
const axios = require('axios')

console.log(homedir)

nodeApp.post('/login', async (req, res) => {

    let id = req.body.id
    let pw = req.body.pw

    const browser = await puppeteer.launch({
        executablePath:'/Users/jyuns/Desktop/Chromium.app/Contents/MacOS/Chromium',
    });

    const page = await browser.newPage();
    await page.goto('https://sell.smartstore.naver.com/#/login');

    await page.waitForSelector('#loginId')

    await page.focus('#loginId')
    await page.keyboard.type(id)
    
    await page.focus('#loginPassword')
    await page.keyboard.type(pw)

    await page.click('#loginButton')

    try {
        await page.waitForSelector('.store', {timeout:3000})
        browser.close()
        res.status(200).send()
    } catch {
        browser.close()
        res.status(401).send()
    }
})

nodeApp.post('/updateInvoice', async (req, res) => {

    let id = req.body.id
    let pw = req.body.pw
    let store = req.body.store

    const browser = await puppeteer.launch({
        headless:false,
        executablePath:'/Users/jyuns/Desktop/Chromium.app/Contents/MacOS/Chromium',
    });

    const page = await browser.newPage();
    await page.goto('https://sell.smartstore.naver.com/#/login');

    // login
    await page.waitForSelector('#loginId')

    await page.focus('#loginId')
    await page.keyboard.type(id)
    
    await page.focus('#loginPassword')
    await page.keyboard.type(pw)

    await page.click('#loginButton')

    await page.waitForSelector('.store', {timeout:3000})

    // change store if diff



    // get store id
/**
    let cookies =  await page.cookies()    
    let tempStoreId = await axios.get('https://sell.smartstore.naver.com/api/login/validate/address-book', 
    
    {
        headers : {
            'User-Agent' : 'Mozila/5.0',
            Cookie : cookies[0].name + '=' + cookies[0].value + ';' + cookies[1].name + '=' + cookies[1].value + ';'
        }
    })

    let storeId = tempStoreId.headers.user.split(':').pop()

    let operationName = 'SmartStoreFindDeliveryStatusesBySummaryInfoType_ForSaleDeliveryStatus'
    let query = "query SmartStoreFindDeliveryStatusesBySummaryInfoType_ForSaleDeliveryStatus($merchantNo: String!, $paging_page: Int, $paging_size: Int, $serviceType: String!, $sort_direction: SortDirectionType, $sort_type: SortType, $summaryInfoType: SummaryInfoType) {  deliveryStatusListMp: SmartStoreFindDeliveryStatusesBySummaryInfoType_ForSaleDeliveryStatus(merchantNo: $merchantNo, paging_page: $paging_page, paging_size: $paging_size, serviceType: $serviceType, sort_direction: $sort_direction, sort_type: $sort_type, summaryInfoType: $summaryInfoType) {    elements {      ...deliveryStatusElementFieldMp      __typename    }    pagination {      ...paginationField      __typename    }    __typename  }}fragment deliveryStatusElementFieldMp on SaleDeliveryStatusMp {  deliveryInvoiceNo  productOrderNo  __typename}fragment paginationField on Pagination {  size  totalElements  page  totalPages  __typename}"
    let variables = {
        'merchantNo' : storeId,
        'paging_page' : 1,
        'paging_size' : 500,
        'serviceType' : 'MP',
        'sort_direction' : 'DESC',
        'summaryInfoType' : 'DELIVERING'
    }


    let tempInvoiceList = await axios.post('https://sell.smartstore.naver.com/o/v3/graphql', {
        'operationName' : operationName,
        'query' : query,
        'variables' : variables,
    }, {

        headers : {
            'User-Agent' : 'Mozila/5.0',
            Cookie : cookies[0].name + '=' + cookies[0].value + ';' + cookies[1].name + '=' + cookies[1].value + ';'
        },
    })

    let invoiceList = tempInvoiceList.data.data.deliveryStatusListMp.elements

    console.log(invoiceList) */
    
/**

    const { GoogleSpreadsheet } = require('google-spreadsheet');

    // spreadsheet key is the long id in the sheets URL
    const doc = new GoogleSpreadsheet('1BPE-mtjv7VoNmi_4aevyPLdq0xZC6Y8lyNUa_bQBwzk');
    
    //doc.useApiKey('AIzaSyBl7mAaokdmAq8R2MkiK9YGLWMBBv99D-U');
    await doc.useServiceAccountAuth(require('./crew30-a4b6e6cdd464.json'));
    await doc.loadInfo(); // loads document properties and worksheets
    
    const sheet = await doc.sheetsByIndex[4] ; // or use doc.sheetsById[id]
    const rows = await sheet.getRows()
    let test = 0 

    const result = await rows.find(r => r._rawData[5] === '28000059576470')
    console.log(result._rawData[18])
    test ++
    console.log(test) */
    
    //const rows = await sheet.getRows()
    //const resultRow = rows.find(r => r.name === "결제일")

    

/**
 *     page.goto('https://sell.smartstore.naver.com/#/naverpay/sale/delivery/situation?summaryInfoType=DELIVERING')
    let cookies =  await page.cookies()

    let param = new URLSearchParams()

    param.append('dispatchForms[0].productOrderId', '2020060851382681')
    param.append('dispatchForms[0].deliveryMethodType', 'DELIVERY')
    param.append('dispatchForms[0].deliveryCompanyCode', 'CJGLS')
    param.append('dispatchForms[0].invoicingNo', '631981763431')
    param.append('dispatchForms[0].searchOrderStatusType', 'DELIVERING')
    param.append('onlyValidation', 'true')
    param.append('validationSuccess', 'true')

    
    axios.defaults.headers.common["User-Agent"] = "Mozila/5.0"
    let result = await axios.post('https://sell.smartstore.naver.com/o/sale/delivery/update2', param, {
        headers : {
            Cookie : cookies[0].name + '=' + cookies[0].value + ';' + cookies[1].name + '=' + cookies[1].value + ';'
        }
    })
    
    console.log(result)
 */    


//  
//    let bodyHTML = await page.evaluate( async () => await document.body.innerHTML);
//    return res.send(bodyHTML)
    


/**
 * 
 * 
 * 
 *     await page.waitForSelector('.npay_board_area ')
    await page.evaluate( async () => {
        console.log(await document.querySelectorAll('_4LshyCrDpi'))
    })

    let cookies =  await page.cookies()
    
    let tempResponse = await axios.get('https://sell.smartstore.naver.com/api/login/validate/address-book', 
    {

        headers : {
            'User-Agent' : 'Mozila/5.0',
            Cookie : cookies[0].name + '=' + cookies[0].value + ';' + cookies[1].name + '=' + cookies[1].value + ';'
        }
    })

    console.log(tempResponse)


 */

/**
 *     
 */

})


nodeApp.listen(8085, () => {
    console.log('node listen 8085 port')
})

//server.timeout = 10000;