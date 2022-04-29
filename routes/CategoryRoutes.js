var express = require('express');

var CategoryController = require('../controllers/CategoryController');

var api = express.Router();

var md_auth = require('../middlewares/authenticated');

api.post('/createCategory', md_auth.ensureAuth, CategoryController.createCategory);

module.exports = api;