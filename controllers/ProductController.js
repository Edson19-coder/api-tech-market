var path = require('path');
var fs = require('fs');
var moment = require('moment');

var validationService = require("../services/validations"); 
var Product = require("../models/ProductModel");
var Category = require("../models/CategoryModel.js");

function createProduct(req, res) {
    if(req.user.role != "ADMIN") {
        return res.status(403).send({ message: "Permisos insuficientes." }); 
    }
    
    var params = req.body;
    var product = validationService.productValidation(params);
    
    if(product === false) {
        console.log("Datos del producto no validos.");
        return res.status(200).send({ message: "Datos del producto no validos." });
    }

    Category.find({name:params.category}, (err, category) => {
        if(err) {
            console.log(err);
            return res.status(500).send({ message: "Error en la petición." });
        }

        if(!category[0]) {
            console.log("No se encontro la categoria.");
            return res.status(204).send({ message: "No se encontro la categoria." });
        }

        product.category = category[0]._id;
        product.active = 1;
        product.creationDate = moment().unix();
        product.lastUpdateDate  = moment().unix();
        product.save((err, productStored) => {
            if(err) {
                console.log(err);
                return res.status(500).send({ message: "Error al guardar el producto." });
            }
    
            if(!productStored) {
                console.log("El producto no se ha guardado correctamente.");
                return res.status(204).send({ message: "El producto no se ha guardado correctamente." });
            }
    
            console.log(productStored);
            return res.status(200).send({ message: productStored });
        });
    });
}

function editProduct(req, res) {
    if(req.user.role != "ADMIN") {
        return res.status(403).send({ message: "Permisos insuficientes." }); 
    }

    var params = req.body;
    var productId = req.params.product;

    var product = validationService.productValidation(params);
    if(product === false || !productId) {
        console.log("Datos del producto no validos.");
        return res.status(200).send({ message: "Datos del producto no validos." });
    }

    Category.find({name:params.category}, (err, category) => {
        if(err) {
            console.log(err);
            return res.status(500).send({ message: "Error en la petición." });
        }

        if(!category[0]) {
            console.log("No se encontro la categoria.");
            return res.status(204).send({ message: "No se encontro la categoria." });
        }

        product.category = category[0]._id;
        Product.findByIdAndUpdate(productId, 
            {$set: {
                name: params.name,
                description: params.description,
                price: params.price,
                characteristics: params.characteristics,
                category: params.category,
                lastUpdateDate:moment().unix()
            }}
        , { new: true, useFindAndModify: false }, (err, productUpdate) => {
            if(err) {
                console.log(err);
                return res.status(500).send({ message: "Error al actualizar el producto." });
            }

            if(!productUpdate) {
                console.log("No se ha actualizado el producto.");
                return res.status(204).send({ message: "No se ha actualizado el producto." });
            }

            console.log(productUpdate);
            return res.status(200).send({ message: true });
        });
    }); 
}

function dropProduct(req, res) {
    var productId = req.params.product;

    Product.findByIdAndUpdate(productId,{$set:{active:0, lastUpdateDate:moment().unix()}}, (err, productUpdate) => {
        if(err) {
            console.log(err);
            return res.status(500).send({ message: "Error al actualizar el producto." });
        }

        if(!productUpdate) {
            console.log("No se ha actualizado el producto.");
            return res.status(204).send({ message: "No se ha actualizado el producto." });
        }

        console.log(productUpdate);
        return res.status(200).send({ message: true });
    });
}

function getProduct(req, res) {
    var productId = req.params.product;

    Product.findOne({_id:productId,active:1}, (err, product) => {
        if(err) {
            console.log(err);
            return res.status(500).send({message:"Error en la petición al obtener el producto."})
        }

        if(!product) {
            console.log(`No se ha encontrado el producto con el id: ${productId}`);
            return res.status(204).send({ message: "No se ha encontrado el producto." });
        }

        console.log(product);
        return res.status(200).send(product);
    });
}

function getProducts(req, res) {
    Product.find({active:1}, (err, products) => {
        if(err) {
            console.log(err);
            return res.status(500).send({message:"Error en la petición al obtener el producto."})
        }

        if(!products[0]) {
            console.log("No se encuentran productos registrados.");
            return res.status(204).send({ message: "No se encuentran productos registrados." });
        }

        console.log(products);
        return res.status(200).send(products);
    });
}

function getProductAdmin(req, res) {
    var productId = req.params.product;

    Product.findOne({_id:productId}, (err, product) => {
        if(err) {
            console.log(err);
            return res.status(500).send({message:"Error en la petición al obtener el producto."})
        }

        if(!product) {
            console.log(`No se ha encontrado el producto con el id: ${productId}`);
            return res.status(204).send({ message: "No se ha encontrado el producto." });
        }

        console.log(product);
        return res.status(200).send(product);
    });
}

function getProductsAdmin(req, res) {
    Product.find((err, products) => {
        if(err) {
            console.log(err);
            return res.status(500).send({message:"Error en la petición al obtener el producto."})
        }

        if(!products[0]) {
            console.log("No se encuentran productos registrados.");
            return res.status(204).send({ message: "No se encuentran productos registrados." });
        }

        console.log(products);
        return res.status(200).send(products);
    })
}

function uploadImage(req, res) {
    var productId = req.params.product;

    
	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2]; //Obtenemos el nombre de la imagen.
		var ext_split = file_name.split('\.'); //Cortamos la extension del archivo.
		var file_ext = ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            Product.findByIdAndUpdate({_id:productId,image:file_name}, (err, productUpdate) => {
                if(err) {
                    console.log(err);
                    return res.status(500).send({ message: "Error al actualizar el producto." });
                }
        
                if(!productUpdate) {
                    console.log("No se ha actualizado el producto.");
                    return res.status(204).send({ message: "No se ha actualizado el producto." });
                }
        
                console.log(productUpdate);
                return res.status(200).send({ message: true });
            });
        } else {
			return removeFilesOfUploads(res, file_path, 'Extension no es valida.');
		}

    } else {
		return res.status(200).send({ message: 'No se han subido imagenes.' });
	}
}

function removeFilesOfUploads(res, file_path, message){
    fs.unlink(file_path, (err)=>{
        return res.status(200).send({ message: message });
    });
}

function getImageProduct(req, res){
	var image_files = req.params.imageFile;
	var path_file = './uploads/products/' + image_files;

	fs.exists(path_file, (exists)=>{
		return exists ? res.sendFile(path.resolve(path_file)) : res.status(200).send({ message: 'No existe la imagen...' });
	})
}


module.exports = {
    createProduct,
    editProduct,
    dropProduct,
    getProduct,
    getProducts,
    getProductAdmin,
    getProductsAdmin,
    uploadImage,
    getImageProduct
};