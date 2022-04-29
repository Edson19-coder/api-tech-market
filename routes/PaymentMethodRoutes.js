var express = require('express');

var PaymentMethodController = require('../controllers/PaymentMethodController');

var api = express.Router();

var md_auth = require('../middlewares/authenticated');

api.post('/createPaymentMethod', md_auth.ensureAuth, PaymentMethodController.createPaymentMethod);
api.delete('/deletePaymentMethod', md_auth.ensureAuth, PaymentMethodController.deletePaymentMethod);
api.put('/updatePaymentMethod/:id', md_auth.ensureAuth, PaymentMethodController.updatePaymentMethod);
api.get('/getPaymentMethodByUserId', md_auth.ensureAuth, PaymentMethodController.getPaymentMethodByUserId);
module.exports = api;