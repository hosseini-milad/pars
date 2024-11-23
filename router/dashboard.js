const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const cart = require('../models/product/cart');
const getTimeFilter = require('../middleware/timeFiltering');

const getBranchFilter = (branchId) => branchId ? { branchId: Number(branchId) } : {};

router.get('/top-products', auth, async (req, res) => {
    try {
        const { timeFilter = 'all', branchId, aggregateBy = 'count' } = req.query;
        if (!['count', 'price'].includes(aggregateBy))
            return res.status(400).json({ message: "aggregateBy must be 'count' or 'price'" });

        const dateFilter = getTimeFilter(timeFilter);
        const branch = getBranchFilter(branchId);

        const countField = {
            $convert: {
                input: "$cartItems.count",
                to: "double",
                onError: 0,
                onNull: 0
            }
        };
        const priceField = {
            $convert: {
                input: "$cartItems.price",
                to: "double",
                onError: 0,
                onNull: 0
            }
        };

        const sumField = aggregateBy === 'price'
            ? { $multiply: [countField, priceField] }
            : countField;

        const topCartItems = await cart.aggregate([
            { $match: { ...dateFilter, ...branch } },
            { $unwind: "$cartItems" },
            {
                $group: {
                    _id: "$cartItems.title",
                    totalValue: { $sum: sumField }
                }
            },
            { $sort: { totalValue: -1 } },
            { $limit: 5 }
        ]);

        res.json({ data: topCartItems });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/lowest-products', auth, async (req, res) => {
    try {
        const { timeFilter = 'all', branchId, aggregateBy = 'count' } = req.query;
        if (!['count', 'price'].includes(aggregateBy))
            return res.status(400).json({ message: "aggregateBy must be 'count' or 'price'" });

        const dateFilter = getTimeFilter(timeFilter);
        const branch = getBranchFilter(branchId);

        const countField = {
            $convert: {
                input: "$cartItems.count",
                to: "double",
                onError: 0,
                onNull: 0
            }
        };
        const priceField = {
            $convert: {
                input: "$cartItems.price",
                to: "double",
                onError: 0,
                onNull: 0
            }
        };

        const sumField = aggregateBy === 'price'
            ? { $multiply: [countField, priceField] }
            : countField;

        const lowestCartItems = await cart.aggregate([
            { $match: { ...dateFilter, ...branch } },
            { $unwind: "$cartItems" },
            {
                $group: {
                    _id: "$cartItems.title",
                    totalValue: { $sum: sumField }
                }
            },
            { $sort: { totalValue: 1 } },
            { $limit: 5 }
        ]);

        res.json({ data: lowestCartItems });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/sales-process', auth, async (req, res) => {
    try {
        const { timeFilter = 'all', branchId, aggregateBy = 'count' } = req.query;
        if (!['count', 'price'].includes(aggregateBy))
            return res.status(400).json({ message: "aggregateBy must be 'count' or 'price'" });

        const dateFilter = getTimeFilter(timeFilter);
        const branch = getBranchFilter(branchId);

        const countField = {
            $convert: {
                input: "$cartItems.count",
                to: "double",
                onError: 0,
                onNull: 0
            }
        };
        const priceField = {
            $convert: {
                input: "$cartItems.price",
                to: "double",
                onError: 0,
                onNull: 0
            }
        };

        const sumField = aggregateBy === 'price'
            ? { $multiply: [countField, priceField] }
            : countField;

        const salesProcess = await cart.aggregate([
            { $match: { ...dateFilter, ...branch } },
            { $unwind: "$cartItems" },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$initDate" } },
                    totalSales: { $sum: sumField }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const response = salesProcess.map(record => ({
            date: record._id,
            totalSales: record.totalSales
        }));

        res.json({ data: response });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/category-product-counts', auth, async (req, res) => {
    try {
        const { timeFilter = 'all', branchId, aggregateBy = 'count' } = req.query;
        if (!['count', 'price'].includes(aggregateBy))
            return res.status(400).json({ message: "aggregateBy must be 'count' or 'price'" });

        const dateFilter = getTimeFilter(timeFilter);
        const branch = getBranchFilter(branchId);

        const countField = {
            $convert: {
                input: "$cartItems.count",
                to: "double",
                onError: 0,
                onNull: 0
            }
        };
        const priceField = {
            $convert: {
                input: "$cartItems.price",
                to: "double",
                onError: 0,
                onNull: 0
            }
        };

        const sumField = aggregateBy === 'price'
            ? { $multiply: [countField, priceField] }
            : countField;

        const categoryProductCounts = await cart.aggregate([
            { $match: { ...dateFilter, ...branch } },
            { $unwind: "$cartItems" },
            {
                $lookup: {
                    from: "products",
                    localField: "cartItems.id",
                    foreignField: "ItemID",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" },
            {
                $lookup: {
                    from: "categories",
                    localField: "productDetails.catId",
                    foreignField: "catCode",
                    as: "categoryDetails"
                }
            },
            { $unwind: "$categoryDetails" },
            {
                $group: {
                    _id: "$categoryDetails.catCode",
                    categoryName: { $first: "$categoryDetails.title" },
                    totalValue: { $sum: sumField }
                }
            },
            {
                $project: {
                    _id: 0,
                    categoryId: "$_id",
                    categoryName: 1,
                    totalValue: 1
                }
            }
        ]);

        res.json({ data: categoryProductCounts });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/branch-stats', auth, async (req, res) => {
    try {
        const { timeFilter = 'all', aggregateBy = 'count' } = req.query;
        if (!['count', 'price'].includes(aggregateBy))
            return res.status(400).json({ message: "aggregateBy must be 'count' or 'price'" });

        const dateFilter = getTimeFilter(timeFilter);

        const countField = {
            $convert: {
                input: "$cartItems.count",
                to: "double",
                onError: 0,
                onNull: 0
            }
        };
        const priceField = {
            $convert: {
                input: "$cartItems.price",
                to: "double",
                onError: 0,
                onNull: 0
            }
        };

        const sumField = aggregateBy === 'price'
            ? { $multiply: [countField, priceField] }
            : countField;

        const branchStats = await cart.aggregate([
            { $match: { ...dateFilter } },
            { $unwind: "$cartItems" },
            {
                $group: {
                    _id: "$branchId",
                    totalValue: { $sum: sumField }
                }
            }
        ]);

        const totalValues = branchStats.reduce((sum, branch) => sum + branch.totalValue, 0);

        const percentageStats = branchStats.map(branch => ({
            branchId: branch._id,
            totalValue: branch.totalValue,
            percentage: ((branch.totalValue / totalValues) * 100).toFixed(2)
        }));

        const response = {
            totalBranches: branchStats.length,
            totalValues,
            stats: percentageStats
        };

        res.json({ data: response });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/product-categories', auth, async (req, res) => {
    try {
        const { timeFilter = 'all', branchId, aggregateBy = 'count' } = req.query;
        if (!['count', 'price'].includes(aggregateBy))
            return res.status(400).json({ message: "aggregateBy must be 'count' or 'price'" });

        const dateFilter = getTimeFilter(timeFilter);
        const branch = getBranchFilter(branchId);

        const countField = {
            $convert: {
                input: "$cartItems.count",
                to: "double",
                onError: 0,
                onNull: 0
            }
        };
        const priceField = {
            $convert: {
                input: "$cartItems.price",
                to: "double",
                onError: 0,
                onNull: 0
            }
        };

        const sumField = aggregateBy === 'price'
            ? { $multiply: [countField, priceField] }
            : countField;

        const productCategories = await cart.aggregate([
            { $match: { ...dateFilter, ...branch } },
            { $unwind: "$cartItems" },
            {
                $lookup: {
                    from: "products",
                    localField: "cartItems.id",
                    foreignField: "ItemID",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" },
            {
                $lookup: {
                    from: "categories",
                    localField: "productDetails.catId",
                    foreignField: "catCode",
                    as: "categoryDetails"
                }
            },
            { $unwind: "$categoryDetails" },
            {
                $project: {
                    _id: 0,
                    productId: "$productDetails.ItemID",
                    productName: "$productDetails.title",
                    categoryId: "$categoryDetails.catCode",
                    categoryName: "$categoryDetails.name",
                    value: sumField
                }
            }
        ]);

        res.json({ data: productCategories });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
