const express = require('express');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');

require('dotenv').config();

const error = require('./middlewares/error');

const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rateLimiter');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { NODE_ENV, MONGODB_ADDRESS } = process.env;
mongoose.connect(NODE_ENV === 'production' ? MONGODB_ADDRESS : 'mongodb://localhost:27017/moviesdb', () => {
  console.log('MongoDB work');
});

app.use(requestLogger);
app.use(cors);

app.use('/', limiter, require('./routes/index'));

app.use(errorLogger);
app.use(errors());
app.use(error);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
