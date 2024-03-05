const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.set('strictQuery', false); // Add this line to address the deprecation warning

    mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then((data) => {
            console.log(`Mongodb connected with server : ${data.connection.host}`);
        })
        .catch((error) => {
            console.error('Mongodb connection error:', error);
        });
};

module.exports = connectDatabase;