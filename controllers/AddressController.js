var Address = require("../models/AddressModel");

var moment = require('moment');

function createAddress(req, res) {
    var params  = req.body;

    if(!params.country && !params.name && !params.street && 
       !params.number && !params.postalCode && !params.state && 
       !params.city &&  !params.suburb) {
        console.log("Envia todos los datos faltantes.");
        return res.status(201).send({ message: "Envia todos los datos faltantes." });
    }

    var address = Address();
    address.userId = req.user.sub;
    address.country = params.country;
    address.name = params.name;
    address.street = params.street;
    address.number = params.number;
    address.postalCode = params.postalCode;
    address.state = params.state;
    address.city = params.city;
    address.suburb = params.suburb;
    address.active = 1;
    address.creationDate = moment().unix();
    address.lastUpdateDate  = moment().unix();

    address.save((err, addressStored) => {
        if(err) {
            console.log(err);
            return res.status(500).send({ message: "Error al guardar la dirección." });
        }

        if(!addressStored) {
            console.log("No se ha registrado la dirección.");
            return res.status(204).send({ message: "No se ha registrado la dirección." });
        }

        console.log(addressStored);
        return res.status(200).send({ message: addressStored });
    });
}

function editAddress(req, res) {
    var addressId = req.params.address;
    var params  = req.body;

    if(!params.country && !params.name && !params.street && 
       !params.number && !params.postalCode && !params.state && 
       !params.city &&  !params.suburb) {
        console.log("Envia todos los datos faltantes.");
        return res.status(201).send({ message: "Envia todos los datos faltantes." });
    }

    Address.findByIdAndUpdate(addressId, 
        {$set: {
            country:params.country,
            name:params.name,
            street:params.street,
            number:params.number,
            postalCode:params.postalCode,
            state:params.state,
            city:params.city,
            suburb:params.suburb,
            lastUpdateDate:moment().unix()
        }}
    , { new: true, useFindAndModify: false }, (err, addressUpdate) => {
        if(err) {
            console.log(err);
            return res.status(500).send({ message: "Error al actualizar la dirección." });
        }

        if(!addressUpdate) {
            console.log("No se ha actualizado la dirección.");
            return res.status(204).send({ message: "No se ha actualizado la dirección." });
        }

        console.log(addressUpdate);
        return res.status(200).send({ message: true });
    });
}

function dropAddress(req, res) {
    var addressId = req.params.address;

    Address.findByIdAndUpdate(addressId, {$set: {active:0,lastUpdateDate:moment().unix()}}, (err, addressUpdate) => {
        if(err) {
            console.log(err);
            return res.status(500).send({ message: "Error al actualizar la dirección." });
        }

        if(!addressUpdate) {
            console.log("No se ha actualizado la dirección.");
            return res.status(204).send({ message: "No se ha actualizado la dirección." });
        }

        console.log(addressUpdate);
        return res.status(200).send({ message: true });
    });
}

function getAddress(req,res) {
    var addressId = req.params.address;

    Address.find({_id:addressId,active:1}, (err, address) => {
        if(err) {
            console.log(err);
            return res.status(500).send({ message: "Error al obtener la dirección." });
        }

        if(!address[0]) {
            console.log(`No se ha encontrado la dirección con id:${addressId}`);
            return res.status(204).send({ message: "No se ha encontrado la dirección." });
        }

        console.log(address);
        return res.status(200).send(address);
    });
}

function getAddresses(req,res) {

    Address.find({userId:req.user.sub,active:1}, (err, addresses) => {
        if(err) {
            console.log(err);
            return res.status(500).send({ message: "Error al obtener las direcciones." });
        }

        if(!addresses) {
            console.log(`No se ha encontrado direcciones con el userId:${req.user.sub}`);
            return res.status(204).send({ message: "No se han encontrado direcciones registradas." });
        }

        console.log(addresses);
        return res.status(200).send({ addresses: addresses });
    });
}

module.exports = {
    createAddress,
    editAddress,
    dropAddress,
    getAddress,
    getAddresses
}