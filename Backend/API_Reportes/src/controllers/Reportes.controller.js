const Cpu = require("../models/Reportes.cpu");
const Ram = require("../models/Reportes.ram");

async function getData(req, res, next) {
  //console.log("Alooo")
  try {

    const tasks = await Cpu.find();
     return tasks;
    
  } catch (error) {
    return {"Message":"Error"}
  }
}

async function getRam() {
    
    try {
  
      const tasks = await Ram.find();
      //console.log(tasks); 
      return tasks;
      
    } catch (error) {
      return {"Message":"Error"}
    }
  }


module.exports = {
  getData,
  getRam,
};