var PaymentMethod = require('../models/PaymentMethodModel');
var moment = require('moment');
var bcrypt = require("bcrypt-nodejs");

function createPaymentMethod(req, res) {

    var params = req.body;
    
    if(params.method && params.cardHolder && params.cardNumber && params.securityNumber
         && params.expirationMonth && params.expirationYear)
        {
        
        var newPaymentMethod = PaymentMethod();
        newPaymentMethod.default = true;
        newPaymentMethod.active = true;
        newPaymentMethod.userId = req.user.sub;
        newPaymentMethod.method = params.method;
        newPaymentMethod.cardHolder = params.cardHolder;
        newPaymentMethod.cardNumberPublic = params.cardNumber.substr(params.cardNumber.length - 4);
        newPaymentMethod.expirationMonth = params.expirationMonth;
        newPaymentMethod.expirationYear = params.expirationYear;
        newPaymentMethod.creationDate = moment().unix();
        newPaymentMethod.lastUpdateDate = moment().unix();
        //Encriptamos el cvv
        bcrypt.hash(params.securityNumber, null, null, (err, hash) => {
            newPaymentMethod.securityNumber = hash;
        });
        //Encriptamos numero de tarjeta
        bcrypt.hash(params.cardNumber, null, null, (err, hash2) => {
            newPaymentMethod.cardNumber = hash2;
        });
    
        
        PaymentMethod.find({userId: req.user.sub}).exec((err, paymentMethod) => {
            
            if(err) {
                console.log(err);
                return res.status(500).send({message: 'Error en la petición createPaymentMethod.'});
            }

            paymentMethod.forEach((payMeth) => {
                if (payMeth && payMeth.userId == req.user.sub) newPaymentMethod.default = false;
            });

            newPaymentMethod.save((err, paymentMethodStored) => {

                if(err) {
                    console.log(err);
                    return res.status(500).send({message: 'Error al guardar el nuevo metodo de pago'});
                }

                if(paymentMethodStored) {
                    console.log(paymentMethodStored);
                    res.status(200).send(paymentMethodStored);
                } else {
                    res.status(404).send({ message: "No se ha registrado el usuario." });
                }

            });
          
        });

    } else {
        console.log("Envia todos los datos faltantes.");
        res.status(200).send({ message: "Envia todos los datos faltantes." });
    }

}

function deletePaymentMethod(req, res) {
    var paymentMethodId = req.params.paymentMethod;

    PaymentMethod.findByIdAndUpdate(paymentMethodId, {$set: {active:false,lastUpdateDate:moment().unix()}}, (err, paymentMethodUpdate) => {
        if(err) {
            console.log(err);
            return res.status(500).send({ message: "Error al borrar metodo de pago." });
        }

        if(!paymentMethodUpdate) {
            console.log("No se ha borrado el metodo de pago.");
            return res.status(204).send({ message: "No se ha borrado el metodo de pago." });
        }

        console.log(paymentMethodUpdate);
        return res.status(200).send({ message: true });
    });
}

function updatePaymentMethod(req, res) {
    var PMid = req.params.id
    var params = req.body;

    if(params.cardHolder && params.securityNumber && params.expirationMonth && params.expirationYear && params.active)
    {   
        //Encriptamos el cvv
        bcrypt.hash(params.securityNumber, null, null, (err, hash) => {
            params.securityNumber = hash;
            PaymentMethod.findByIdAndUpdate(PMid, 
                {$set: {
                    cardHolder:params.cardHolder,
                    securityNumber:params.securityNumber,
                    expirationMonth:params.expirationMonth,
                    expirationYear:params.expirationYear,
                    active:params.active,
                    lastUpdateDate:moment().unix()
                }}
            , { new: true, useFindAndModify: false }, (err, paymentMethodUpdate) => {
                if(err) {
                    console.log(err);
                    return res.status(500).send({ message: "Error al actualizar metodo de pago." });
                }
    
                if(!paymentMethodUpdate) {
                    console.log("No se ha actualizado metodo de pago.");
                    return res.status(204).send({ message: "No se ha actualizado metodo de pago." });
                }
    
                console.log(paymentMethodUpdate);
                return res.status(200).send({ message: true });
            });    
        });
        
    } else {
        console.log("Envia todos los datos faltantes.");
        res.status(200).send({ message: "Envia todos los datos faltantes." });
    }
}

function getPaymentMethodByUserId(req, res) {

    if(req.user.sub) {
        
        PaymentMethod.find({userId:req.user.sub,active:1}).exec((err, paymentMethods) => {
            
            if (err) {
                console.log(err);
                return res.status(500).send({ message: "Error en la petición." });
            }
        
            if (!paymentMethods) {
                console.log("Metodos de pago no existen");
                return res.status(404).send({ message: "Metodos de pago no existen" });
            }
    
            console.log(paymentMethods);
            return res.status(200).send( paymentMethods );

        }); 

    } else {
        console.log("Envia todos los datos faltantes.");
        res.status(200).send({ message: "Envia todos los datos faltantes." });
    }

}

module.exports = {
    createPaymentMethod,
    deletePaymentMethod,
    updatePaymentMethod,
    getPaymentMethodByUserId
};