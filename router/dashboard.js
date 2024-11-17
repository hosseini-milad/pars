const express = require('express');
const router = express.Router();
const invoiceItems = require('../models/sepidar/invoiceItems');
const products = require('../models/product/products'); 
const categories = require('../models/product/category');
const auth = require("../middleware/auth");



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


router.get('/branch-stats',auth, async (req, res) => {
    try {
        // Get distinct branchIds
        const distinctBranches = await cart.distinct("branchId");

        // Get branch counts
        const branchCounts = await cart.aggregate([
            {
                $group: {
                    _id: "$branchId", // Group by branchId
                    count: { $sum: 1 } // Count occurrences of each branchId
                }
            }
        ]);

        // Total records for percentage calculation
        const totalRecords = branchCounts.reduce((sum, branch) => sum + branch.count, 0);

        // Prepare percentage stats
        const percentageStats = branchCounts.map(branch => ({
            branchId: branch._id,
            percentage: ((branch.count / totalRecords) * 100).toFixed(2) // Calculate percentage
        }));

        const response = [
            { branches: distinctBranches.length }, // Total distinct branches
            Object.fromEntries(percentageStats.map(stat => [stat.branchId, parseFloat(stat.percentage)])) // Percentage per branch
        ];

        res.json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/product-categories',auth, async (req, res) => {
    try {
        // Aggregate query to join products with categories
        const productCategories = await products.aggregate([
            {
                $lookup: {
                    from: "categories", // Collection to join
                    localField: "catId", // Field in products
                    foreignField: "catCode", // Field in categories
                    as: "categoryDetails" // Resulting array field
                }
            },
            {
                $unwind: "$categoryDetails" // Unwind the category details for easier access
            },
            {
                $project: {
                    _id: 0, // Exclude internal MongoDB ID
                    productId: "$ItemID", // Map the product ID
                    productName: "$title", // Map the product title
                    categoryId: "$categoryDetails.catCode", // Map the category code
                    categoryName: "$categoryDetails.name" // Map the category name
                }
            }
        ]);

        res.json(productCategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/category-product-counts',auth, async (req, res) => {
    try {
        // Aggregate query to join products with categories and count products per category
        const categoryProductCounts = await products.aggregate([
            {
                $lookup: {
                    from: "categories", // Collection to join
                    localField: "catId", // Field in products
                    foreignField: "catCode", // Field in categories
                    as: "categoryDetails" // Resulting array field
                }
            },
            {
                $unwind: "$categoryDetails" // Unwind the category details for easier access
            },
            {
                $group: {
                    _id: "$categoryDetails.catCode", // Group by category code
                    categoryName: { $first: "$categoryDetails.title" }, // Get the category name
                    productCount: { $sum: 1 } // Count the number of products
                }
            },
            {
                $project: {
                    _id: 0, // Exclude internal MongoDB ID
                    categoryId: "$_id", // Map the category code
                    categoryName: 1, // Include the category name
                    productCount: 1 // Include the count of products
                }
            }
        ]);

        res.json(categoryProductCounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
