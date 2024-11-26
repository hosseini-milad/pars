/**
 * @swagger
 * /top-products:
 *   get:
 *     summary: Retrieve the top 5 products by count or price
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: timeFilter
 *         in: query
 *         description: Filter data by time (day, week, month, year, all)
 *         required: false
 *         schema:
 *           type: string
 *           enum: [day, week, month, year, all]
 *           default: all
 *       - name: branchId
 *         in: query
 *         description: Branch ID to filter (optional)
 *         required: false
 *         schema:
 *           type: integer
 *       - name: aggregateBy
 *         in: query
 *         description: Aggregate by count or price
 *         required: false
 *         schema:
 *           type: string
 *           enum: [count, price]
 *           default: count
 *     responses:
 *       200:
 *         description: A list of top 5 products with their total value
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Product ID
 *                       title:
 *                         type: string
 *                         description: Product title
 *                       totalValue:
 *                         type: number
 *                         description: Total count or total price
 */

/**
 * @swagger
 * /lowest-products:
 *   get:
 *     summary: Retrieve the lowest 5 products by count or price
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: timeFilter
 *         in: query
 *         description: Filter data by time (day, week, month, year, all)
 *         required: false
 *         schema:
 *           type: string
 *           enum: [day, week, month, year, all]
 *           default: all
 *       - name: branchId
 *         in: query
 *         description: Branch ID to filter (optional)
 *         required: false
 *         schema:
 *           type: integer
 *       - name: aggregateBy
 *         in: query
 *         description: Aggregate by count or price
 *         required: false
 *         schema:
 *           type: string
 *           enum: [count, price]
 *           default: count
 *     responses:
 *       200:
 *         description: A list of lowest 5 products with their total value
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Product ID
 *                       title:
 *                         type: string
 *                         description: Product title
 *                       totalValue:
 *                         type: number
 *                         description: Total count or total price
 */

/**
 * @swagger
 * /sales-process:
 *   get:
 *     summary: Retrieve sales data by date
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: timeFilter
 *         in: query
 *         description: Filter data by time (day, week, month, year, all)
 *         required: false
 *         schema:
 *           type: string
 *           enum: [day, week, month, year, all]
 *           default: all
 *       - name: branchId
 *         in: query
 *         description: Branch ID to filter (optional)
 *         required: false
 *         schema:
 *           type: integer
 *       - name: aggregateBy
 *         in: query
 *         description: Aggregate by count or price
 *         required: false
 *         schema:
 *           type: string
 *           enum: [count, price]
 *           default: count
 *     responses:
 *       200:
 *         description: Sales data grouped by date
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Cart number (cartNo)
 *                       date:
 *                         type: string
 *                         format: date
 *                         description: Date of sales
 *                       totalSales:
 *                         type: number
 *                         description: Total sales value
 */

/**
 * @swagger
 * /category-product-counts:
 *   get:
 *     summary: Retrieve product counts per category
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: timeFilter
 *         in: query
 *         description: Filter data by time (day, week, month, year, all)
 *         required: false
 *         schema:
 *           type: string
 *           enum: [day, week, month, year, all]
 *           default: all
 *       - name: branchId
 *         in: query
 *         description: Branch ID to filter (optional)
 *         required: false
 *         schema:
 *           type: integer
 *       - name: aggregateBy
 *         in: query
 *         description: Aggregate by count or price
 *         required: false
 *         schema:
 *           type: string
 *           enum: [count, price]
 *           default: count
 *     responses:
 *       200:
 *         description: A list of product counts per category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Category ID
 *                       categoryName:
 *                         type: string
 *                         description: Category name
 *                       totalValue:
 *                         type: number
 *                         description: Total count or price value
 */

/**
 * @swagger
 * /branch-stats:
 *   get:
 *     summary: Retrieve branch statistics
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: timeFilter
 *         in: query
 *         description: Filter data by time (day, week, month, year, all)
 *         required: false
 *         schema:
 *           type: string
 *           enum: [day, week, month, year, all]
 *           default: all
 *       - name: aggregateBy
 *         in: query
 *         description: Aggregate by count or price
 *         required: false
 *         schema:
 *           type: string
 *           enum: [count, price]
 *           default: count
 *     responses:
 *       200:
 *         description: Branch statistics with total values and percentages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalBranches:
 *                       type: integer
 *                       description: Total number of branches
 *                     totalValues:
 *                       type: number
 *                       description: Total aggregated value
 *                     stats:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: Branch ID
 *                           totalValue:
 *                             type: number
 *                             description: Total count or price value for the branch
 *                           percentage:
 *                             type: number
 *                             description: Percentage of the total value
 *                           name:
 *                             type: string
 *                             description: Branch name
 */

/**
 * @swagger
 * /product-categories:
 *   get:
 *     summary: Retrieve products and their categories
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: timeFilter
 *         in: query
 *         description: Filter data by time (day, week, month, year, all)
 *         required: false
 *         schema:
 *           type: string
 *           enum: [day, week, month, year, all]
 *           default: all
 *       - name: branchId
 *         in: query
 *         description: Branch ID to filter (optional)
 *         required: false
 *         schema:
 *           type: integer
 *       - name: aggregateBy
 *         in: query
 *         description: Aggregate by count or price
 *         required: false
 *         schema:
 *           type: string
 *           enum: [count, price]
 *           default: count
 *     responses:
 *       200:
 *         description: A list of products and their categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                         description: Product ID
 *                       productName:
 *                         type: string
 *                         description: Product name
 *                       categoryId:
 *                         type: string
 *                         description: Category ID
 *                       categoryName:
 *                         type: string
 *                         description: Category name
 *                       value:
 *                         type: number
 *                         description: Total count or price value
 */
