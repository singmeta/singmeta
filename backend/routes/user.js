const express = require('express');
const router = express.Router();
const config = require('../config/key');
const {auth} = require('../middleware/auth')
const {User} = require("../models/User")
const {Count} = require("../models/Count")
var CurrentTime = require("../functions/function");

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

// 회원가입
router.post('/register', (req, res) => {

  if(!req.body.name) { // 변경가능
      console.log("No name in request body");
      return res.status(400).json({ message: "No name in request body" });
  } else if(!req.body.email) { // 변경가능
    console.log("No email in request body");
    return res.status(400).json({ message: "No email in request body" });
  } else if(!req.body.phone) { // 변경가능
    console.log("No phone in request body");
    return res.status(400).json({ message: "No phone in request body" });
  } else if(!req.body.password) { // 변경가능
      console.log("No password in request body");
      return res.status(400).json({ message: "No password in request body" });
  } else if(!req.body.nickname) { // 변경가능
      console.log("No nickname in request body");
      return res.status(400).json({ message: "No nickname in request body" });
  } 

  const user = new User(req.body)

  Count.findOne({name:'userCount'}, (err, count) => {

    if(!count){
      return res.status(400).json({
        success: false,
        message: "userCount가 없음"
      })
    }

    user.id = count.totalCount;
    user.reg_date = CurrentTime.getCurrentDate();

    user.save((err, userInfo) => {
      if(err) {
        return res.status(400).json({registerSuccess:false, err})
      }

      Count.findOneAndUpdate({name:"userCount"}, {$inc:{totalCount: 1}}, (err, userInfo) => {
        if(err) {
          return res.status(400).json({countUpdateSuccess:false, err})
        }

        return res.status(200).json({success: true})
      })
    })
  })

})

// 로그인
router.post('/login', (req, res) => {

  User.findOne({email:req.body.email}, (err, user) => {
    if(!user){
      return res.json({
        loginSuccess: false,
        message: " 제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
        return res.json({loginSuccess: false, message:"비밀번호가 틀렸습니다."})
      
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);

        res.cookie("x_auth", user.token)
          .status(200)
          .json({loginSuccess: true, userId: user.email});

      })
    })
  })
})

// auth 검증
router.get('/auth', auth, (req, res) => {
  res.status(200).json({
    _id:req.user._id,
    id:req.user.id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name : req.user.name,
    role: req.user.role,
    image: req.user.image
  })
})

// 로그아웃
router.get('/logout', auth, (req, res) => {
  User.findOneAndUpdate({_id: req.user._id}, {token:""} ,(err, user) => {
    if(err) return res.json({success:false, err});
    return res.status(200).send({
      success:true
    })
  })
})

// 회원탈퇴

// 아이디 찾기

// 비밀번호 찾기

module.exports = router;