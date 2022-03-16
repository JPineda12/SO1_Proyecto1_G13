const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const config = require("./config");
const http = require("http");
const socketIo = require("socket.io");

const controlador = require("./controllers/Reportes.controller");

require("./database");
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

var server = http.createServer(app);
const io = socketIo(
  server,
  {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      transports: ["websocket", "polling"],
    },
  },
  (cors_allowed_origins = "*")
);

let interval;

io.on("connection", function (socket) {
  console.log("Made socket connection");
  if (interval) {
    clearInterval(interval);
  }
  if (socket.connected) {
    socket.on("ram", function (data) {
      interval = setInterval(() => {
        if (socket.connected) {
          getRam();
        } else {
          clearInterval(interval);
        }
      }, 5000);
    });
    socket.on("cpu", function (data) {
      interval = setInterval(() => {
        if (socket.connected) {
          getCPU();
        } else {
          clearInterval(interval);
        }
      }, 5000);
    });
    socket.on("log", function (data) {
      getLOG();      
    });
    socket.on("disconnect", function (data) {
      console.log("Socket Disconnected");
      socket.disconnect();
      socket.connected = false;
    });
  }
});

async function getRam() {
  console.log("RAM Emit")
  const messageData = await controlador.getRam();
  io.emit("ram", messageData);
}

async function getCPU() {
  console.log("CPU Emit")
  const messageData = await controlador.getData();
  io.emit("cpu", messageData);
}

async function getLOG() {
  console.log("LOG EMIT");
  const messageData = await controlador.getLog();
  io.emit("log", messageData);
}

server.listen(puerto, () => console.log(`listening on port ${puerto}!`));
