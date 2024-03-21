const {DerivedProductStateEnums,ProductStateEnums,RecordStatusEnum,TransactionTypeEnums,ProductPostTypeEnums} = require('../Utils/enums')

const express = require('express');
const router = express.Router();
const User = require("../models/user.model");
const Product = require("../models/product.model")
const DashboardMetrics = require('../Utils/dashboardMetrics'); 

router.get('/dashboard-metrics', async (req, res) => {
  try {
    const totalRegisteredUsers = await User.countDocuments();
    const totalPostedProducts = await Product.countDocuments();
    const totalSoldOutProducts = await Product.countDocuments({ derivedState: DerivedProductStateEnums.SOLD }); 
    const totalRentedProducts = await Product.countDocuments({ derivedState: DerivedProductStateEnums.RENTED }); 
    const activeUsersDesktop = await User.countDocuments({ deviceType: 'desktop' }); 
    // const websiteVisitorsPerWeek = await getWebsiteVisitorsPerWeek(); 
    // const newUsersSinceLastWeek = await getNewUsersSinceLastWeek(); 
    const totalPremiumPosts = await Product.countDocuments({ postType: ProductPostTypeEnums.PREMIUM }); 
    const totalGoldPosts = await Product.countDocuments({ postType: ProductPostTypeEnums.GOLD });
    // const generalVisitorGraphsVsEngagement = await getGeneralVisitorGraphsVsEngagement(); 
    const totalFreePosts = await Product.countDocuments({ postType: ProductPostTypeEnums.FREE }); 
    const response = new DashboardMetrics(
      totalRegisteredUsers,
      totalPostedProducts,
      totalSoldOutProducts,
      totalRentedProducts,
      activeUsersDesktop,
      1000, // websiteVisitorsPerWeek,
      90000,// newUsersSinceLastWeek,
      totalPremiumPosts,
      totalGoldPosts,
      8900,// generalVisitorGraphsVsEngagement,
      totalFreePosts
    );

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
