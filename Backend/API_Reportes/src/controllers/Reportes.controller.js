const Cpu = require("../models/Reportes.cpu");
const Ram = require("../models/Reportes.ram");
const Log = require("../models/Reportes.log");

async function getData(req, res, next) {
  //console.log("Alooo")
  try {

    const tasks = await Cpu.find()
    .sort({$natural: -1})
    .limit(1)
    .then(
      function(doc) {
        return doc
      },
      function(err) {
        console.log('Error:', err);
      })
     return tasks;
    
  } catch (error) {
    console.log("ERROR: ", error)
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

  async function getLog() {
    
    try {
  
      const tasks = await Log.find()
       return tasks;
      
    } catch (error) {
      console.log("ERROR: ", error)
      return {"Message":"Error"}
    }
  }


module.exports = {
  getData,
  getRam,
  getLog,
};