var mongoose = require('mongoose');
var app = require('./app');
var port = 5000;

//Conexion DB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://admin:FMybogV2nHr8d0wr@cluster0.s4hym.mongodb.net/Cluster0?retryWrites=true&w=majority').then(()=>{
		console.log("La conexion a la base de datos de Tech Market, se ha realizado correcatamente.");
		//Crear servidor
		app.listen(port, ()=>{
			console.log("Servidor creado correcatamente");
		})
	}).catch(err=> console.log(err));
