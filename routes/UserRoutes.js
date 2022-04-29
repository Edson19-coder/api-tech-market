var express = require('express');

var UserController = require('../controllers/UserController');

var api = express.Router();

var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var mad_upload = multipart({uploadDir: './uploads/users'}); //Imagenes

api.post('/createUser', UserController.createUser);
api.post('/authUser', UserController.authUser);

module.exports = api;