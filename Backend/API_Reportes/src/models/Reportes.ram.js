const { Schema, model } = require("mongoose");

const RamSchema = new Schema(
    {
      vm: { type: String, default: 0 },
      total: { type: Number, default: 0 },
      consumida: { type: Number, default: 0 },
      libre: { type: Number, default: 0 },
      porcentaje: { type: Number, default: 0 },
    },
    {
      versionKey: false,
      timestamps: true,
    }
  );
  
  module.exports = model("Ram", RamSchema, "memoria");