var express = require('express');

var AddressController = require("../controllers/AddressController");

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/createAddress', md_auth.ensureAuth, AddressController.createAddress);
api.post('/editAddress/:address', md_auth.ensureAuth, AddressController.editAddress);
api.post('/dropAddress/:address', md_auth.ensureAuth, AddressController.dropAddress);
api.get('/getAddress/:address', md_auth.ensureAuth, AddressController.getAddress);
api.post('/getAddresses', md_auth.ensureAuth, AddressController.getAddresses);

module.exports = api;