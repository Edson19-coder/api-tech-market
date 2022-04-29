var mongoose = require('mongoose');
var app = require('./app');
var port = 5000;
require("dotenv").config();

//Conexion DB
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URI  || "mongodb://localhost:27017/tech-market-db").then(()=>{
		console.log("La conexion a la base de datos de Tech Market, se ha realizado correcatamente.");
		//Crear servidor
		app.listen(port, ()=>{
			console.log("Servidor creado correcatamente");
		})
	}).catch(err=> console.log(err));
