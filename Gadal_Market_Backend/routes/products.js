const express = require('express');
const router = express.Router();
const Product = require("../models/product.model");
const multer = require('multer');
const sharp = require('sharp')
const path = require('path');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); 
  },
});

const upload = multer({dest:'/images'})
router.post('/products', upload.array('images', 10), async (req, res) => {
  try {
   
    // Extract all fields from req.body
    const watermarkPath = path.join(__dirname,'..','images', 'watermark.svg');
    // '/images/watermark.svg'
    const {
      title,
      description,
      productType,
      previousPrice,
      currentPrice,
      category,
      postType,
      isFixed,
      consignee,
      currency,
      brand,
      model,
      location,
      subCity,
      wereda,
      transactionType,
      youtubeLink,
    } = req.body;

    let uploadedImages = [];
    let productAttributes = []
    if (req.files) {
     
      // webpBuffers = req.files.map(async (file) =>{
      //   await sharp(file.path).webp().toBuffer();
      // });
     // uploadedImages = req.files.map(file=> `images/${file.filename}-${Date.now()}.webp`)
      for (const file of req.files) {
        // Use Sharp to convert the uploaded image to WebP format
        const webpBuffer = await sharp(file.path).webp().toBuffer();
        // Save the converted image to disk
        const imagePath = `images/${file.filename}-${Date.now()}.webp`;
        try {
          await sharp(webpBuffer)
              .composite([{
                  input: watermarkPath,
                  gravity: 'southeast',
                  blend: 'over',
              }])
              .toFile(imagePath);
              uploadedImages.push(imagePath)
      } catch (err) {
          console.error("Error processing image:", err);
          uploadedImages = req.files.map(file=> `images/${file.filename}-${Date.now()}.webp`)
      }      
    }

    } 
    if(req.body.attributes){
      productAttributes = JSON.parse(req.body.attributes)
    }
    console.log(uploadedImages)
    const newProduct = new Product({
      title,
      description,
      productType:parseInt(productType),
      previousPrice:Number(previousPrice),
      currentPrice:Number(currentPrice),
      category,
      postType:parseInt(postType),
      productImages: uploadedImages, 
      attributes:productAttributes,
      isFixed:isFixed==='true'?true:false,
      consignee,
      currency,
      brand,
      model,
      location,
      subCity,
      wereda ,
      transactionType:parseInt(transactionType),
      youtubeLink,
      viewCount:0
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);

    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/products', async (req, res) => {
  try {
    const filters = req.query;
    const filterQuery = {};
    
    const numericProperties = ['productType', 'state', 'postType', 'derivedState', 'viewCount'];
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

    // Count the total number of documents matching the filter criteria
    const totalProductsQuery = filterQuery && Object.keys(filterQuery).length > 0
      ? Product.countDocuments(filterQuery)
      : Product.countDocuments();

    const totalProducts = await totalProductsQuery;

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
        sortCriteria = 'createdDate';
        sortQuery = { [sortCriteria]: -1 };
        break;
      default:
        sortCriteria = 'createdDate'; 
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
    const metadata = {
      totalProducts,
      pageNumber: page,
      pageSize: pageSize,
    };
    res.json({ products, metadata });
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
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/searchProducts',async (req,res)=>{
  const {searchTerm} = req.query
  try {
  const products = await Product.find(
    {
    $text: {$search: searchTerm},
  },
  { score : { $meta: "textScore"}}
  ).sort( 
    {  score: { $meta : 'textScore' } }
).populate('category consignee currency brand model location subCity wereda switch')
  res.status(200).json(products)
  }
   catch (error) {
    res.status(500).json({error})
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

router.put('/products/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, {
      new: true,
    });
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
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
router.get('/productsOnTopOfHome', async (req, res) => {
  try {
      let query = {
          no_day_onTop_home: { $gt: 0 } // Filtering products with no_day_onTop_home greater than zero
      };

      let sort = {
          no_day_onTop_home: -1, // Sorting by no_day_onTop_home in descending order
          date: -1 // Sorting by date in descending order (latest first) if no_day_onTop_home values are equal
      };

      const products = await Product.find(query).sort(sort);

      res.json(products);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
  }
});
module.exports = router;
