var Category = require("../models/CategoryModel");

function createCategory(req, res) {
    var params = req.body;
    
    if(!params.name) {
        console.log("Envia todos los datos faltantes.");
        return res.status(201).send({ message: "Envia todos los datos faltantes." });
    }

    Category.find({ name: params.name }).exec((err, category) => {
        if (err) {
            console.log(err);
            return null;
        }

        console.log(category);

        if(category && category.length >= 1) {
            console.log(`La categoria con el nombre: ${params.name}, ya existe.`);
            return res.status(201).send({ message: "Esta categoria ya existe." });
        }

        var newCategory = new Category();
        newCategory.name = params.name;

        newCategory.save((err, categoryStored) => {
            if (err){
                console.log(err);
                return res.status(500).send({ message: "Error al guardar la categoria." });
            }
    
            if (!categoryStored) {
                console.log("No se ha registrado la categoria.");
                return res.status(204).send({ message: "No se ha registrado la categoria." });
            }
    
            console.log(categoryStored);
            return res.status(200).send({ message: categoryStored });
        });
        
    });
}

module.exports = {
    createCategory
};