const cron = require('node-cron');
const Product = require('../models/product.model');

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
