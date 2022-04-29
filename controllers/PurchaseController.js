var Purchase = require("../models/PurchaseModel");
var Address = require("../models/AddressModel");
var PaymentMethod = require("../models/PaymentMethodModel");
var Product = require("../models/ProductModel");

var moment = require('moment');

function createPurchase(req, res) {
    var params = req.body;

    if(!params.addressId && !params.paymentMethodId, 
        !params.products && !params.totalAmount) {
        console.log("Envia todos los datos faltantes.");
        return res.status(201).send({ message: "Envia todos los datos faltantes." });
    }

    var purchase = Purchase();

    Address.findOne({_id: params.addressId,active:1}, (err, address) => {
        if(err) {
            console.log(err);
            return res.status(500).send({ message: "Error en la petición de la dirección." });
        }

        if(!address) {
            console.log("No se ha encontrado la dirección.");
            return res.status(204).send({ message: "No se ha encontrado la dirección." });
        }

        address = address.toObject();
        delete address._id;
        delete address.userId;
        delete address.active;
        delete address.creationDate;
        delete address.lastUpdateDate;
        delete address.__v;
        console.log(address);
        purchase.address = address;

        PaymentMethod.findOne({_id:params.paymentMethodId,active:1}, (err, paymentMethod) => {
            if(err) {
                console.log(err);
                return res.status(500).send({ message: "Error en la petición del metodo de pago." });
            }
    
            if(!paymentMethod) {
                console.log("No se ha encontrado el metodo de pago.");
                return res.status(204).send({ message: "No se ha encontrado el metodo de pago." });
            }

            paymentMethod = paymentMethod.toObject();
            delete paymentMethod._id;
            delete paymentMethod.default;
            delete paymentMethod.active;
            delete paymentMethod.userId;
            delete paymentMethod.expirationMonth;
            delete paymentMethod.expirationYear;
            delete paymentMethod.creationDate;
            delete paymentMethod.lastUpdateDate;
            delete paymentMethod.securityNumber;
            delete paymentMethod.cardNumber;
            delete paymentMethod.__v;
            console.log(paymentMethod);
            purchase.paymentMethod = paymentMethod;
            
            Product.find({_id:{$in: params.products}}, (err, products) => {
                if(err) {
                    console.log(err);
                    return res.status(500).send({ message: "Error en la petición del producto." });
                }

                if(!products) {
                    console.log("No se ha encontrado el producto.");
                    return res.status(204).send({ message: "No se ha encontrado el producto." });
                }

                console.log(products);

                var totalAmount = 0;
                var productsClean = []; 
                products.forEach(product => {
                    product = product.toObject();
                    delete product.image;
                    delete product.characteristics;
                    delete product.category;
                    delete product.__v;
                    totalAmount = totalAmount + product.price;
                    productsClean.push(product)
                });
                
                purchase.products = productsClean;
                purchase.totalAmount = totalAmount;
                purchase.status = "P";
                purchase.creationDate = moment().unix();
                purchase.lastUpdateDate  = moment().unix();
                
                purchase.save((err, purchaseStored) => {
                    if(err) {
                        console.log(err);
                        return res.status(500).send({ message: "Error al guardar la compra." });
                    }
            
                    if(!purchaseStored) {
                        console.log("No se ha registrado la compra.");
                        return res.status(204).send({ message: "No se ha registrado la compra." });
                    }

                    console.log(purchase);
                    return res.status(200).send({message: purchaseStored});
                });

            });
        });

    });


}

function editPurchase(req, res) {
    var params  = req.body;
    var purchaseId = req.params.purchase;

    if(!params.status && !purchaseId) {
        console.log("Envia todos los datos faltantes.");
        return res.status(201).send({ message: "Envia todos los datos faltantes." });
    }

    Purchase.findByIdAndUpdate(purchaseId, {$set: {status:params.status,lastUpdateDate:moment().unix()}}, (err, purchaseUpdate) => {
        if(err) {
            console.log(err);
            return res.status(500).send({ message: "Error al actualizar la compra." });
        }

        if(!purchaseUpdate) {
            console.log("No se ha actualizado la compra.");
            return res.status(204).send({ message: "No se ha actualizado la compra." });
        }

        console.log(purchaseUpdate);
        return res.status(200).send({message:true});
    });
}

function getPurchaseByUserId(req, res) {
    var purchaseId = req.params.purchase;

    Purchase.findOne({_id:purchaseId,userId:req.user.sub}, (err, purchase) => {
        if(err) {
            console.log(err);
            return res.status(500).send({ message: "Error al obtener la compra." });
        }

        if(!purchase) {
            console.log(`No se ha encontrado la compra con id:${purchaseId}`);
            return res.status(204).send({ message: "No se ha encontrado la compra." });
        }

        console.log(purchase);
        return res.status(200).send(purchase);
    });
}

function getPurchasesByUserId(req, res) {
    Purchase.find({userId:req.user.sub}, (err, purchases) => {
        if(err) {
            console.log(err);
            return res.status(500).send({ message: "Error al obtener las compras." });
        }

        if(!purchases) {
            console.log(`No se ha encontrado las compras con el user id:${req.user.sub}`);
            return res.status(204).send({ message: "No se han encontrado las compras." });
        }

        console.log(purchases);
        return res.status(200).send(purchases);
    });
}

function getPurchasesAdmin(req, res) {
    if(req.user.role != "ADMIN") {
        return res.status(403).send({ message: "Permisos insuficientes." }); 
    }

    Purchase.find((err, purchases) => {
        if(err) {
            console.log(err);
            return res.status(500).send({ message: "Error al obtener las compras." });
        }

        if(!purchases) {
            console.log("No se han encontrado las compras.");
            return res.status(204).send({ message: "No se han encontrado las compras." });
        }

        console.log(purchases);
        return res.status(200).send(purchases);
    });
}

module.exports = {
    createPurchase,
    editPurchase,
    getPurchaseByUserId,
    getPurchasesByUserId,
    getPurchasesAdmin
};