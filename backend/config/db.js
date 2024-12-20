const mongoose = require('mongoose')
require('dotenv').config();

async function ConnectDB() {
    try {
        await mongoose.connect(process.env.DB_URI)
        console.log('Connected to MongoDB');
    } catch (e) {
        console.error(e, 'error')
    }
    
}

module.exports = {ConnectDB}