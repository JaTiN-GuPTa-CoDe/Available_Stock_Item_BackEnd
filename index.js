const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { dbConnect } = require('./config/db');
require('dotenv').config();
const adminRoutes = require('./routes/AdminRoutes');
const shopOwnerRoutes = require('./routes/ShopOwnerRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/', express.static('./uploads'));

app.use('/admin', adminRoutes);
app.use('/shopowner', shopOwnerRoutes);

dbConnect();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});         