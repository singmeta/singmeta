const http = require("http");
const express = require("express");
const cors = require("cors");
const colyseus = require("colyseus");
const monitor = require("@colyseus/monitor").monitor;
// const socialRoutes = require("@colyseus/social/express").default;

const PokeWorld = require("./rooms/PokeWorld").PokeWorld;

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const gameServer = new colyseus.Server({
  server: server,
});

var check = 0;

app.get("/apicheck", (req, res) => {
  console.log("helloworld");
  var check = 999;
  console.log(check);
});

var roomname;

app.post("/apicheck2", (req, res) => {
  roomname = req.body;
  res.send({
    roomname,
  });
  console.log("apichcke2 is success! " + JSON.stringify(roomname));
  console.log("apichcke2 is success! " + JSON.stringify(roomname.roomname));
});

/*
  gameServer
    .define(roomname.roomname, PokeWorld)
    .on("create", (room) => console.log("room created:", room.roomId))
    .on("dispose", (room) => console.log("room disposed:", room.roomId))
    .on("join", (room, client) => console.log(client.id, "joined", room.roomId))
    .on("leave", (room, client) => console.log(client.id, "left", room.roomId));
*/
// register your room handlers

// register your room handlers
gameServer
  .define("custom", PokeWorld)
  .on("create", (room) => console.log("room created:", room.roomId))
  .on("dispose", (room) => console.log("room disposed:", room.roomId))
  .on("join", (room, client) => console.log(client.id, "joined", room.roomId))
  .on("leave", (room, client) => console.log(client.id, "left", room.roomId));

// ToDo: Create a 'chat' room for realtime chatting

/**
 * Register @colyseus/social routes
 *
 * - uncomment if you want to use default authentication (https://docs.colyseus.io/authentication/)
 * - also uncomment the require statement
 */
// app.use("/", socialRoutes);

// register colyseus monitor AFTER registering your room handlers
app.use("/colyseus", monitor(gameServer));

gameServer.listen(port);
console.log(`Listening on ws://localhost:${port}`);
