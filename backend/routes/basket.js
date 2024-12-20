const express = require('express');
const basketController = require('../controllers/basket');

const router = express.Router();

// Ürün ekleme: POST /basket
router.post('/', basketController.create);

// Sepeti getirme: GET /basket/:userId
router.get('/:userId', basketController.getBasket);

// Ürünü sepetten silme: DELETE /basket
router.delete('/', basketController.delete);

// Sepeti temizleme: POST /basket/clear
router.post('/clear', basketController.clearBasket);

module.exports = router;
