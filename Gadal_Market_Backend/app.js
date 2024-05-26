const express = require('express')
const bodyParser = require('body-parser');
const scheduler = require('./Utils/scheduler');
const mongoose = require('mongoose')
const routes = require('./routes')
const socketController = require("./controllers/socketController");
const cors = require('cors')
const testRoute = require('./routes/test')
require("dotenv").config();
const app = express();
app.use(cors({
    origin:'*',
}))
app.use(express.json())
app.use('/api',routes)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Routes
const productRoutes = require('./routes/products'); 
const userRouter = require('./routes/users');
const companyInfoRouter = require('./routes/companyInfo');
const gadalServiceListRouter = require('./routes/gadalServiceList');
const locationRouter = require('./routes/location');
const subCityRouter = require('./routes/subCity');
const weredaRouter = require('./routes/wereda');
const reviewRouter = require('./routes/review');
const productModelRouter = require('./routes/productModel');
const productBrandRouter = require('./routes/productBrand');
const categoryRouter = require('./routes/category');
const categoryAttributeRouter = require('./routes/categoryAttribute');
const estimationRouter = require('./routes/estimation');
const engagmentPriceRouter = require('./routes/engagmentPrice');
const assetRouter = require('./routes/asset');
const orderRouter = require('./routes/order');
const CurrencyRouter = require('./routes/currency');
const PriceRangeRouter = require('./routes/priceRange');
const FilterCriteriaRouter = require('./routes/filtercriteria');
const SearchRouter = require('./routes/search');
const dasboardRouter = require('./routes/dashboard');
const messageRouter = require('./routes/messages');
const packageRouter = require('./routes/package');
const packageDefinitionRouter = require('./routes/packageDefinition');
const otpRouter = require('./routes/otp');
const postTypeDefintionRouter = require('./routes/postTypeDefinition');
const authRouter = require('./routes/auth')
const notificationRouter = require('./routes/notification')
const teleBirrRouter = require('./routes/Telebirr')
const chapaRouter = require('./routes/Chapa')
mongoose.connect(
    process.env.DATABASE_URL,
    {useNewUrlParser:true,dbName:'Gadal_Market2'},
    console.log('conneted to db')
)
// serve images 
app.use('/files',express.static('files'))
app.use('/api',testRoute)
app.use('/api', productRoutes);
app.use('/api', userRouter);
app.use('/api', companyInfoRouter);
app.use('/api', gadalServiceListRouter);
app.use('/api', locationRouter);
app.use('/api', subCityRouter);
app.use('/api', weredaRouter);
app.use('/api', reviewRouter);
app.use('/api', productModelRouter);
app.use('/api', productBrandRouter);
app.use('/api', categoryRouter);
app.use('/api', categoryAttributeRouter);
app.use('/api', estimationRouter);
app.use('/api', engagmentPriceRouter);
app.use('/api', assetRouter);
app.use('/api', orderRouter);
app.use('/api', CurrencyRouter);
app.use('/api', PriceRangeRouter);
app.use('/api', FilterCriteriaRouter);
app.use('/api', SearchRouter);
app.use('/api', dasboardRouter);
app.use('/api', messageRouter);
app.use('/api', packageRouter);
app.use('/api', packageDefinitionRouter);
app.use('/api', otpRouter);
app.use('/api', postTypeDefintionRouter);
app.use('/api',authRouter)
app.use('/api',notificationRouter)
app.use('/api',teleBirrRouter)
app.use('/api',chapaRouter)
var server = app.listen(process.env.PORT,async()=>{
    console.log(`Server started on port ${process.env.PORT}`)
})
const io = socketController.initSocket(server);
module.exports = io;