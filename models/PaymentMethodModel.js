var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PaymentMethodSchema = Schema({
    default: Boolean,
    active: Boolean,
    userId: {type: Schema.ObjectId, ref: 'User'},
    method: String, //VISA, MASTERCARD, etc
    cardHolder: String, //Titular de la tarjeta
    cardNumber: String, //Numero de la tarjeta
    cardNumberPublic: String, //ultimos 4 digitos
    securityNumber: String, //Cvv
    expirationMonth: String,
    expirationYear: String,
    creationDate: String,
    lastUpdateDate: String
});

module.exports = mongoose.model("PaymentMethod", PaymentMethodSchema);