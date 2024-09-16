const mongoose = require('mongoose');

// Import your Website model here if not already imported
const Website = require('../models/webModel');

const connectDatabase = () => {
    // Addressing the deprecation warning by setting strictQuery to false
    mongoose.set('strictQuery', false);

    mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(async(data) => {
            console.log(`MongoDB connected with server: ${data.connection.host}`);

            const defaultWebsite = await Website.findOne();
            if (!defaultWebsite) {
                await Website.create({
                    logo: { url: "/images/logo/default/defaultlogo.png" },
                    hotline: "0123456789",
                    email: "base@gmail.com"
                });
            }
        })
        .catch((error) => {
            console.error('MongoDB connection error:', error);
        });
};

module.exports = connectDatabase;