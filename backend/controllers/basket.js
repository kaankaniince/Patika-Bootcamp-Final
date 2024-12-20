const basketService = require('../services/basket');
const basketController = {
  create: async (req, res) => {
    const { userId, product } = req.body;
    if (!userId) {
      return res.status(400).send({ message: "userId is required" });
    }
    if (!product || !product.productId) {
      return res.status(400).send({ message: "productId is required" });
    }

    try {
      const response = await basketService.addProductInBasket(req.body);
      res.status(200).send({ response: response });
    } catch (e) {
      console.log(e, 'error');
      res.status(500).send({ error: "Internal Server Error" });
    }
  },

  delete: async (req, res) => {
    const { userId, productId } = req.body;
    if (!userId) {
      return res.status(400).send({ message: "userId is required" });
    }
    if (!productId) {
      return res.status(400).send({ message: "productId is required" });
    }

    try {
      const response = await basketService.removeProductFromBasket(req.body);
      res.status(200).send({ response: response });
    } catch (e) {
      console.log(e, 'error');
      res.status(500).send({ error: "Internal Server Error" });
    }
  },

  clearBasket: async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).send({ message: "userId is required" });
    }

    try {
      const response = await basketService.clearBasket(req.body);
      res.status(200).send({ response: response });
    } catch (e) {
      console.log(e, 'error');
      res.status(500).send({ error: "Internal Server Error" });
    }
  },

  getBasket: async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).send({ message: "userId is required" });
    }

    try {
      const response = await basketService.getBasket({ userId });
      res.status(200).send({ response: response });
    } catch (e) {
      console.log(e, 'error');
      res.status(500).send({ error: "Internal Server Error" });
    }
  },
};

module.exports = basketController;
