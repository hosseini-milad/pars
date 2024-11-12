const express = require('express');
const router = express.Router();
const invoiceItems = require('../models/sepidar/invoiceItems');
const products = require('../models/product/products'); 
const auth = require("../middleware/auth");


/**
 * @swagger
 * /top-products:
 *   get:
 *     summary: Retrieve the top 5 products
 *     responses:
 *       200:
 *         description: A list of top products with their quantities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Product ID
 *                   totalQuantitySold:
 *                     type: integer
 *                     description: Total quantity sold
 *                   title:
 *                     type: string
 *                     description: Product title
 */
router.get('/top-products',auth, async (req, res) => {
    try {
        const topProducts = await invoiceItems.aggregate([
            { $unwind: "$InvoiceItems" },
            {
                $group: {
                    _id: "$InvoiceItems.ItemRef", 
                    totalQuantitySold: { $sum: "$InvoiceItems.Quantity" } // Sum quantities within InvoiceItems
                }
            },
            { $sort: { totalQuantitySold: -1 } }, 
            { $limit: 5 }
        ]);

        const productIds = topProducts.map(item => item._id);
        
        const productsData = await products.find(
            { ItemID: { $in: productIds } },
            { ItemID: 1, title: 1 } 
        );

        const response = topProducts.map(item => {
            const product = productsData.find(p => p.ItemID.toString() === item._id.toString());
            return {
                ItemID: item._id,
                title: product ? product.title : "Unknown Product",
                totalQuantitySold: item.totalQuantitySold // Include total quantity sold in the response
            };
        });

        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /lowest-products:
 *   get:
 *     summary: Retrieve the lowest 5 products
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: A list of lowest-selling products with their quantities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ItemID:
 *                     type: string
 *                     description: Product ID
 *                   title:
 *                     type: string
 *                     description: Product title
 *                   totalQuantitySold:
 *                     type: integer
 *                     description: Total quantity sold
 */

router.get('/lowest-products',auth, async (req, res) => {
    try {
        const lowestProducts = await invoiceItems.aggregate([
            { $unwind: "$InvoiceItems" },
            {
                $group: {
                    _id: "$InvoiceItems.ItemRef", 
                    totalQuantitySold: { $sum: "$InvoiceItems.Quantity" } 
                }
            },
            { $sort: { totalQuantitySold: 1 } }, 
            { $limit: 5 } 
        ]);

        const productIds = lowestProducts.map(item => item._id);
        
        const productsData = await products.find(
            { ItemID: { $in: productIds } },
            { ItemID: 1, title: 1 } 
        );

        const response = lowestProducts.map(item => {
            const product = productsData.find(p => p.ItemID.toString() === item._id.toString());
            return {
                ItemID: item._id,
                title: product ? product.title : "Unknown Product",
                totalQuantitySold: item.totalQuantitySold // Include total quantity sold in the response
            };
        });

        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
