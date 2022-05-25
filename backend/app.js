const createError = require("http-errors");
const express = require("express");
const app = express();
const port = 5002;
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/user");
const audioRouter = require("./routes/audio");
const roomRouter = require("./routes/room");
const { mongoURI } = require("./config/prod");

// view engine setup
//app.set("views", path.join(__dirname, "views"));
//app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cookieParser());

//app.use(express.static(path.join(__dirname, "public")));

// app.use('/', indexRouter);
app.use("/user", usersRouter);
app.use("/audio", audioRouter);
app.use("/room", roomRouter);

// catch 404 and forward to error handler
/*
app.use(function (req, res, next) {
  next(createError(404));
});
*/
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.set("view engine", "pug");
app.set("view engine", "ejs");

app.set("views", __dirname + "/src/views");

console.log(__dirname + "/src/views");

app.use("/public", express.static(__dirname + "/src/public"));

//app.get("/", (req, res) => res.render("main.pug"));
//app.get("/*", (req, res) => res.redirect("/"));

const httpServer = require("http").createServer(app);
const wsServer = require("socket.io")(httpServer, {
  // ...
});

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

const handleListen = () => console.log(`listening on http:localhost:${port}`);

httpServer.listen(port, "0.0.0.0", handleListen);

/*
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
*/
module.exports = app;
