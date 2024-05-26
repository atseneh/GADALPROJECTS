const axios = require("axios");
const applyFabricToken = require("./applyFabricTokenService");
const tools = require("../Utils/tools");
const config = require("../config/config");
const querystring = require('querystring');
const { raw } = require("express");
exports.createOrder = async (req, res) => {
  try {
    let { title, amount } = req.body;
    let applyFabricTokenResult = await applyFabricToken();
    let fabricToken = applyFabricTokenResult.token;
    let createOrderResult = await exports.requestCreateOrder(fabricToken, title, amount);
    let prepayId = createOrderResult.biz_content.prepay_id;
    let rawRequest1 = createRawRequest(prepayId);
    console.log(rawRequest1)
    //let resultUrl = config.baseUrl + rawRequest1 + "&version=1.0&trade_type=Checkout";
    //console.log(resultUrl)
    //res.send(config.baseUrl + "/payment/v1/app/checkout" + rawRequest + "&version=1.0&trade_type=Checkout");
    // console.log(res)
    let rawRequestString = rawRequest1.toString() +"&version=1.0&trade_type=Checkout";
    let rawRequest = querystring.parse(rawRequestString);


    res.send(rawRequest)
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.createOrder2 = async (req, res) => {
  try {
    const { title, amount } = req.body;
    
    // Apply fabric token
    const { token: fabricToken } = await applyFabricToken();

    // Create order with the fabric token
    const createOrderResult = await exports.requestCreateOrder(fabricToken, title, amount);
    const { prepay_id: prepayId, ...bizContent } = createOrderResult.biz_content;

    // Create raw request and parse it into an object
    const rawRequest1 = createRawRequest(prepayId);
    const rawRequestString = `${rawRequest1}&version=1.0&trade_type=Checkout`;
    const rawRequest = querystring.parse(rawRequestString);
    console.log('checkout ',rawRequest1)
    // Update biz_content with additional information
    const updatedBizContent = {
      ...bizContent,
      appid: config.merchantAppId,
      merch_code: config.merchantCode,
      prepay_id:prepayId,
      trade_type: "WebCheckout",
      payer_identifier_type: "01",
      payer_type: "1000",
      pwa_token: fabricToken,
      raw_request: rawRequest1.toString(),
      funds_source: "Wallet",
    };

    // Prepare the assembledRequest object
    const assembledRequest = {
      timestamp: rawRequest.timestamp,
      nonce_str: rawRequest.nonce_str,
      method: "payment.checkout",
      sign_type: rawRequest.sign_type,
      sign: rawRequest.sign,
      lang: "en",
      version: rawRequest.version,
      app_code: config.merchantAppId,
      biz_content: updatedBizContent,
    };

    // Sign the assembled request
    const signedRequest = {
      ...assembledRequest,
      sign: tools.signRequestObject(assembledRequest),
    };

    console.log("Assembled request:", JSON.stringify(signedRequest, null, 2));

    // Send the signed request to the /payment/v1/app/checkout endpoint
    const response = await axios.post(`${config.baseUrl}/payment/v1/app/checkout`, signedRequest, {
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": config.fabricAppId,
        "Authorization": fabricToken,
      },
      httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
    });

    // Send the response from the /payment/v1/app/checkout endpoint back to the client
    res.json(response.data);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.requestCreateOrder = async (fabricToken, title, amount) => {
  console.log("fabricToken=", fabricToken);
  console.log("title=", title);
  console.log("amount=", amount);
  
  return new Promise((resolve, reject) => {
    let reqObject = createRequestObject(title, amount);
    axios.post(config.baseUrl + "/payment/v1/merchant/preOrder", reqObject, {
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": config.fabricAppId,
        "Authorization": fabricToken
      },
      httpsAgent: new (require('https').Agent)({
        rejectUnauthorized: false
      })
    })
    .then(response => {
      resolve(response.data);
    })
    .catch(error => {
      console.error("Error in requestCreateOrder:", error);
      reject(error);
    });
  });
};

function createRequestObject(title, amount) {
  let req = {
    timestamp: tools.createTimeStamp(),
    nonce_str: tools.createNonceStr(),
    method: "payment.preorder",
    version: "1.0",
  };

  let biz = {
    notify_url: "https://www.google.com",
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    merch_order_id: createMerchantOrderId(),
    trade_type: "Checkout",
    title: title,
    total_amount: amount,
    trans_currency: "ETB",
    timeout_express: "120m",
    business_type: "BuyGoods",
    redirect_url: "https://gadalmarket.com",
    callback_info: "From web",
  };

  console.log("biz=", JSON.stringify(biz, null, 2));

  req.biz_content = biz;
  try {
    req.sign = tools.signRequestObject(req);

  } catch (e) {
    console.error("Error signing request object:", e);
    throw e; // Re-throw the error after logging it
  }

  console.log("Signed req=", JSON.stringify(req, null, 2));
  
  req.sign_type = "SHA256WithRSA";
  console.log("Final req=", JSON.stringify(req, null, 2));

  return req;
}


function createMerchantOrderId() {
  return new Date().getTime() + "";
}

function createRawRequest(prepayId) {
  let map = {
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    nonce_str: tools.createNonceStr(),
    prepay_id: prepayId,
    timestamp: tools.createTimeStamp(),
  };
  let sign = tools.signRequestObject(map);
  let rawRequest = [
    "appid=" + map.appid,
    "merch_code=" + map.merch_code,
    "nonce_str=" + map.nonce_str,
    "prepay_id=" + map.prepay_id,
    "timestamp=" + map.timestamp,
    "sign=" + sign,
    "sign_type=SHA256WithRSA",
  ].join("&");
  return rawRequest;
}
