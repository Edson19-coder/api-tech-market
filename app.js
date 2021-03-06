var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas
var user_routes = require('./routes/UserRoutes');
var product_routes = require('./routes/ProductRoutes');
var category_routes = require('./routes/CategoryRoutes');
var cart_routes = require('./routes/CartRoutes');
var paymentMethod_routes = require('./routes/PaymentMethodRoutes');
var address_routes = require('./routes/AddressRoutes');
var purchase_routes = require('./routes/PurchaseRoutes');

//middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); //Cada una de las peticiones de convierten en un formato JSON.

//acceso cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
}); 

app.get('/', (req, res) => {
    res.send("Working!");
})

//rutas
app.use('/api', user_routes);
app.use('/api', product_routes);
app.use('/api', category_routes);
app.use('/api', cart_routes);
app.use('/api', paymentMethod_routes);
app.use('/api', address_routes);
app.use('/api', purchase_routes);

//exportar 
module.exports = app;