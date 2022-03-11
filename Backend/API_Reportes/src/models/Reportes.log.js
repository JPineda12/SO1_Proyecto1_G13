const { Schema, model } = require("mongoose");

const LogSchema = new Schema(
    {
      VM: { type: String, default: 0 },
      Endpoint: { type: String, default: 0 },
      Data: { type: Object, default: 0 },
      Date: { type: String, default: 0 },
    },
    {
      versionKey: false,
      timestamps: true,
    }
  );
  
  module.exports = model("Log", LogSchema, "log");