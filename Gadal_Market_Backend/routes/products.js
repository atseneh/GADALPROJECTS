const express = require('express');
const router = express.Router();
const Product = require("../models/product.model");
const Package = require('../models/package.model');
const PostTypeDefinition = require('../models/postTypeDefnition.model');
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

const checkPackage = async (req, res, next) => {
  try {
      //if validation add here
    next();
  } catch (error) {
    // If any error occurs, return an error response
    res.status(500).json({ error: 'Internal server error' });
  }
};
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
        top:(await image.metadata()).height/2,
        left:(await image.metadata()).width/2,
        // blend:'atop'
      }
    ]); // Position watermark
  }
  return image.toFile(outputPath);
};
const upload = multer({dest:'/images'})
router.post('/products', checkPackage, upload.array('images', 10), async (req, res) => {
  try {
    const watermarkPath = path.join(__dirname,'..','images', 'watermark.svg');
    // '/images/watermark.svg'
    const { title, description, productType, previousPrice, currentPrice, category, postType, isFixed, consignee, currency, brand, model, location, subCity, wereda, transactionType, youtubeLink,isPayed } = req.body;
    let uploadedImages = [];
    let productAttributes = []
    const postTypeDefinition = await PostTypeDefinition.findById("65c8d2fc3458b4f8df0d9fae");
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
      console.log('running')
     const images = req.files
      // for (const file of req.files) {
      //   const webpBuffer = await sharp(file.path).webp().toBuffer();
      //   // Save the converted image to disk
      //   const imagePath = `images/${file.filename}-${Date.now()}.webp`;
      //   try {
      //     await sharp(webpBuffer)
      //     .composite([{
      //        input: watermarkPath, 
      //        gravity: 'southeast', 
      //        blend: 'over',
      //       }])
      //     .toFile(imagePath);
      //   } catch (error) {
          
      //   }
      //   uploadedImages.push(imagePath);
      // }
      const processPromises = images.map((file, index) => {
        const inputPath = file.path;
        const outputPath = path.join(__dirname,'..', 'images/', `${file.filename}-${Date.now()}.webp`); // Change extension to .webp
        uploadedImages.push(`images/${file.filename}-${Date.now()}.webp`)
        
          // Apply watermark and convert to WEBP for images other than the first
          return applyWatermarkAndConvert(inputPath, outputPath, watermarkPath, index!==0);
      });
      await Promise.all(processPromises);
    } else {
      const defaultImage = "images/1eedaa36ff2986a8031be9544a8af4e6-1711896958928.webp";
      uploadedImages.push(defaultImage);
    }
    console.log(req.body.attributes)
    // productAttributes = req.body.attributes ? JSON.parse(req.body.attributes) : [];
    console.log(productAttributes)
    const newProduct = new Product({ 
      title, 
      description, 
      productType: parseInt(productType), 
      previousPrice: Number(previousPrice), 
      currentPrice: Number(currentPrice), 
      category, 
      postType: "65c8d2fc3458b4f8df0d9fae", 
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
      viewCount: 0 ,
      no_day_onTop_cat,
      no_day_onTop_home,
      no_day_on_Gadal,
      isPayed:req.body.isPayed
    });

    const savedProduct = await newProduct.save();
      // Update remaining posts count in the package
    if (!savedProduct.isPayed) {
      return res.status(200).json({ productId: savedProduct._id });
    }
    else {
      console.log("has package")
        const postTypeDefinition = await PostTypeDefinition.findById("65c8d2fc3458b4f8df0d9fae");
        if (!postTypeDefinition) {
          return res.status(400).json({ error: 'Invalid post type id' });
        }
        // Update remaining posts count in the package
        await Package.updateOne(
          { user: consignee },
          { $inc: { [remainingPostsField]: -1 } }
        );
        // Return success message
        console.log("savedandpayed")
        return res.status(201).json({ message: "savedandpayed" });
    }    
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
    
    // // Exclude products where no_day_on_Gadal is 0
    //  filterQuery.no_day_on_Gadal = { $gt: 0 };
    //   // Add condition to filter where no_day_on_Gadal, no_day_onTop_cat, or no_day_onTop_home is not greater than 0
    // filterQuery.$or = [
    //   { no_day_on_Gadal: { $gt: 0 } },
    //   { no_day_onTop_cat: { $gt: 0 } },
    //   { no_day_onTop_home: { $gt: 0 } }
    // ];
    
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
  console.log(productId)

  try {
    console.log(req.body)
    const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, {
      new: true,
    });
    console.log(updatedProduct)
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

router.get('/productsOnHomePage', async (req, res) => {
  try {
    const products = await Product.find({ no_day_onTop_home: { $gt: 0 } })
      .sort({ no_day_onTop_home: -1, date: -1 }); 

    const count = await Product.countDocuments({ no_day_onTop_home: { $gt: 0 } });

    res.json({ products, count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
