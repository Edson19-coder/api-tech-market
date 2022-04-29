var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PurchaseSchema = Schema({
    userId: {type: Schema.ObjectId, ref: 'User'},
    address: {type: Object},
    paymentMethod: {type: Object},
    products: [{
        type: Object
    }],
    totalAmount: Number,
    status: String,
    creationDate: String,
    lastUpdateDate: String
});

module.exports = mongoose.model("Purchase", PurchaseSchema); 