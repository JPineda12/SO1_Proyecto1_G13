const mongoose = require("mongoose");
const config = require("./config");

/**
 * Conexion con la base de datos
 */
(async () => {
  const db = await mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Database is connected to:", db.connection.name);
})();