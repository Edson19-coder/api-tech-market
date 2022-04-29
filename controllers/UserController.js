var path = require('path');
var fs = require('fs');

var bcrypt = require("bcrypt-nodejs");
var User = require("../models/UserModel");
var jwt = require("../services/jwt");
var mongoosePaginate = require("mongoose-pagination");

function createUser(req, res) {
  var params = req.body;
  var user = new User();

  if (
    params.name &&
    params.surname &&
    params.email &&
    params.password
  ) {
    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = "USER";
    user.image = "default.jpg";

    //Validamos que los datos email no esten ya registrados.
    User.find({
      $or: [
        { email: user.email.toLowerCase() }
      ],
    }).exec((err, users) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ message: "Error en la petición." }); 
      }

      if (users && users.length >= 1) {
        console.log("Esta cuenta ya existe.");
        return res.status(201).send({ message: "Esta cuenta ya existe." });
      } else {
        //Encriptamos la contraseña
        bcrypt.hash(params.password, null, null, (err, hash) => {
          user.password = hash;

          user.save((err, userStored) => {
            if (err){
              console.log(err);
              return res.status(500).send({ message: "Error al guardar el usuario." });
            }

            if (userStored) {
              console.log(userStored);
              res.status(200).send({ message: userStored });
            } else {
              console.log("No se ha registrado el usuario.");
              res.status(204).send({ message: "No se ha registrado el usuario." });
            }
          });
        });
      }
    });
  } else {
    console.log("Envia todos los datos faltantes.");
    res.status(201).send({ message: "Envia todos los datos faltantes." });
  }
}

function authUser(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;
  
    if(email && password) {
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          console.log(err);
          return res.status(500).send({ message: "Error en la petición." });
        }
    
        if (user) {
          bcrypt.compare(password, user.password, (err, check) => {
            if (check) {
              //Para poder ver el token el los params agregamos una variable llamada gettoken = true
              if (params.gettoken) {
                //Generar y devolver un token
                return res.status(200).send({ token: jwt.createToken(user) });
              } else {
                //devolver datos de usuario
                user.password = undefined;
                return res.status(200).send({ user });
              }
            } else {
              console.log("Este usuario no se pudo identificar.");
              return res.status(204).send({ message: "Este usuario no se pudo identificar." });
            }
          });
        } else {
          console.log("Este usuario no se pudo identificar!.");
          return res.status(204).send({ message: "Este usuario no se pudo identificar!." });
        }
      });
    } else {
      console.log("Envia todos los datos faltantes.");
      res.status(201).send({ message: "Envia todos los datos faltantes." });
    }
}

module.exports = {
    createUser,
    authUser
};