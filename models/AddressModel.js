var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AddressModelSchema = Schema({
    userId: {type: Schema.ObjectId, ref: 'User'},
    country: String,
    name: String,
    street: String,
    number: String,
    postalCode: Number,
    state: String,
    city: String,
    suburb: String,
    active: Number,
    creationDate: String,
    lastUpdateDate: String
});

module.exports = mongoose.model("Address", AddressModelSchema); 