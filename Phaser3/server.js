/*
import http from "http";
//import WebSocket from "ws";
import express from "express";
import { Socket } from "dgram";
import { Server } from "socket.io";
import path from "path";

const __dirname = path.resolve();
*/

//const http = require("http");

const express = require("express");

const app = express();

app.set("view engine", "pug");
//app.set("view engine", "ejs");

app.set("views", __dirname + "/src/views");

console.log(__dirname + "/src/views");

app.use("/public", express.static(__dirname + "/src/public"));

app.get("/", (req, res) => res.render("main.pug"));
//app.get("/*", (req, res) => res.redirect("/"));

app.get("/helloworld", (req, res) => {
  console.log("helloworld selected");
  res.render("main.pug");
});

app.get("/helloserver", (req, res) => {
  console.log("helloserver selected");
  res.render("main.pug");
});

const handleListen = () => console.log("listening on http:localhost:3002!");
//app.listen(3000, handleListen);

/*
const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);
*/
const httpServer = require("http").createServer(app);
const wsServer = require("socket.io")(httpServer, {
  // ...
});

/*

function publicRooms() {
  ß;
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
*/
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

httpServer.listen(3002, handleListen);
/*
app.listen(3002, () => {
  console.log(`Example app listening on port ${3002}`);
});
*/
