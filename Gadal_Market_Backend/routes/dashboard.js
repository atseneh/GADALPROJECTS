const {DerivedProductStateEnums,ProductStateEnums,RecordStatusEnum,TransactionTypeEnums,ProductPostTypeEnums} = require('../Utils/enums')

const express = require('express');
const router = express.Router();
const User = require("../models/user.model");
const Product = require("../models/product.model")
const DashboardMetrics = require('../Utils/dashboardMetrics'); 

router.get('/dashboard-metrics', async (req, res) => {
  try {
    const lastWeekDate = new Date();
    lastWeekDate.setDate(lastWeekDate.getDate() - 7);
    
    const totalRegisteredUsersAggregate = await User.aggregate([
      {
        $group: {
          _id: null,
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalRegisteredUsers = totalRegisteredUsersAggregate.length > 0 ? totalRegisteredUsersAggregate[0].count : 0;
    
    const usersCreatedSinceLastWeekAggregate = await User.aggregate([
      {
        $match: { createdAt: { $gte: lastWeekDate } }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 }
        }
      }
    ]);
    const usersCreatedSinceLastWeek = usersCreatedSinceLastWeekAggregate.length > 0 ? usersCreatedSinceLastWeekAggregate[0].count : 0;
    
    const percentRegisteredSinceLastWeek = (usersCreatedSinceLastWeek / totalRegisteredUsers) * 100;
    
    const totalPostedProductsAggregate = await Product.aggregate([
      {
        $group: {
          _id: null,
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalPostedProducts = totalPostedProductsAggregate.length > 0 ? totalPostedProductsAggregate[0].count : 0;
    const totalSoldOutProductsAggregate = await Product.aggregate([
      {
        $match: { derivedState: DerivedProductStateEnums.SOLD }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalSoldOutProducts = totalSoldOutProductsAggregate.length > 0 ? totalSoldOutProductsAggregate[0].count : 0;
    const totalRentedProductsggregate = await Product.aggregate([
      {
        $match: { derivedState: DerivedProductStateEnums.RENTED }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalRentedProducts = totalRentedProductsggregate.length > 0 ? totalRentedProductsggregate[0].count : 0;
    const totalPremiumPostsAggregate = await Product.aggregate([
      {
        $match: { postType: "65c8d2fc3458b4f8df0d9fae" }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalPremiumPosts = totalPremiumPostsAggregate.length > 0 ? totalPremiumPostsAggregate[0].count : 0;
    const totalGoldPostsAggregate = await Product.aggregate([
      {
        $match: { postType: "65c8d2fc3458b4f8df0d9fae" }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalGoldPosts = totalGoldPostsAggregate.length > 0 ? totalGoldPostsAggregate[0].count : 0;
    const totalFreePostsAggregate = await Product.aggregate([
      {
        $match: { postType: "65c8d2fc3458b4f8df0d9fae" }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalFreePosts = totalFreePostsAggregate.length > 0 ? totalFreePostsAggregate[0].count : 0;
    const activeUsersDesktop = await User.countDocuments({ deviceType: 'desktop' });  
    const response = new DashboardMetrics(
      totalRegisteredUsers,
      percentRegisteredSinceLastWeek.toFixed(1),
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
