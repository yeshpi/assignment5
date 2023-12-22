const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config({path:'./env/.env'});

const mongoEnv = {
  url: process.env.MONGO_URL,
  urlSession:process.env.MONGO_URL_SESSION,
  username: process.env.MONGO_USERNAME,
  password: process.env.MONGO_PASSWORD,
  database: process.env.MONGO_DATABASE,
  sessionSecret:process.env.SESSION_SECRET,
};

module.exports = mongoEnv;