const express = require('express');
const app = express();
const cors = require('cors')
const favicon = require('express-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const {errorHandler} = require('./middleware/erroHandlerMiddleware')



//project router
const projectRouter = require('./routes/projects.js')
const skillRouter = require('./routes/skills.js')
const notFoundMiddleware = require('./middleware/not-found.js');
const errorHandlerMiddleware = require('./middleware/error-handler.js');
//swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger.js');

// middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.static('public'))
app.use(favicon(__dirname + '/public/favicon.ico'));
//swager
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



// routes
//app.use('/api/v1', mainRouter);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects/',projectRouter)
app.use('/api/skills',skillRouter)


//error handler
app.use(errorHandler)
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


module.exports = app;