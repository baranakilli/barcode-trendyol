const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const fetch = require("node-fetch");
const cors = require("cors");

const corsHandler = cors({ origin: true });

// İlk API call (fetchOrders)
exports.fetchOrders = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const supplierId = req.query.supplierId; // URL'den supplierId alıyoruz
      const apiKey = req.query.apiKey; // URL'den apiKey alıyoruz

      const response = await fetch(
        `https://api.trendyol.com/sapigw/suppliers/${supplierId}/orders?status=Created&orderByField=PackageLastModifiedDate&orderByDirection=DESC&size=50`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${apiKey}`,
            "User-Agent": `${supplierId} - SelfIntegration`,
            "Content-Type": "application/json",
          },
          redirect: "follow",
        }
      );

      const data = await response.json();
      res.status(200).send(data.content); // Yanıtı döndürüyoruz
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).send("Failed to fetch orders.");
    }
  });
});

// İkinci API call (fetchStoreProducts)
exports.fetchStoreProducts = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const supplierId = req.query.supplierId; // URL'den supplierId alıyoruz
      const apiKey = req.query.apiKey; // URL'den apiKey alıyoruz

      const response = await fetch(
        `https://api.trendyol.com/sapigw/suppliers/${supplierId}/products?approved=true&size=99999`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${apiKey}`,
            "User-Agent": `${supplierId} - SelfIntegration`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      res.status(200).send(data.content); // Yanıtı döndürüyoruz
    } catch (error) {
      console.error("Error fetching store products:", error);
      res.status(500).send("Failed to fetch store products.");
    }
  });
});