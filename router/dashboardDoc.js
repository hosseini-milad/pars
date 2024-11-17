
/**
 * @swagger
 * /top-products:
 *   get:
 *     summary: Retrieve the top 5 products
 *     security:
 *       - ApiKeyAuth: []
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
 *                   ItemID:
 *                     type: string
 *                     description: Product ID
 *                   totalQuantitySold:
 *                     type: integer
 *                     description: Total quantity sold
 *                   title:
 *                     type: string
 *                     description: Product title
 */

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

/**
 * @swagger
 * /category-product-counts:
 *   get:
 *     summary: Retrieve the counts of products for each category
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: A list of categories with their product counts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   categoryId:
 *                     type: string
 *                     description: The ID of the category
 *                   categoryName:
 *                     type: string
 *                     description: The name of the category
 *                   productCount:
 *                     type: integer
 *                     description: The number of products in the category
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /product-categories:
 *   get:
 *     summary: Retrieve product details along with their categories
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: A list of products with their associated categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: string
 *                     description: The ID of the product
 *                   productName:
 *                     type: string
 *                     description: The name of the product
 *                   categoryId:
 *                     type: string
 *                     description: The ID of the associated category
 *                   categoryName:
 *                     type: string
 *                     description: The name of the associated category
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /branch-stats:
 *   get:
 *     summary: Retrieve statistics for branches
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Statistics of distinct branches and their record percentages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   branches:
 *                     type: integer
 *                     description: The total number of distinct branches
 *                   branchPercentages:
 *                     type: object
 *                     additionalProperties:
 *                       type: number
 *                       description: The percentage of records for each branch
 *                     description: An object where keys are branch IDs and values are percentages of records
 *       500:
 *         description: Server error
 */
