var mongoose = require('mongoose');
var app = require('./app');
var port = 5000;

//Conexion DB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/tech-market-db').then(()=>{
		console.log("La conexion a la base de datos de Tech Market, se ha realizado correcatamente.");
		//Crear servidor
		app.listen(port, ()=>{
			console.log("Servidor creado correcatamente en http://localhost:" + port);
		})
	}).catch(err=> console.log(err));