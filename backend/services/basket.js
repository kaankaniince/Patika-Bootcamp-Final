const redisClient = require("../utils/redis");

async function addProductInBasket(params) {
  const { userId, product } = params;
  const cartKey = userId;

  try {
    const basketData = await redisClient.get(cartKey);
    const basket = basketData ? JSON.parse(basketData) : [];

    // Check if product already exists in the basket
    const existingIndex = basket.findIndex((item) => item.productId === product.productId);

    if (existingIndex !== -1) {
      // If found, increment the quantity
      basket[existingIndex].quantity = (basket[existingIndex].quantity || 1) + 1;
    } else {
      // If not found, add the product with quantity = 1
      basket.push({ ...product, quantity: 1 });
    }

    await redisClient.set(cartKey, JSON.stringify(basket));
    console.log(basket, "Basket after adding product");
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function getBasket(params) {
  const { userId } = params;
  try {
    const value = await redisClient.get(userId);
    return value ? JSON.parse(value) : [];
  } catch (e) {
    console.log(e);
    return [];
  }
}

async function removeProductFromBasket(params) {
  const { userId, productId } = params;

  try {
    const basketData = await redisClient.get(userId);
    const basket = basketData ? JSON.parse(basketData) : [];

    const existingIndex = basket.findIndex((item) => item.productId === productId);

    if (existingIndex !== -1) {
      // If quantity > 1, decrement it
      if ((basket[existingIndex].quantity || 1) > 1) {
        basket[existingIndex].quantity -= 1;
      } else {
        // If quantity is 1, remove the product entirely
        basket.splice(existingIndex, 1);
      }
    }

    await redisClient.set(userId, JSON.stringify(basket));
    console.log(basket, "Basket after removing product");
    return true;
  } catch (e) {
    console.log(e, "error");
    return false;
  }
}

async function clearBasket(params) {
  const { userId } = params;
  try {
    // Sepeti tamamen silmek için key'i Redis'ten kaldıralım
    await redisClient.del(userId);
    return true;
  } catch (e) {
    console.log(e, "error");
    return false;
  }
}

module.exports = {
  addProductInBasket,
  getBasket,
  removeProductFromBasket,
  clearBasket,
};
