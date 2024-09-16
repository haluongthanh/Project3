const app = require('./app');

const path = require('path');
//ok chưa
const connectDatabase = require('./config/database');

const dotenv = require('dotenv');
dotenv.config({ path: 'config/config.env' })


const port = process.env.PORT || 9000;

if (process.env.NODE_ENV !== 'PRODUCTION') {
    dotenv.config({ path: 'config/config.env' })
}

const server = app.listen(port, () => {
    console.log(`server running on http://localhost:${port}`);
    connectDatabase();
})