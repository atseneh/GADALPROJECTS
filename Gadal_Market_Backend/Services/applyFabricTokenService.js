const config = require("../config/config");
const axios = require("axios");

function applyFabricToken() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(config.baseUrl + "/payment/v1/token", {
        appSecret: config.appSecret
      }, {
        headers: {
          "Content-Type": "application/json",
          "X-APP-Key": config.fabricAppId
        },
        httpsAgent: new (require('https').Agent)({
          rejectUnauthorized: false
        })
      });
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = applyFabricToken;
