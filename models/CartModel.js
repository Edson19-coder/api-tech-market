var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CartSchema = Schema({
    userId: {type: Schema.ObjectId, ref: 'User'},
    products: [{
        type: Schema.ObjectId, 
        ref: 'Product'
    }],
    cantidad: [Number],
    total: String
});

module.exports = mongoose.model("Cart", CartSchema);