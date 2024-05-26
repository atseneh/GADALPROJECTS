const cron = require('node-cron');
const Product = require('../models/product.model');
const Notification = require('../models/notification.model')

cron.schedule('0 0 * * *', async () => {
  try {
  
    await Product.updateMany(
      {
        $or: [
          { no_day_onTop_cat: { $gt: 0 } },
          { no_day_onTop_home: { $gt: 0 } },
          { no_day_on_Gadal: { $gt: 0 } }
        ]
      },
      {
        $inc: {
          no_day_onTop_cat: -1,
          no_day_onTop_home: -1,
          no_day_on_Gadal: -1
        }
      }
    );
    console.log('Product fields updated successfully at midnight.');
  } catch (error) {
    console.error('Error occurred while updating product fields:', error);
  }
});
cron.schedule('0 0 * * *', async () => {
  try {
    // Update notifications where seen is true and gr 15 days
    await Notification.updateMany(
      { seen: true, createdAt: { $lte: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) } },
      { $set: { expired: true } }
    );

    // Update notifications where isCampaign is true and gr 15 days
    await Notification.updateMany(
      { isCampaign: true, createdAt: { $lte: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) } },
      { $set: { expired: true } }
    );

    console.log('Notifications updated successfully at midnight.');
  } catch (error) {
    console.error('Notification update failed:', error);
  }
});
