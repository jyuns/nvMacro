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

axios.defaults.headers.common["User-Agent"] = "Mozila/5.0"

nodeApp.post('/login', async (req, res) => {

    let id = req.body.id
    let pw = req.body.pw

    const browser = await puppeteer.launch({
        executablePath: homedir + '\\Desktop\\chrome-win\\chrome.exe'
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


nodeApp.post('/getInvoice', async (req, res) => {

    let id = req.body.id
    let pw = req.body.pw
    let store = req.body.store

    const browser = await puppeteer.launch({
        executablePath: homedir + '\\Desktop\\chrome-win\\chrome.exe'
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

    await page.waitForSelector('.store', {timeout:5000})

    // change store if diff
    let currentStore = await page.evaluate( async () => {
        let el = await document.querySelector('.store').innerText
        return el
    })

    currentStore = currentStore.split(' ').join('')

    if(currentStore != store) {
        await page.click('.fn-down2')
        
        await page.waitForSelector('.select-area', {timeout:5000})

        let storeIndex = await page.evaluate( async ({store}) => {
            let el = await document.querySelectorAll('.text-title')
            
            let tempStoreIndex = Number()
            
            for(let i = 0; i < el.length; i++ ) {
                let elRegex = el[i].innerText.replace('스마트스토어', '')
                elRegex = elRegex.split(' ').join('')
                if(elRegex == store) {
                    tempStoreIndex = i;
                    break;
                }
            }

            return tempStoreIndex

        }, {store})

        await page.evaluate( async ({storeIndex}) => {
            let selectStore = await document.querySelectorAll('input[name=store-login]')[storeIndex]
            selectStore.click()
        }, {storeIndex})

        await page.waitForSelector('.store', {timeout:5000})
    }

    // get store id
    await page.waitFor(5000)
    let cookies = await page.cookies()
    
    let tempStoreId = await axios.get('https://sell.smartstore.naver.com/api/login/validate/address-book', 
                                        {
                                            headers : {
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
            Cookie : cookies[0].name + '=' + cookies[0].value + ';' + cookies[1].name + '=' + cookies[1].value + ';'
        },
    })

    let invoiceList = tempInvoiceList.data.data.deliveryStatusListMp.elements


    res.json({
        invoiceList : invoiceList,
        cookies : cookies,
    })
})

nodeApp.post('/updateInvoice', async (req, res) => {

    let pdNum = req.body.productNum
    let inNum = req.body.invoiceNum
    let cookies = req.body.cookies
    
    let shipType = ''

    let cj1 = new RegExp('^6')
    let cj2 = new RegExp('^3')
    let ky = new RegExp('^2')
    let ci1 = new RegExp('^5')
    let ci2 = new RegExp('^1')

    if(cj1.exec(inNum) != null) shipType = 'CJGLS'
    if(cj2.exec(inNum) != null) shipType = 'CJGLS'
    if(ky.exec(inNum) != null) shipType = 'KUNYOUNG'
    if(ci1.exec(inNum) != null) shipType = 'CHUNIL'
    if(ci2.exec(inNum) != null) shipType = 'CHUNIL'

    if(shipType == '') res.send('실패')

    let param = new URLSearchParams()

    param.append('dispatchForms[0].productOrderId', pdNum)
    param.append('dispatchForms[0].deliveryMethodType', 'DELIVERY')
    param.append('dispatchForms[0].deliveryCompanyCode', shipType)
    param.append('dispatchForms[0].invoicingNo', inNum)
    param.append('dispatchForms[0].searchOrderStatusType', 'DELIVERING')
    param.append('onlyValidation', 'true')
    param.append('validationSuccess', 'true')

    try {
        let result = await axios.post('https://sell.smartstore.naver.com/o/sale/delivery/update2', param, {
            headers : {
                Cookie : cookies[0].name + '=' + cookies[0].value + ';' + cookies[1].name + '=' + cookies[1].value + ';'
            }
        })
        console.log(result)
        res.send('성공')
    } catch {
        res.send('실패')
    }
})


nodeApp.listen(8085, () => {
    console.log('node listen 8085 port')
})

//server.timeout = 10000;