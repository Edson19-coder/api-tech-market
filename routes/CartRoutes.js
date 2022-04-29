var express = require('express');

var CartController = require('../controllers/CartController');

var api = express.Router();

var md_auth = require('../middlewares/authenticated');


api.post('/addToCart', md_auth.ensureAuth, CartController.AddToCart);
api.get('/getCart', md_auth.ensureAuth, CartController.getCart);
api.get('/getTotalCartsActive', md_auth.ensureAuth, CartController.getTotalCartsActive);
api.delete('/deleteItemByUserIdAndProductId/:productId', md_auth.ensureAuth, CartController.deleteItemByUserIdAndProductId);
api.delete('/deleteCartById', md_auth.ensureAuth, CartController.deleteCartById);

module.exports = api;