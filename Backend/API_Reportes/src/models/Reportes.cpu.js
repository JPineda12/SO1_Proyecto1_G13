const { Schema, model } = require("mongoose");

const CpuSchema = new Schema(
    {
      VM: { type: String, default: "None" },
      Nombre: { type: String, default: "None" },
      PID: { type: Number, default: 0 },
      PIDpadre: { type: Number, default: 0 },
      Estado: { type: Number, default: 0 },
      Hijos: { type: String, default: "None" },
    },
    {
      versionKey: false,
      timestamps: true,
    }
  );
  
  module.exports = model("Cpu", CpuSchema, "procesos");