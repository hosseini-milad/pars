const express = require('express');
const router = express.Router()
const { default: fetch } = require("node-fetch");
const slider = require('../models/main/slider');
const authApi = require('./authApi');
const taskApi = require('./taskApi');
const yasApi = require('./yasApi');
const appApi = require('./appApi');
const cartApi= require('./cartApi');
const settingApi = require('./settingApi');
const productApi = require('./productApi');
const formApi = require('./formApi');
const paymentApi = require('./paymentApi');
const userApi = require('./userApi');
const panelUserApi = require('./panelUserApi')
const CRMPanelApi = require('./panelCrmApi')
const panelOrderApi = require('./panelOrderApi')
const panelProductApi = require('./panelProductApi')
const panelFaktorApi = require('./faktorApi')
const sepidarFetch = require('../middleware/Sepidar');
const products = require('../models/product/products');
const productPrice = require('../models/product/productPrice');
const productCount = require('../models/product/productCount');
const customers = require('../models/auth/customers');
const schedule = require('node-schedule');
const bankAccounts = require('../models/product/bankAccounts');
const updateLog = require('../models/product/updateLog');
const state = require('../models/main/state');
const city = require('../models/main/city');
const quickCart = require('../models/product/quickCart');
const Invoice = require('../models/sepidar/invoices');
const InvoiceItem = require('../models/sepidar/invoiceItems');
const dashboard = require ('./dashboard');
const { ONLINE_URL} = process.env;
 
router.get('/main', async (req,res)=>{
    try{
        const sliders = await slider.find()

        //logger.warn("main done")
        res.json({sliders:sliders})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.use('/auth', authApi)
router.use('/task', taskApi)
router.use('/setting', settingApi)
router.use('/app', appApi)
router.use('/cart', cartApi)
router.use('/product', productApi)
router.use('/form', formApi)
router.use('/user', userApi)
router.use('/payment',paymentApi)

router.use('/yas', yasApi)
router.use('/panel/user', panelUserApi)
router.use('/panel/order', panelOrderApi)
router.use('/panel/product', panelProductApi)
router.use('/panel/faktor', panelFaktorApi)
router.use('/dashboard', dashboard)

router.use('/panel/crm',CRMPanelApi)
schedule.scheduleJob('5 */2 * * *', async() => { 
    response = await fetch(ONLINE_URL+"/sepidar-product",
        {method: 'GET'});
    response = await fetch(ONLINE_URL+"/sepidar-price",
        {method: 'GET'});
    response = await fetch(ONLINE_URL+"/sepidar-quantity",
        {method: 'GET'});
    response = await fetch(ONLINE_URL+"/sepidar-customer",
        {method: 'GET'});
    response = await fetch(ONLINE_URL+"/sepidar-invoices",
        {method: 'GET'});
 })
 schedule.scheduleJob('00 00 12 * * 0-6', async() => { 
    response = await fetch(ONLINE_URL+"/delete-quick",
    {method: 'GET'});
 })
 router.get('/delete-quick', async (req,res)=>{
    try{
        const deleteResult = await quickCart.deleteMany({})
        res.json({message: deleteResult})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/sepidar-product', async (req,res)=>{
    const url=req.body.url
    try{
        const sepidarResult = await sepidarFetch("data","/api/Items")
        
        if(sepidarResult.error||!sepidarResult.length){
            res.json({error:"error occure",
                data:sepidarResult,message:"خطا در بروزرسانی"})
            return
        }
        //await products.deleteMany({})
        
        var newProduct = [];
        var updateProduct = 0
        var notUpdateProduct = 0
        
        for(var i = 0;i<sepidarResult.length;i++){
            const productResult = await products.updateOne({
                ItemID:sepidarResult[i].ItemID
            },{$set:{
                sku:sepidarResult[i].Code,
                title:sepidarResult[i].Title,
                date:new Date()}})
            var modified = productResult.modifiedCount
            var matched = productResult.matchedCount
            if(matched){ notUpdateProduct++}
            if(modified){updateProduct++}
            if(!matched){
            const createResult = await products.create({
                sku:sepidarResult[i].Code,
                title:sepidarResult[i].Title,
                ItemID:sepidarResult[i].ItemID,
                date:new Date()})
                newProduct.push(sepidarResult[i].Code)
            }
        }
        
        await updateLog.create({
            updateQuery: "sepidar-product" ,
            date:Date.now()
        })
        res.json({sepidar:{new:newProduct,update:updateProduct,notUpdate:notUpdateProduct},
            message:"محصولات بروز شدند"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/sepidar-customer', async (req, res) => {
    const url = req.body.url;
    try {
        const sepidarResult = await sepidarFetch("data", "/api/Customers");

        if (sepidarResult.error || !sepidarResult.length) {
            res.json({
                error: "Error occurred",
                data: sepidarResult,
                message: "خطا در بروزرسانی"
            });
            return;
        }

        let newCustomer = 0;
        let updateCustomer = 0;
        let notUpdateCustomer = 0;

        for (let i = 0; i < sepidarResult.length; i++) {
            const customerData = sepidarResult[i];
            const meliCode = customerData.NationalID;  // NationalID (meliCode)

            // Handle missing or invalid meliCode
            if (!meliCode) {
                console.log(`Skipping customer due to missing meliCode:`, customerData);
                notUpdateCustomer++;  // Increment count for missing meliCode
                continue;  // Skip this iteration if meliCode is invalid
            }

            // First, check if a customer with the same meliCode already exists
            const existingCustomer = await customers.findOne({ meliCode });

            if (existingCustomer) {
                // Update the customer if the meliCode already exists
                const custResult = await customers.updateOne(
                    { phone: customerData.PhoneNumber, meliCode },
                    {
                        $set: {
                            username: customerData.Title,
                            cName: customerData.Name,
                            sName: customerData.LastName,
                            meliCode,
                            email: `${customerData.Code}@sharifoilco.com`,
                            access: "customer",
                            cCode: customerData.Code,
                            CustomerID: customerData.CustomerID,
                            AddressID: (customerData.Addresses && customerData.Addresses[0])
                                ? customerData.Addresses[0].CustomerAddressID
                                : '',
                            Address: (customerData.Addresses && customerData.Addresses[0])
                                ? customerData.Addresses[0].Address
                                : '',
                            postalCode: (customerData.Addresses && customerData.Addresses[0])
                                ? customerData.Addresses[0].ZipCode
                                : ''
                        }
                    }
                );

                const modified = custResult.modifiedCount;
                const matched = custResult.matchedCount;

                if (matched) {
                    notUpdateCustomer++;
                }
                if (modified) {
                    updateCustomer++;
                }
            } else {
                // If no existing customer with the same meliCode, create a new one
                await customers.create({
                    username: customerData.Title,
                    cName: customerData.Name,
                    sName: customerData.LastName,
                    phone: customerData.PhoneNumber,
                    meliCode,  // Ensure meliCode is valid here
                    email: `${customerData.Code}@sharifoilco.com`,
                    access: "customer",
                    cCode: customerData.Code,
                    CustomerID: customerData.CustomerID,
                    AddressID: (customerData.Addresses && customerData.Addresses[0])
                        ? customerData.Addresses[0].CustomerAddressID
                        : '',
                    Address: (customerData.Addresses && customerData.Addresses[0])
                        ? customerData.Addresses[0].Address
                        : '',
                    PostalCode: (customerData.Addresses && customerData.Addresses[0])
                        ? customerData.Addresses[0].ZipCode
                        : '',
                    date: new Date()
                });
                newCustomer++;
            }
        }

        // Log update activity
        await updateLog.create({
            updateQuery: "sepidar-customer",
            date: Date.now()
        });

        // Respond with success message and summary
        res.json({
            sepidar: {
                newCustomer,
                updateCustomer,
                notUpdateCustomer
            },
            message: "کاربران بروز شدند"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/sepidar-price', async (req,res)=>{
    try{
        const sepidarPriceResult = await sepidarFetch("data","/api/PriceNoteItems")
        if(sepidarPriceResult.error||!sepidarPriceResult.length){
            res.json({error:"error occure",
                data:sepidarPriceResult,message:"خطا در بروزرسانی"})
            return
        }
        //var successItem=[];
        //var failure = 0;
        await productPrice.deleteMany({})
        for(var i = 0;i<sepidarPriceResult.length;i++){
            //sepidarPriceResult[i].SaleTypeRef===5&& 
            await productPrice.create({
                pID:sepidarPriceResult[i].Code,
                saleType:sepidarPriceResult[i].SaleTypeRef,
                price:sepidarPriceResult[i].Fee?(parseInt(sepidarPriceResult[i].Fee)):0,
                ItemID:sepidarPriceResult[i].ItemRef,
                date:new Date()})
                
        }
        
        await updateLog.create({
            updateQuery: "sepidar-price" ,
            date:Date.now()
        })
        res.json({sepidar:sepidarPriceResult.length,message:"قیمت ها بروز شدند"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/sepidar-city', async (req,res)=>{
    try{
        const cityResult = await sepidarFetch("data","/api/AdministrativeDivisions")
        if(cityResult.error||!cityResult.length){
            res.json({error:"error occure",
                data:cityResult,message:"خطا در بروزرسانی"})
            return
        }
        //var successItem=[];
        //var failure = 0;
        for(var i = 0;i<cityResult.length;i++){
            //sepidarPriceResult[i].SaleTypeRef===5&& 
            if(cityResult[i].Type==2){
                await state.create({
                    stateName:  cityResult[i].Title,
                    stateId:cityResult[i].DivisionID
                })
            }
            if(cityResult[i].Type==3){
                await city.create({
                    cityName:  cityResult[i].Title,
                    cityId:cityResult[i].DivisionID,
                    stateId:cityResult[i].ParentDivisionRef
                })
            }
                
        }
        
        await updateLog.create({
            updateQuery: "sepidar-city" ,
            date:Date.now()
        })
        res.json({sepidar:cityResult.length,message:"شهرها بروز شدند"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/sepidar-bank', async (req,res)=>{
    const url=req.body.url
    try{
        const sepidarBankResult = await sepidarFetch("data","/api/BankAccounts")
        if(sepidarBankResult.error||!sepidarBankResult.length){
            res.json({error:"error occure",
                data:sepidarBankResult,message:"خطا در بروزرسانی"})
            return
        }
        //var successItem=[];
        //var failure = 0;
        0&&await bankAccounts.deleteMany({})
        for(var i = 0;i<sepidarBankResult.length;i++){
            //sepidarPriceResult[i].SaleTypeRef===5&& 
            0&&await bankAccounts.create({
                BankAccountID:sepidarBankResult[i].BankAccountID,
                DlCode:sepidarBankResult[i].DlCode,
                DlTitle:sepidarBankResult[i].DlTitle,
                CurrencyRef:sepidarBankResult[i].CurrencyRef})
                
        }
        await updateLog.create({
            updateQuery: "sepidar-bank" ,
            date:Date.now()
        })
        res.json({sepidar:sepidarBankResult.length,
            data:sepidarBankResult,message:"غیر فعال است"})//"بانک ها بروز شدند"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/sepidar-quantity', async (req,res)=>{
    try{
        const sepidarQuantityResult = await sepidarFetch("data","/api/Items/Inventories")

        if(sepidarQuantityResult.error||!sepidarQuantityResult.length){
            res.json({error:"error occure",
                data:sepidarQuantityResult,message:"خطا در بروزرسانی"})
            return
        }
        //var successItem=[];
        //var failure = 0;
        await productCount.deleteMany({})
        for(var i = 0;i<sepidarQuantityResult.length;i++){
            if(sepidarQuantityResult[i].UnitRef!==3)
            await productCount.create({
                quantity:sepidarQuantityResult[i].Qunatity,
                UnitRef:sepidarQuantityResult[i].UnitRef,
                Stock:sepidarQuantityResult[i].StockeRef,
                ItemID:sepidarQuantityResult[i].ItemRef,
            date:new Date()})
            else{
                if(sepidarQuantityResult[i].StockeRef!==5)continue
                var perBox = 1
                var singleItem = await sepidarQuantityResult.find
                    (item=>(item.ItemRef===sepidarQuantityResult[i].ItemRef&&
                        item.UnitRef==1&&item.StockeRef==5))
                if(sepidarQuantityResult[i].Qunatity)
                    perBox =(singleItem&&singleItem.Qunatity)/
                        sepidarQuantityResult[i].Qunatity
                
                var intBox =0
                try{intBox=(parseInt(Math.round(perBox)))} catch{}
                if(perBox!==1&&intBox!==0)await products.updateOne({
                    ItemID:sepidarQuantityResult[i].ItemRef,
                },{$set:{perBox:intBox}})
            }
        }
        
        await updateLog.create({
            updateQuery: "sepidar-quantity" ,
            date:Date.now()
        })
        res.json({sepidar:sepidarQuantityResult.length,message:"تعداد بروز شدند"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/sepidar-all', async (req,res)=>{
    try{
        response = await fetch(ONLINE_URL+"/sepidar-product",
            {method: 'GET'});
        response = await fetch(ONLINE_URL+"/sepidar-price",
            {method: 'GET'});
        response = await fetch(ONLINE_URL+"/sepidar-quantity",
            {method: 'GET'});
        response = await fetch(ONLINE_URL+"/sepidar-customers",
            {method: 'GET'});
        response = await fetch(ONLINE_URL+"/sepidar-bank",
            {method: 'GET'});
        response = await fetch(ONLINE_URL+"/sepidar-invoices",
            {method: 'GET'});
        res.json({message:"تمامی جدول ها بروز شدند"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.get('/sepidar-update-log', async (req,res)=>{
    try{ 
        const sepidarLog = await updateLog.find({}).sort({"date":-1})
        
        res.json({log:sepidarLog,message:"done"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.get('/sepidar-invoices', async (req, res) => {
    try {
        const sepidarInvoiceResult = await sepidarFetch("data", "/api/Invoices");

        if (sepidarInvoiceResult.error || !sepidarInvoiceResult.length) {
            res.json({ error: "Error occurred", data: sepidarInvoiceResult, message: "خطا در بروزرسانی" });
            return;
        }

        let newInvoiceCount = 0;
        let updateInvoiceCount = 0;

        for (let i = 0; i < sepidarInvoiceResult.length; i++) {
            const invoiceData = sepidarInvoiceResult[i];
            const existingInvoice = await Invoice.findOne({ InvoiceID: invoiceData.InvoiceID });

            if (existingInvoice) {
                const updateResult = await Invoice.updateOne(
                    { InvoiceID: invoiceData.InvoiceID },
                    { $set: invoiceData }
                );

                if (updateResult.modifiedCount) {
                    updateInvoiceCount++;
                }
            } else {
                await Invoice.create(invoiceData);
                newInvoiceCount++;
            }
        }

        await updateLog.create({
            updateQuery: "sepidar-invoices",
            date: Date.now(),
        });

        res.json({
            sepidar: {
                newInvoiceCount,
                updateInvoiceCount,
            },
            message: "فاکتورها بروز شدند",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/get-all-invoices', async (req, res) => {
    try {
        // Step 1: Find all invoices
        const invoices = await Invoice.find();

        if (!invoices.length) {
            return res.status(404).json({ message: "No invoices found" });
        }

        // Step 2: Loop through each invoice and get additional data from the external API
        for (const invoice of invoices) {
            const invoiceId = invoice.InvoiceID;
            // Fetch data from /api/invoices/<InvoiceId> API
            const invoiceData = await fetchInvoiceData(invoiceId);

            if (invoiceData) {
                // Step 3: Prepare the full invoice document with nested InvoiceItems
                const invoiceDocument = {
                    InvoiceID: invoiceData.InvoiceID,
                    OrderRef: invoiceData.OrderRef,
                    QuotationRef: invoiceData.QuotationRef,
                    Number: invoiceData.Number,
                    Date: new Date(invoiceData.Date),  // Convert the string to a Date object
                    CustomerRef: invoiceData.CustomerRef,
                    CurrencyRef: invoiceData.CurrencyRef,
                    Rate: invoiceData.Rate,
                    SaleTypeRef: invoiceData.SaleTypeRef,
                    AddressRef: invoiceData.AddressRef,
                    Price: invoiceData.Price,
                    Tax: invoiceData.Tax,
                    Duty: invoiceData.Duty,
                    Discount: invoiceData.Discount,
                    Addition: invoiceData.Addition,
                    NetPrice: invoiceData.NetPrice,
                    Agreements: invoiceData.Agreements,
                    // The InvoiceItems are directly inserted as an array of objects
                    InvoiceItems: invoiceData.InvoiceItems.map(item => ({
                        InvoiceItemID: item.InvoiceItemID,
                        ItemRef: item.ItemRef,
                        TracingRef: item.TracingRef,
                        TracingTitle: item.TracingTitle,
                        Quantity: item.Quantity,
                        SecondaryQuantity: item.SecondaryQuantity,
                        Fee: item.Fee,
                        Price: item.Price,
                        Discount: item.Discount,
                        Tax: item.Tax,
                        Duty: item.Duty,
                        Addition: item.Addition,
                        NetPrice: item.NetPrice,
                        DiscountInvoiceItemRef: item.DiscountInvoiceItemRef,
                        ProductPackRef: item.ProductPackRef,
                        ProductPackQuantity: item.ProductPackQuantity,
                        Description: item.Description,
                        IsAggregateDiscountInvoiceItem: item.IsAggregateDiscountInvoiceItem,
                        SaleGroupRef: item.SaleGroupRef,
                        PurchaseGroupRef: item.PurchaseGroupRef,
                        InvoiceID: item.InvoiceID  // Set to the current invoice's ID
                    }))
                };

        
                // Step 4: Insert the full invoice document (with nested InvoiceItems) into MongoDB
                await InvoiceItem.create(invoiceDocument);

                console.log(`Invoice ${invoiceData.InvoiceID} saved with InvoiceItems.`);
            }
        }

        // Respond with success message
        res.json({ message: "Invoices and InvoiceItems updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

async function fetchInvoiceData(invoiceId) {
    try {
        // Use any method to make the API call (e.g., axios, fetch)
        // Here we're using `fetch` as an example
        const response = await sepidarFetch("data", `/api/invoices/${invoiceId}`);
        return response; 

    } catch (error) {
        console.error(`Error fetching invoice data for InvoiceID: ${invoiceId}`, error);
        return null;
    }
}
module.exports = router;