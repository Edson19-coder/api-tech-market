var Cart = require("../models/CartModel");

function AddToCart(req, res) {
    var params = req.body;
    var cart = new Cart();
  
    if (params.productId) {

        Cart.find({userId: req.user.sub}).exec((err,carrito) => {
            if(err) {
                console.log(err);
                return res.status(500).send({message: 'Error al buscar el Carrito.'});
            }
            if (!carrito[0]) {
                //Si entra aqui es porque no hay ni un carrito hecho con ese usuario
                cart.userId = req.user.sub;
                console.log(cart.products);
                cart.products.push(params.productId);
                cart.cantidad.push(params.cantidad);
                cart.save((err, cartStored) => {
                    if (err) {
                        console.log(err);
                        return res
                        .status(500)
                        .send({ message: "Error al guardar el carrito." });
                        }
            
                        if (cartStored) {
                        console.log(cartStored);
                        res.status(200).send({ message: cartStored });
                        } else {
                        console.log("No se ha registrado el carrito.");
                        res.status(404).send({ message: "No se ha registrado el carrito." });
                    }
                });
            }else{
                //Si entra aqui es porque si hay un carrito existente y toca agregar un producto nuevo
                var updateCart = carrito[0];
                console.log(updateCart.products);

                var index  = updateCart.products.indexOf(params.productId);
                if(index == -1){
                    //es un producto que no esta
                    updateCart.products.push(params.productId);
                    updateCart.cantidad.push(params.cantidad);    

                }else{
                    //es un producto existente
                    var cantAntigua = updateCart.cantidad[index];
                    updateCart.cantidad[index] = cantAntigua + params.cantidad;    
                }
                Cart.findOneAndUpdate(
                    {userId: req.user.sub},
                    updateCart,
                    { new: true, useFindAndModify: false },
                    (err, cartUpdate) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).send({ message: "Error en la petición updateCart()" });
                        }

                        if (!cartUpdate) {
                            console.log("No se ha podido actualizar el carrito.");
                            return res.status(404).send({ message: "No se ha podido actualizar el carrito." });
                        }
                        console.log(cartUpdate);
                        return res.status(200).send({ cart: cartUpdate });
                    }
                );
            }
        });
    } else {
      console.log("Envia todos los datos faltantes.");
      res.status(200).send({ message: "Envia todos los datos faltantes." });
    }
}

function getCart(req, res) {

    Cart.find({userId: req.user.sub}).populate({path:'products'}).exec((err, cart) => {

    if(err) {
      console.log(err);
      return res.status(500).send({message: 'Error al obtener el carrito.'});
    }

    if(!cart) {
      console.log("El carrito no existe.")
      return res.status(404).send({message: 'El carrito no existe.'});
    }

    console.log(cart);
    return res.status(200).send(cart);

  });

}

function getTotalCartsActive(req, res) {
    Cart.count((err, counter) => {
      if(err) {
        console.log(err);
        return res.status(500).send({message: 'Error al obtener la cantidad de carritos activos.'});
      }
  
      if(!counter) {
        console.log("Sin carritos registrados.")
        return res.status(404).send({message: 'Sin carritos registrados.'});
      }
  
      console.log(counter);
      return res.status(200).send({totalActiveCarts: counter});
    });
}

function deleteItemByUserIdAndProductId(req, res) {
    var params = req.body;

    console.log(req.user.sub);
    console.log(req.params.productId);
  
    if(params.productId) {
        Cart.find({userId: req.user.sub}).exec((err,carrito) => {

            if(err) {
              console.log(err);
              return res.status(500).send({message: 'Error al obtener el carrito.'});
            }
        
            if(!cart) {
              console.log("El carrito no existe.")
              return res.status(404).send({message: 'El carrito no existe.'});
            }
        
            var updateCart = carrito[0];
            console.log(updateCart.products);

            var index  = updateCart.products.indexOf(params.productId);
           
            //se le resta
            var cantAntigua = updateCart.cantidad[index];
            updateCart.cantidad[index] = cantAntigua - 1;    
            
            if(element.cantidad <=0){
                //Ya no quedan y hay que sacarlo
                Cart.updateOne({userId: req.user.sub}, { $pull: {products : req.params.productId, cantidad : 0}}, (err, resp) => {
    
                    if (err) {
                    console.log(err);
                    return res.status(500).send({ message: "Error en la petición deleteItemByUserIdAndProductId()" });
                    }
                
                    console.log(resp);
                    return res.status(200).send({message: 'Elemento borrado correctamente.'});
                });            
            }else{
                //Solo se le resta 1 en la cantidad
                Cart.findOneAndUpdate(
                    {userId: req.user.sub},
                    updateCart,
                    { new: true, useFindAndModify: false },
                    (err, cartUpdate) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).send({ message: "Error en la petición updateCart()" });
                        }
                     
                        if (!cartUpdate) {
                            console.log("No se ha podido actualizar el carrito.");
                            return res.status(404).send({ message: "No se ha podido actualizar el carrito." });
                        }
                        console.log(cartUpdate);
                        return res.status(200).send({ cart: cartUpdate });
                    }
                );
            }
});

    } else {
      console.log("Envia todos los datos faltantes.");
      res.status(200).send({ message: "Envia todos los datos faltantes." });
    }
    
}

function deleteCartById(req, res) {
    Cart.find({userId: req.user.sub}).remove(err => {
    
      if(err) {
        console.log(err);
        return res.status(500).send({message: 'Error al borrar el Carrito.'});
      }
  
      console.log("Carrito borrado correctamente.");
      return res.status(200).send({message: 'Carrito borrado correctamente.'});
  
    });
  
}

module.exports = {
    AddToCart,
    getCart,
    getTotalCartsActive,
    deleteItemByUserIdAndProductId,
    deleteCartById
};