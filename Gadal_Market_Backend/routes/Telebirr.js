const express = require('express');
const router = express.Router();
const createOrder = require("../Services/createOrderService");

router.post("/create/order", async (req, res) => {
    try {
      const resultRaq = await createOrder.createOrder2(req, res);
      return res.send(resultRaq).status(200);
    } catch (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router;
