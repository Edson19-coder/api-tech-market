var express = require('express');

var PurchaseController = require("../controllers/PurchaseController");

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post("/createPurchase", md_auth.ensureAuth, PurchaseController.createPurchase);
api.post("/editPurchase/:purchase", md_auth.ensureAuth, PurchaseController.editPurchase);
api.get("/getPurchaseByUserId/:purchase", md_auth.ensureAuth, PurchaseController.getPurchaseByUserId);
api.post("/getPurchasesByUserId", md_auth.ensureAuth, PurchaseController.getPurchasesByUserId);
api.post("/getPurchasesAdmin", md_auth.ensureAuth, PurchaseController.getPurchasesAdmin);

module.exports = api;