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


var server = require('http').Server(app);
const io = socketIo(server, {cors: {origin: "https://frontendsopes-yjbbrfhtza-uc.a.run.app",
                                    methods: ["GET","POST"]
}});

let interval;

io.on("connection",function (socket) {
    console.log("Made socket connection");
    if(interval){
      clearInterval(interval);
    }
    interval = setInterval(() => getRam(),5000);


  });



async function getRam(){
  
  const messageData = await controlador.getRam();
  console.log(messageData);
  io.emit("ram", messageData)
}

server.listen(puerto, () => console.log(`listening on port ${puerto}!`));

