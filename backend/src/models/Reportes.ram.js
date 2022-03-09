const { Schema, model } = require("mongoose");

const RamSchema = new Schema(
    {
      Total: { type: Number, default: 0 },
      Uso: { type: Number, default: 0 },
      Porcentaje: { type: Number, default: 0 },
      Libre: { type: Number, default: 0 },
    },
    {
      versionKey: false,
      timestamps: true,
    }
  );
  
  module.exports = model("Ram", RamSchema, "memoria");