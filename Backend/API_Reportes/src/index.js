const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const config = require("./config");
const http = require("http");
const socketIo = require("socket.io");

require("./database")
const Route = require("./routes/Reportes.routes");

const app = express();
const puerto = config.PORT;

const corsOptions = { origin: true, optionsSuccessStatus: 200 };
app.use(cors(corsOptions));
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => res.send("Welcome to my API!"));
app.use("/api", Route.routes);

const server = http.createServer(app);
const io = socketIo(server, {cors: {origin: "*"}});;

io.on("connection", function (socket) {
    console.log("Made socket connection");
    
    socket.on("ram", function (data) {
        console.log("DATA : " + data);
        //activeUsers.add(data);
        io.emit("ram", "sexo");
      });
  });



server.listen(puerto, () => console.log(`listening on port ${puerto}!`));