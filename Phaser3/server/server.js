import http from "http";
//import WebSocket from "ws";
import express from "express";
import { Socket } from "dgram";
import { Server } from "socket.io";
import path from "path";
const __dirname = path.resolve();

const app = express();

console.log("hello");
app.set("view engine", "pug");
//app.set("view engine", "ejs");

app.set("views", __dirname + "../src/views");

console.log(__dirname + "../src/views");

app.use("/public", express.static(__dirname + "../src/public"));

//app.get("/", (req, res) => res.render("main"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("listening on http:localhost:3002!");

//app.listen(3000, handleListen);

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;

  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

var users = [];
wsServer.on("connection", (socket) => {
  socket["nickname"] = "anon";
  //console.log(socket);
  socket.onAny((event) => {
    console.log(`Socket Event:${event}`);
  });
  socket.on("enter_room", async (roomName, done) => {
    await socket.join(roomName);
    await done();
    await socket.to(roomName).emit("welcome", socket["nickname"]);
    users.push(socket["nickname"]);
    console.log(users);
    socket.to(roomName).emit("users", users);
  });
  socket.on("disconnecting", () => {
    users.pop();
    console.log(users);
    socket.rooms.forEach((room) => {
      socket.to(room).emit("bye", socket.nickname);
      socket.to(room).emit("users", users);
    });
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
  socket.on("nickname", (nickname) => {
    socket["nickname"] = nickname;
  });

  //--------------------------------------------------
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
  });
});

/*
const sockets = [];

wss.on("connection", (bsocket) => {
  sockets.push(bsocket);
  bsocket["nickname"] = "Anon";
  console.log("Connected to Browser ");
  bsocket.on("close", () => {
    console.log("Disconnected from the Browser");
  });
  bsocket.on("message", (msg) => {
    const message = JSON.parse(msg);
    console.log(message);

    switch (message.type) {
      case "new_message": {
        sockets.forEach((aSocket) =>
          aSocket.send(`${bsocket.nickname}: ${message.payload}`)
        );
        break;
      }

      case "nickname": {
        console.log(message.type);
        console.log("nickname " + message.payload);
        bsocket["nickname"] = message.payload;
        break;
      }
    }
  });
});
*/
httpServer.listen(3002, handleListen);
