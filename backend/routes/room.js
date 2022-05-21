const express = require("express");
const router = express.Router();
const config = require("../config/key");
const { Room } = require("../models/Room");
const { Count } = require("../models/Count");
var CurrentTime = require("../functions/function");

const Colyseus = require("colyseus.js");

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {})
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// 방 만들기
router.get("/createRoom", (req, res) => {
  //var client = new Colyseus.Client("ws://localhost:3000");
  res.render("main.pug");
  /*

  if (!req.body.themeNum) {
    // 변경가능
    console.log("No themeNum in request body");
    return res.status(400).json({ message: "No themeNum in request body" });
  } else if (!req.body.roomName) {
    // 변경가능
    console.log("No roomName in request body");
    return res.status(400).json({ message: "No roomName in request body" });
  } else if (!req.body.headCount) {
    // 변경가능
    console.log("No headCount in request body");
    return res.status(400).json({ message: "No headCount in request body" });
  } else if (!req.body.pw_YN) {
    // 변경가능
    console.log("No password in request body");
    return res.status(400).json({ message: "No password in request body" });
  }

  const room = new Room(req.body);

  //  var roominfo = client
  //   .create("custom", { name: "hello", password: "N" })
  //  .then((room) => console.log(room));
  // console.log(roominfo);

  Count.findOne({ name: "roomCount" }, (err, count) => {
    if (!count) {
      return res.status(400).json({
        success: false,
        message: "roomCount가 없음",
      });
    }

    room.id = count.totalCount;
    room.reg_date = CurrentTime.getCurrentDate();

    room.save((err, roomInfo) => {
      if (err) {
        return res.status(400).json({ roomCreateSuccess: false, err });
      }

      Count.findOneAndUpdate(
        { name: "roomCount" },
        { $inc: { totalCount: 1 } },
        (err, roomInfo) => {
          if (err) {
            return res.status(400).json({ countUpdateSuccess: false, err });
          }

          return res.status(200).json({ success: true });
        }
      );
    });
  });
  */
});

// 모든 방 조회
router.get("/getRooms", (req, res) => {
  Room.find({}, (error, list) => {
    res.status(200).send({ rooms: list });
  });
});

// 특정 방 조회
router.get("/getRoom/:id", (req, res) => {
  Room.findOne({ id: req.params.id }, (err, room) => {
    if (!room) {
      return res.json({
        roomFindSuccess: false,
        message: "해당 Room이 존재하지 않습니다.",
      });
    }

    res.status(200).send(room);
  });
});

// 방 입장 -> 비밀번호 유무 상관없이 가능
router.get("/enterRoom/:id", (req, res) => {
  res.render("main.pug");
  // 방 찾기
  /*
    Room.findOne({id:req.params.id}, (err, room) => {


      
      if(!room){
        return res.json({
          enterRoomSuccess: false,
          message: "해당 Room이 존재하지 않습니다."
        })
      }
      
      if(room.pw_YN == "Y" && room.pw !== req.body.pw) {
        return res.json({enterRoomSuccess: false, message:"비밀번호가 틀렸습니다."})
      }

      res.json({enterRoomSuccess: true})

    })
    */
});

module.exports = router;
