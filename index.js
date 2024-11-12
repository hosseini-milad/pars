const http = require('http')
const app = require("./app");
const { API_PORT } = process.env;
const port = 4030 || API_PORT;
const logger = require("./middleware/logger")
const swaggerUi = require('swagger-ui-express');

const server = http.createServer(app)

// server.use('/api-docs', swaggerUi.serve, swaggerUi.setup());

server.get('/', async (req,res)=>{
  res.send('ddd')
})

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  logger.info(`listening at http://localhost:${port}`)
})


