const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorMiddleware = require('./middleware/error');
const path = require('path');
const session = require('express-session');
const passport = require("passport");
const passportConfig = require('./utils/passport');

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'abcdef12',
    resave: false,
    saveUninitialized: true,
    cookie: {
        name: 'session',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

app.use(cors({
    origin: function(origin, callback) {
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:9000',
            'https://bhfx3pdyma.ap-southeast-2.awsapprunner.com',
            'https://zjkmaacmii.ap-southeast-2.awsapprunner.com'
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const category = require('./routes/categoryRoute');
const brand = require('./routes/brandRoute');
const user = require('./routes/userRoute');
const product = require('./routes/productRoute');
const review = require('./routes/reviewRoute');
const order = require('./routes/orderRoute');
const banner = require('./routes/bannerRoute');
const blog = require('./routes/blogRoute');
const blogcategory = require('./routes/blogCategoryRoute');
const website = require('./routes/websiteRoute');
const payment = require('./routes/paymentRoute');

app.use('/api/v1', category);
app.use('/api/v1', brand);
app.use('/api/v1', user);
app.use('/api/v1', banner);
app.use('/api/v1', product);
app.use('/api/v1', review);
app.use('/api/v1', order);
app.use('/api/v1', blog);
app.use('/api/v1', payment);
app.use('/api/v1', blogcategory);
app.use('/api/v1', website);

app.use(errorMiddleware);

module.exports = app;