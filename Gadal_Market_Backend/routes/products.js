const express = require('express');
const router = express.Router();
const Product = require("../models/product.model");
const Review = require('../models/review.model');
const Package = require('../models/package.model');
const PostTypeDefinition = require('../models/postTypeDefnition.model');
const Notification = require('../models/notification.model')
const multer = require('multer');
const sharp = require('sharp')
const path = require('path');
const User = require("../models/user.model");
const socketController = require('../controllers/socketController')
const mongoose = require('mongoose')
const upload = multer({dest:'/images'})
const request = require('request')
// Middleware for initializing transaction
async function initializeTransaction(req, res, next) {
  console.log("body at middleware")
  console.log(req.body)
  let { paymentAmount,consignee } = req.body;

  if (paymentAmount == "0") {
    req.isPayed = false; 
    req.txRef = null;
    next(); 
    return; 
  }
  const currentuser = await User.findById(new mongoose.Types.ObjectId(consignee));
  if (!currentuser) {
    return res.status(404).json({ message: 'User not found' });
  }
  // Extract required user details
  const { email, firstName, lastName, phoneNumber } = currentuser;
  // Generate unique tx_ref
  const txRef = `gadaltechuniquekey-${Date.now()}-6669`;
  req.txRef = txRef; // Attach txRef to the request object

  // Convert amount to string
  paymentAmount = paymentAmount.toString();

  const callbackUrl = `${process.env.CALLBACK_BASE_URL}/transaction/verify/${txRef}`;
  console.log(`Callback URL: ${callbackUrl}`);

  const options = {
    method: 'POST',
    url: `${process.env.CHAPA_API_URL}/transaction/initialize`,
    headers: {
      'Authorization': `Bearer ${process.env.CHAPA_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "amount": paymentAmount,
      "currency": "ETB",
      // "email": email,
      "first_name": firstName,
      "last_name": lastName,
      "phone_number": phoneNumber,
      "tx_ref": txRef,
      // "callback_url": callbackUrl,
      "return_url": `${process.env.CALLBACK_BASE_URL}/verifyPayment/paymentSuccessfull/${txRef}?serviceType=product`,
      "customization[title]": "Payment for my favourite merchant",
      "customization[description]": "I love online payments"
    })
  };

  console.log('Request options:', options);

  request(options, function (error, response, body) {
    if (error) {
      console.error('Request error:', error);
      return res.status(500).send({ error: error.message });
    }

    console.log('Response:', body);

    try {
      const jsonResponse = JSON.parse(body);
      if (jsonResponse.status === "success" && jsonResponse.data && jsonResponse.data.checkout_url) {
        // Attach the transaction details to the request object
        req.transaction = jsonResponse.data;
        next();
      } else {
        res.status(400).send({ error: 'Failed to initialize transaction', details: jsonResponse });
      }
    } catch (parseError) {
      console.error('Parse error:', parseError);
      res.status(500).send({ error: 'Failed to parse response from Chapa', details: parseError.message });
    }
  });
}
const applyWatermarkAndConvert = async (inputPath, outputPath, watermarkPath, applyWatermark) => {
  let image = sharp(inputPath).webp();  // Convert all images to WEBP format
  if (applyWatermark) {
    const watermark = await sharp(watermarkPath)
                            .ensureAlpha()
                            .modulate({
                              brightness:1,
                              saturation:1,
                              lightness:1,
                              alpha:0.5
                            })
                            .resize(150).png().toBuffer(); // Resize watermark as needed
    image = image.composite([
      { 
        input: watermark,
        top:Math.floor((await image.metadata()).height/2),
        left:Math.floor((await image.metadata()).width/2,),
        // blend:'atop'
      }
    ]); // Position watermark
  }
  return image.toFile(outputPath);
};
router.post('/products', upload.array('images', 10), (req, res, next) => {
  if (req.body.paymentAmount && req.body.paymentAmount != "0") {
    initializeTransaction(req, res, next);
  } else {
    next();
  }
}, async (req, res) => {
  console.log("body at main route");
  console.log(req.body);
  try {
    const watermarkPath = path.join(__dirname, '..', 'images', 'watermark.svg');
    const { title, description, productType, previousPrice, currentPrice, category, postType, isFixed, consignee, currency, brand, model, location, subCity, wereda, transactionType, youtubeLink, paymentAmount } = req.body;
    let uploadedImages = [];
    let productAttributes = [];

    const postTypeDefinition = await PostTypeDefinition.findById(postType);
    const { name, no_day_onTop_cat, no_day_onTop_home, no_day_on_Gadal } = postTypeDefinition;

    let remainingPostsField;
    switch (name) {
      case "Basic":
        remainingPostsField = 'remainingBasicPosts';
        break;
      case "Gold":
        remainingPostsField = 'remainingGoldPosts';
        break;
      case "Premium":
        remainingPostsField = 'remainingPremiumPosts';
        break;
      default:
        return res.status(400).json({ error: 'Invalid product post type' });
    }

    const activePackage = await Package.findOne({
      user: consignee,
      [remainingPostsField]: { $gt: 0 },
      recordStatus: 1
    });

    if (!activePackage) {
      req.body.isPayed = false;
    }

    req.body.no_day_onTop_cat = no_day_onTop_cat;
    req.body.no_day_onTop_home = no_day_onTop_home;
    req.body.no_day_on_Gadal = no_day_on_Gadal;

    if (req.files) {
      const images = req.files;
      const processPromises = images.map((file, index) => {
        const inputPath = file.path;
        const outputPath = path.join(__dirname, '..', 'files', 'images', `${file.filename}-${Date.now()}.webp`);
        uploadedImages.push(`images/${file.filename}-${Date.now()}.webp`);
        return applyWatermarkAndConvert(inputPath, outputPath, watermarkPath, false);
      });
      await Promise.all(processPromises);
    } else {
      return res.status(400).json({ message: 'Images are required' });
    }

    productAttributes = req.body.attributes ? JSON.parse(req.body.attributes) : [];
    const newProduct = new Product({
      title,
      description,
      productType: parseInt(productType),
      previousPrice: Number(previousPrice),
      currentPrice: Number(currentPrice),
      category,
      postType,
      productImages: uploadedImages,
      attributes: productAttributes,
      isFixed: isFixed === 'true',
      consignee,
      currency,
      brand,
      model,
      location,
      subCity,
      wereda,
      transactionType: parseInt(transactionType),
      youtubeLink,
      viewCount: 0,
      no_day_onTop_cat,
      no_day_onTop_home,
      no_day_on_Gadal,
      isPayed: req.body.isPayed
    });

    newProduct.isPayed = false;
    newProduct.transactionReference = req.txRef;
console.log("newproduct")
console.log(newProduct)
    const savedProduct = await newProduct.save();

    if (req.txRef) {
      return res.status(201).json({ savedProduct, transaction: req.transaction, txRef: req.txRef });
    }

    const postTypeDefinitions = await PostTypeDefinition.findById(postType);
    if (!postTypeDefinitions) {
      return res.status(400).json({ error: 'Invalid post type id' });
    }

    await Package.updateOne(
      { user: consignee },
      { $inc: { [remainingPostsField]: -1 } }
    );

    return res.status(201).json({ savedProduct, message: "savedandpayed" });
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
});


router.get('/products', async (req, res) => {
  try {
    const filters = req.query;
    const filterQuery = {};
    const numericProperties = ['productType', 'state', 'postType', 'derivedState', 'viewCount','recordStatus'];
    numericProperties.forEach((property) => {
      if (filters[property]) {
        filterQuery[property] = parseInt(filters[property]);
      }
    });

    if (filters.isFixed) {
      filterQuery.isFixed = filters.isFixed === 'true'; 
    }

    const objectIDProperties = ['category', 'consignee', 'currency', 'brand', 'model', 'location', 'subCity', 'wereda', 'switch'];
  
    objectIDProperties.forEach((property) => {
      if (filters[property]) {
        filterQuery[property] = filters[property];
      }
    });

    if (filters.transactionType) {
      filterQuery.transactionType = parseInt(filters.transactionType);
    }

    if (filters.minPrice || filters.maxPrice) {
      filterQuery.currentPrice = {};

      if (filters.minPrice) {
        filterQuery.currentPrice.$gte = parseFloat(filters.minPrice);
      }

      if (filters.maxPrice) {
        filterQuery.currentPrice.$lte = parseFloat(filters.maxPrice);
      }
    }

    if (filters.attributes) {
      const attributes = Array.isArray(filters.attributes) ? filters.attributes : [filters.attributes];
      const attributeValues = Array.isArray(filters.attributeValues) ? filters.attributeValues : [filters.attributeValues];
    
      if (attributes.length === attributeValues.length) {
        const attributeFilters = attributes.map((attribute, index) => ({
          'attributes.name': attribute,
          'attributes.value': attributeValues[index]
        }));
    
        if (attributeFilters.length > 0) {
          filterQuery.$and = attributeFilters;
        }
      }
    }
    
    // // Exclude products where no_day_on_Gadal is 0
    //  filterQuery.no_day_on_Gadal = { $gt: 0 };
    //   // Add condition to filter where no_day_on_Gadal, no_day_onTop_cat, or no_day_onTop_home is not greater than 0
    // filterQuery.$or = [
    //   { no_day_on_Gadal: { $gt: 0 } },
    //   { no_day_onTop_cat: { $gt: 0 } },
    //   { no_day_onTop_home: { $gt: 0 } }
    // ];
    
    // Count the total number of documents matching the filter criteria
    // const totalProductsQuery = filterQuery && Object.keys(filterQuery).length > 0
    // ? Product.aggregate([
    //     { $match: filterQuery },
    //     // { $sort: { no_day_onTop_cat: -1,date:-1} },
    //     { $group: { _id: null, count: { $sum: 1 } } }
    //   ])
    // : Product.aggregate([
    //   // { $sort: { no_day_onTop_cat: -1,date:-1} },
    //     { $group: { _id: null, count: { $sum: 1 } } },
    //   ]);
    //   const result = await totalProductsQuery;
    //   const totalProducts = result.length > 0 ? result[0].count : 0;

    // Pagination
    const page = parseInt(filters.pageNum) || 1; 
    const pageSize = parseInt(filters.pageSize) || 0;  
    const skip = (page - 1) * pageSize;

    // Sorting
    let sortCriteria;
    let sortQuery = {};

    switch (filters.sortCriteria) {
      case 'highPrice':
        sortCriteria = 'currentPrice';
        sortQuery = { [sortCriteria]: -1 };
        break;
      case 'lowPrice':
        sortCriteria = 'currentPrice';
        sortQuery = { [sortCriteria]: 1 };
        break;
      case 'latest':
        sortCriteria = 'date';
        sortQuery = { [sortCriteria]: -1 };
        break;
      default:
        sortCriteria = 'date'; 
        sortQuery = { [sortCriteria]: -1 };
        break;
    }

    const productsQuery = filterQuery && Object.keys(filterQuery).length > 0
      ? Product.find(filterQuery).populate('category consignee currency brand model location subCity wereda switch')
      : Product.find().populate('category consignee currency brand model location subCity wereda switch');

    //// If isForHomePage is true, check no_day_onTop_home count
    // if (filters.isForHomePage && filters.isForHomePage === 'true') {
    //   filterQuery.no_day_onTop_home = { $gt: 0 }; // Filter where no_day_onTop_home is greater than 0
    // }
    // //If sorting by count is requested, add it as a secondary sorting criterion
    // if (filters.isForHomePage && filters.isForHomePage === 'true') {
    //   // Add count as a secondary sorting criterion
    //   const countSortCriteria = { no_day_onTop_home: -1 }; // Sort in descending order
    //   sortQuery = { ...countSortCriteria, ...sortQuery };
    // }
    const products = await productsQuery
      .sort(sortQuery)
      .skip(skip)
      .limit(pageSize);

      // Remove products with no_day_onTop_home count zero or undefined or null if isForHomePage is true
      // if (filters.isForHomePage && filters.isForHomePage === 'true') {
      //   products = products.filter(product => product.no_day_onTop_home && product.no_day_onTop_home > 0);
      // }
      const productIds = products.map(product => product._id);
      // const averageRatings = await Review.aggregate([
      //   { $match: { product: { $in: productIds } } },
      //   {
      //     $group: {
      //       _id: '$product',
      //       averageRating: { $avg: '$stars' }
      //     }
      //   }
      // ]);
      const averageRatings = await Review.aggregate([
        { $match: { product: { $in: productIds } } },
        {
          $group: {
            _id: '$product',
            averageRating: { $avg: '$stars' },
            totalReviews: { $sum: 1 },
          }
        },
        {
          $project: {
            averageRating: { $round: ['$averageRating'] },
            totalReviews:1,
          }
        }
      ]);
      const productsWithAverageRating = products.map(product => {
        const averageRatingObj = averageRatings.find(rating => rating._id.equals(product._id));
        const averageRating = averageRatingObj ? averageRatingObj.averageRating : 0;
        const totalReviews = averageRatingObj ? averageRatingObj.totalReviews : 0;
        return { ...product.toObject(), averageRating,totalReviews };
      });
    const totalProducts = products.length;
    const metadata = {
      totalProducts,
      pageNumber: page,
      pageSize: pageSize,
    };
    res.json({ products: productsWithAverageRating, metadata });
  } 
  catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/products/similarProducts/:productId',async (req,res)=>{
  const {productId} = req.params 
  try {

  const {category,brand,model,transactionType,productType} = await Product.findById(productId)
  
  const similarItems = await Product.find({category,brand,model,productType,transactionType,_id:{$ne:productId},recordStatus:1})
  res.status(200).json(similarItems)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
})
router.get('/products/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId).populate('category consignee currency brand model location subCity wereda switch');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const averageRatings = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId)}},
      {
        $group: {
          _id: '$product',
          averageRating: { $avg: '$stars' },
          totalReviews: { $sum: 1 },
        }
      },
      {
        $project: {
          averageRating: { $round: ['$averageRating'] },
          totalReviews:1,
        }
      }
    ]);
    // const productsWithAverageRating = products.map(product => {
    //   const averageRatingObj = averageRatings.find(rating => rating._id.equals(product._id));
    //   const averageRating = averageRatingObj ? averageRatingObj.averageRating : 0;
    //   const totalReviews = averageRatingObj ? averageRatingObj.totalReviews : 0;
    //   return { ...product.toObject(), averageRating,totalReviews };
    // });
    const averageRating = averageRatings ? averageRatings[0]?.averageRating : 0;
    const totalReviews = averageRatings ? averageRatings[0]?.totalReviews : 0;
    res.status(200).json({...product.toObject(),averageRating,totalReviews});
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    console.log(error)
  }
});
router.get('/searchProducts',async (req,res)=>{
  const {searchTerm} = req.query
  try {
  const products = await Product.find(
    {
    $text: {$search: searchTerm},
    recordStatus:1,
    state:1,
  },
  { score : { $meta: "textScore"}}
  ).sort( 
    {  score: { $meta : 'textScore' } }
).populate('category consignee currency brand model location subCity wereda switch')
  res.status(200).json(products)
  }
   catch (error) {
    res.status(500).json({error})
    console.log(error)
  }
})
router.get('/products/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const product = await Product.findById(userId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/products/:productId', upload.array('images', 10), async (req, res) => {
  const { productId } = req.params;
  const watermarkPath = path.join(__dirname,'..','images', 'watermark.svg');
  const {title, description, productType, previousPrice, currentPrice, category, isFixed, consignee, currency, brand, model, location, subCity, wereda, transactionType, youtubeLink,} = req.body;
  const product = await Product.findById(productId);
  if(!product) {
    return res.status(400).json({message:'Product not found'})
  }
  let uploadedImages = product?.productImages || [];
  if (req.files) {
    const images = req.files
    const processPromises = images.map((file, index) => {
      const inputPath = file.path;
      const outputPath = path.join(__dirname,'..','files', 'images/', `${file.filename}-${Date.now()}.webp`); // Change extension to .webp
      uploadedImages.push(`images/${file.filename}-${Date.now()}.webp`)
      
        // Apply watermark and convert to WEBP for images other than the first
        return applyWatermarkAndConvert(inputPath, outputPath, watermarkPath, false);
    });
    await Promise.all(processPromises);
  } else {
    return res.status(400).json({message:'Images are required'})
  }
  productAttributes = req.body.attributes ? JSON.parse(req.body.attributes) : [];
const updateData = {
  title, 
  description, 
  productType: parseInt(productType), 
  previousPrice: Number(previousPrice), 
  currentPrice: Number(currentPrice), 
  category, 
  productImages: uploadedImages, 
  attributes: productAttributes, 
  isFixed: isFixed === 'true' ? true : false, 
  consignee, 
  currency, 
  brand, 
  model, 
  location, 
  subCity, 
  wereda, 
  transactionType: parseInt(transactionType), 
  youtubeLink, 
  state:3,
}
  try {
    // console.log(req.body)
    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, {
      new: true,
    });
    // console.log(updatedProduct)
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.put('/products/activateProduct/:productId', async (req, res) => {
  const { productId } = req.params;
  const {consignee,category,date} = req.body
  const notificationMessage = `Congratulations The ${category} Item you posted on ${date} is activated`
  if(!consignee) { 
    return res.status(400).json({message:'Invalid product'})
  }
  try {
    const io = socketController.getIo()
    const updatedProduct = await Product.findByIdAndUpdate(productId, {state:1}, {
      new: true,
    });
    // console.log(updatedProduct)
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    // save notification to db
    const notification = await Notification.create({
      product:productId,
      user:consignee,
      notification:notificationMessage
    })
    // if notification is successfuly saved emit an event
    if(notification){
      io.emit('notification',{
        productId:productId,
        user:consignee,
        notification:notificationMessage,
        isCampaign:false
      })
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.delete('/products/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(204).json(); 
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/productsOnHomePage', async (req, res) => {
  const {serviceType,transactionType} = req.query
  try {
    const products = await Product.aggregate([
      { 
        $match: 
        { 
          no_day_onTop_home: { $gt: 0 },
          recordStatus:1,
          state:1, 
          productType:parseInt(serviceType),
          transactionType:parseInt(transactionType)
         }
      },
      { $sort: { no_day_onTop_home: -1, date: -1 } },
      {
        $group: {
          _id: null,
          products: { $push: '$$ROOT' },
          count: { $sum: 1 }
        }
      },
      { $project: { _id: 0, products: 1, count: 1 } }
    ]);

    // If no matching documents found, return empty array and count 0
    const result = products.length > 0 ? products[0] : { products: [], count: 0 };

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
router.get('/searchProductsAndFilter', async (req, res) => {
  const { searchTerm, ...filters } = req.query; 
  try {
    const filterQuery = {
      $text: { $search: searchTerm },
      recordStatus: 1,
      state: 1,
    };

    // Add numeric properties filters
    const numericProperties = ['productType', 'postType', 'derivedState', 'viewCount', 'recordStatus'];
    numericProperties.forEach((property) => {
      if (filters[property]) {
        filterQuery[property] = parseInt(filters[property]);
      }
    });

    // Handle isFixed filter
    if (filters.isFixed) {
      filterQuery.isFixed = filters.isFixed === 'true';
    }

    // Add objectID properties filters
    const objectIDProperties = ['category', 'consignee', 'currency', 'brand', 'model', 'location', 'subCity', 'wereda', 'switch'];
    objectIDProperties.forEach((property) => {
      if (filters[property]) {
        filterQuery[property] = filters[property];
      }
    });

    // Handle transactionType filter
    if (filters.transactionType) {
      filterQuery.transactionType = parseInt(filters.transactionType);
    }

    // Handle price range filter
    if (filters.minPrice || filters.maxPrice) {
      filterQuery.currentPrice = {};

      if (filters.minPrice) {
        filterQuery.currentPrice.$gte = parseFloat(filters.minPrice);
      }

      if (filters.maxPrice) {
        filterQuery.currentPrice.$lte = parseFloat(filters.maxPrice);
      }
    }

    // Handle attributes filter
    if (filters.attributes) {
      const attributes = Array.isArray(filters.attributes) ? filters.attributes : [filters.attributes];
      const attributeValues = Array.isArray(filters.attributeValues) ? filters.attributeValues : [filters.attributeValues];

      if (attributes.length === attributeValues.length) {
        const attributeFilters = attributes.map((attribute, index) => ({
          'attributes.name': attribute,
          'attributes.value': attributeValues[index]
        }));

        if (attributeFilters.length > 0) {
          filterQuery.$and = attributeFilters;
        }
      }
    }

    const products = await Product.find(filterQuery)
      .sort({ score: { $meta: 'textScore' } })
      .populate('category consignee currency brand model location subCity wereda switch');

    // Calculate price range for filtered products
    let minPrice = Infinity;
    let maxPrice = -Infinity;

    products.forEach((product) => {
      const currentPrice = parseFloat(product.currentPrice);
      
      if (!isNaN(currentPrice)) {
        if (currentPrice < minPrice) {
          minPrice = currentPrice;
        }

        if (currentPrice > maxPrice) {
          maxPrice = currentPrice;
        }
      }
    });

    let priceRanges = [];
    if (products.length > 5) {
      const priceRangeStep = (maxPrice - minPrice) / 5;
      for (let i = 0; i < 5; i++) {
        const rangeMin = minPrice + i * priceRangeStep;
        const rangeMax = minPrice + (i + 1) * priceRangeStep;
        priceRanges.push({
          min: rangeMin,
          max: rangeMax,
        });
      }
    } else {
      if (products.length === 1) {
        priceRanges.push({ min: 0, max: maxPrice });
      } else {
        const rangeStep = (maxPrice - minPrice) / products.length;
        for (let i = 0; i < products.length; i++) {
          const rangeMin = minPrice + i * rangeStep;
          const rangeMax = i === products.length - 1 ? maxPrice : minPrice + (i + 1) * rangeStep;
          priceRanges.push({
            min: rangeMin,
            max: rangeMax,
          });
        }
      }
    }
    
    // Generate attribute list
    const attributesList = [];
    products.forEach((product) => {
      product.attributes.forEach((attribute) => {
        const existingAttribute = attributesList.find((attr) => attr.name === attribute.name);

        if (existingAttribute) {
          if (!existingAttribute.values.includes(attribute.value)) {
            existingAttribute.values.push(attribute.value);
          }
        } else {
          attributesList.push({
            name: attribute.name,
            values: [attribute.value],
          });
        }
      });
    });
    res.status(200).json({ products, priceRanges, attributesList });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// router.get('/searchProductsAndFilter', async (req, res) => {
//   const { searchTerm, ...filters } = req.query; 
//   try {
//     const filterQuery = {
//       $text: { $search: searchTerm },
//       recordStatus: 1,
//       state: 1,
//     };

//     // Add numeric properties filters
//     const numericProperties = ['productType', 'postType', 'derivedState', 'viewCount', 'recordStatus'];
//     numericProperties.forEach((property) => {
//       if (filters[property]) {
//         filterQuery[property] = parseInt(filters[property]);
//       }
//     });

//     // Handle isFixed filter
//     if (filters.isFixed) {
//       filterQuery.isFixed = filters.isFixed === 'true';
//     }

//     // Add objectID properties filters
//     const objectIDProperties = ['category', 'consignee', 'currency', 'brand', 'model', 'location', 'subCity', 'wereda', 'switch'];
//     objectIDProperties.forEach((property) => {
//       if (filters[property]) {
//         filterQuery[property] = filters[property];
//       }
//     });

//     // Handle transactionType filter
//     if (filters.transactionType) {
//       filterQuery.transactionType = parseInt(filters.transactionType);
//     }

//     // Handle price range filter
//     if (filters.minPrice || filters.maxPrice) {
//       filterQuery.currentPrice = {};

//       if (filters.minPrice) {
//         filterQuery.currentPrice.$gte = parseFloat(filters.minPrice);
//       }

//       if (filters.maxPrice) {
//         filterQuery.currentPrice.$lte = parseFloat(filters.maxPrice);
//       }
//     }

//     // Handle attributes filter
//     if (filters.attributes) {
//       const attributes = Array.isArray(filters.attributes) ? filters.attributes : [filters.attributes];
//       const attributeValues = Array.isArray(filters.attributeValues) ? filters.attributeValues : [filters.attributeValues];

//       if (attributes.length === attributeValues.length) {
//         const attributeFilters = attributes.map((attribute, index) => ({
//           'attributes.name': attribute,
//           'attributes.value': attributeValues[index]
//         }));

//         if (attributeFilters.length > 0) {
//           filterQuery.$and = attributeFilters;
//         }
//       }
//     }

//     const products = await Product.find(filterQuery)
//       .sort({ score: { $meta: 'textScore' } })
//       .populate('category consignee currency brand model location subCity wereda switch');

//     // Calculate price range for filtered products
//     let minPrice = Infinity;
//     let maxPrice = -Infinity;

//     products.forEach((product) => {
//       const currentPrice = parseFloat(product.currentPrice);
      
//       if (!isNaN(currentPrice)) {
//         if (currentPrice < minPrice) {
//           minPrice = currentPrice;
//         }

//         if (currentPrice > maxPrice) {
//           maxPrice = currentPrice;
//         }
//       }
//     });

//     const priceRangeStep = (maxPrice - minPrice) / 5;
//     const priceRanges = [];

//     for (let i = 0; i < 5; i++) {
//       const rangeMin = minPrice + i * priceRangeStep;
//       const rangeMax = minPrice + (i + 1) * priceRangeStep;
//       priceRanges.push({
//         min: rangeMin,
//         max: rangeMax,
//       });
//     }
//     // Generate attribute list
//     const attributesList = [];
//     products.forEach((product) => {
//       product.attributes.forEach((attribute) => {
//         const existingAttribute = attributesList.find((attr) => attr.name === attribute.name);

//         if (existingAttribute) {
//           if (!existingAttribute.values.includes(attribute.value)) {
//             existingAttribute.values.push(attribute.value);
//           }
//         } else {
//           attributesList.push({
//             name: attribute.name,
//             values: [attribute.value],
//           });
//         }
//       });
//     });
//     res.status(200).json({ products, priceRanges, attributesList });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


module.exports = router;
