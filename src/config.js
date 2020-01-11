require('dotenv').config();

const PORT = process.env.PORT || 6000;
const DB_URI = process.env.DATABASE_URL;
const API_KEY = process.env.ACCOUNT_SECURITY_API_KEY;

module.exports = {PORT, DB_URI, API_KEY}