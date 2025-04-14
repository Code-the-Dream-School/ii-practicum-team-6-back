const express = require('express');
const app = express();
const cors = require('cors')
const favicon = require('express-favicon');
const logger = require('morgan');
//project router
const projectRouter = require('./routes/projects.js')
const notFoundMiddleware = require('./middleware/not-found.js');
const errorHandlerMiddleware = require('./middleware/error-handler.js');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.static('public'))
app.use(favicon(__dirname + '/public/favicon.ico'));
//swager
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// routes
app.use('/api/projects/',projectRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


module.exports = app;