const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const config = require("./config");
const http = require("http");
const socketIo = require("socket.io");

const controlador = require("./controllers/Reportes.controller");

require("./database");
const Route = require("./routes/Reportes.routes");
const { randomInt } = require("crypto");

const app = express();
const puerto = config.PORT;

const corsOptions = { origin: true, optionsSuccessStatus: 200 };
app.use(cors(corsOptions));
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => res.send("Welcome to my API!"));
app.use("/api", Route.routes);


var server = require('http').Server(app);
const io = socketIo(server, {cors: {origin: "http://localhost:3000",
                                    methods: ["GET","POST"]
}});

let interval;

io.on("connection",function (socket) {
  console.log("Made socket connection");
  if(interval){
    clearInterval(interval);
  }
  socket.on("ram", function (data) {
    interval = setInterval(() => getRam(),5000);
  });
  socket.on("cpu", function (data) {
    interval = setInterval(() => getCPU(),5000);
  });
  socket.on("log", function (data) {
    interval = setInterval(() => getLOG(),5000);
  });
  
});
  
async function getRam(){
  const messageData = await controlador.getRam();
  console.log("ram");
  io.emit("ram", messageData)

}

async function getCPU(){
  
  const messageData = await controlador.getData();
  console.log("CPU");
  io.emit("cpu", messageData)
}

async function getLOG(){
  
  const messageData = await controlador.getLog();
  console.log("log");
  io.emit("log", messageData)
}

server.listen(puerto, () => console.log(`listening on port ${puerto}!`));

