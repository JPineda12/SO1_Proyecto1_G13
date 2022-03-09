const Cpu = require("../models/Reportes.cpu");
const Ram = require("../models/Reportes.ram");

async function getData(req, res, next) {
  //console.log("Alooo")
  try {

    const tasks = await Cpu.find();
     res.json(tasks);
    
  } catch (error) {
    res.status(500).json({
      message: error.message || "Error en el registro de datos",
    });
  }
}

async function getRam(req, res, next) {
    //console.log("Alooo")
    try {
  
      const tasks = await Ram.find();
       res.json(tasks);
      
    } catch (error) {
      res.status(500).json({
        message: error.message || "Error en el registro de datos",
      });
    }
  }


module.exports = {
  getData,
  getRam,
};