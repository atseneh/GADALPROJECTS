const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/OTP', async (req, res) => {
  try {
    const { token, from, sender, to, pre, post, sb, sa, ttl, len, t } = req.query;
console.log(from)
    // Generate a random 4-digit integer for the callback
    const callback = Math.floor(1000 + Math.random() * 9000);
console.log(callback)
    const options = {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        from,
        sender,
        to,
        pr: pre,
        ps: post,
        sb: parseInt(sb), // Convert to integer if necessary
        sa: parseInt(sa), // Convert to integer if necessary
        ttl: parseInt(ttl), // Convert to integer if necessary
        len: parseInt(len), // Convert to integer if necessary
        t: parseInt(t), // Convert to integer if necessary
        callback // Use the generated callback
      }
    };

    const response = await axios.get('https://api.afromessage.com/api/challenge', options);
    
    // Handle the response
    res.status(200).json(response.data);
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
