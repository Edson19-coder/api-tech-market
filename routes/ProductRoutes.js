var express = require('express');

var ProductController = require('../controllers/ProductController');

var api = express.Router();

var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var mad_upload = multipart({uploadDir: './uploads/publications'});

api.post('/createProduct', md_auth.ensureAuth, ProductController.createProduct);
api.post('/editProduct/:product', md_auth.ensureAuth, ProductController.editProduct);
api.post('/dropProduct/:product', md_auth.ensureAuth, ProductController.dropProduct);
api.get('/getProduct/:product', md_auth.ensureAuth, ProductController.getProduct);
api.post('/getProducts', md_auth.ensureAuth, ProductController.getProducts);
api.get('/getProductAdmin/:product', md_auth.ensureAuth, ProductController.getProductAdmin);
api.post('/getProductsAdmin', md_auth.ensureAuth, ProductController.getProductsAdmin);
api.post('/upload-image-product/:product', [md_auth.ensureAuth, mad_upload], ProductController.uploadImage);
api.get('/get-image-product/:imageFile', ProductController.getImageProduct);

module.exports = api;