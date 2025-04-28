const express = require('express');
const app = express();
const cors = require('cors')
const favicon = require('express-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const commentRoutes = require('./routes/comments')
const projectRoutes = require('./routes/projects.js')
const skillRoutes = require('./routes/skills.js')
const notFoundMiddleware = require('./middleware/notFoundMiddleware.js');
const errorHandlerMiddleware = require('./middleware/errorHandlerMiddleware.js');

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
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects/', projectRoutes)
app.use('/api/skills', skillRoutes)
app.use('/api/comments', commentRoutes)


//error handler
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


module.exports = app;