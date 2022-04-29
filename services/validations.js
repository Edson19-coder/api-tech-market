var Product = require("../models/ProductModel.js");

function productValidation(params) {

  if (!params.name || !params.description || !params.price || 
    !params.characteristics || !params.category || !params.image) {
    console.log("Datos del producto princiales no validos.");
    return false;
  }

  var charact = JSON.parse(params.characteristics);
  
  if(!charact.manufacturer || !charact.name || !charact.description || !charact.model) {
    console.log("Datos de caracteristicas invalido.");
    return false;
  }

  var product = new Product();

  product.name = params.name;
  product.description = params.description;
  product.price = params.price;
  product.image = null;

  switch(params.category) {
    case "CPU": {
      if(!charact.socket) {
        console.log("Caracteristicas de: CPU, no validas.");
        return false;
      }
      break;
    }

    case "CPU Cooler": {
      if(!charact.socket) {
        console.log("Caracteristicas de: CPU Cooler, no validas.");
        return false;
      }
      break;
    }

    case "Motherborard": {
      if(!charact.Socket || !charact.FormFactor || !charact.MemoryMax || !charact.MemoryType || !charact.MemorySlots ||
        !charact.MemorySpeed || !charact.pcieX16Slots || !charact.pci3X8Slots || !charact.pcieX4Slots || !charact.pcieX1Slots ||
        !charact.sata3gb || !charact.sata6gb || !charact.m2) {
          console.log("Caracteristicas de: Motherborard, no validas.");
          return false;
        }
      break;
    }

    case "Memory": {
      if(!charact.Type || !charact.Speed || !charact.Modules || !charact.MemoryTotal) {
        console.log("Caracteristicas de: Memory, no validas.");
        return false;
      }
      break;
    }

    case "Video Card": {
      if(!charact.GPUInterface || !charact.Length) {
        console.log("Caracteristicas de: Video Card, no validas.");
        return false;
      }
      break;
    }

    case "Storage": {
      if(!charact.StorageInterface || !charact.StorageFormFactor) {
        console.log("Caracteristicas de: Storage, no validas.");
        return false;
      }
      break;
    }

    case "Case": {
      if(!charact.Type || !charact.MotherboardFormFactor || !charact.External525 || !charact.External35 || 
        !charact.Internal35 || !charact.Internal25 || !charact.MaxVideoCardLength) {
        console.log("Caracteristicas de: Case, no validas.");
        return false;
      }
      break;
    }

    case "Power Supply": {
      if(!charact.Type) {
        console.log("Caracteristicas de: Storage, no validas.");
        return false;
      }
      break;
    }

    default: {
      return false;
    }
  }

  product.characteristics = params.characteristics; 
  return product;
}

module.exports = {
    productValidation
};
