const mongoose = require('mongoose')
require('dotenv').config();

async function ConnectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Connected to MongoDB');
    } catch (e) {
        console.error(e, 'error')
    }
    
}

module.exports = {ConnectDB}