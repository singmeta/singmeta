/**
 * Module dependencies.
 */
const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;

// 회원 인증을 위해 필요한 라이브러리 다운 : npm install passport passport-local express-session
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

/**
 * Connect Mongo Driver to MongoDB.
 */
var db;
MongoClient.connect("mongodb://mongodb:27017/", function (에러, client) {
  if (에러) {
    return console.log(에러);
  }

  db = client.db("SINGMETA");
});

/**
 * app.use(미들웨어)
 * 웹서버는 요펑-응답해주는 머신
 * 미들웨어 : 요청-응답 중간에 뭔가 실행되는 코드
 *          미들웨어는 운영 체제에서 제공하지 않는 일반적인 서비스와 기능을 애플리케이션에 제공하는 소프트웨어
 *          데이터 관리, 애플리케이션 서비스, 메시징, 인증 및 API 관리는 주로 미들웨어를 통해 처리
 */
router.use(
  session({ secret: "비밀코드", resave: true, saveUninitialized: false })
);
router.use(passport.initialize());
router.use(passport.session());

// 회원가입 : 이메일(email), 비밀번호(password), 별명(nickname), 핸드폰번호(phone)
router.post("/signUp", function (req, res, next) {
  if (!req.body.email) {
    // 변경가능
    console.log("No email in request body");
    return res.status(400).json({ message: "No email in request body" });
  } else if (!req.body.password) {
    // 변경가능
    console.log("No password in request body");
    return res.status(400).json({ message: "No password in request body" });
  } else if (!req.body.nickname) {
    // 변경가능
    console.log("No nickname in request body");
    return res.status(400).json({ message: "No nickname in request body" });
  } else if (!req.body.phone) {
    // 변경가능
    console.log("No phone in request body");
    return res.status(400).json({ message: "No phone in request body" });
  }

  console.log("POST 호출 / signUp : " + req.body.email);
  console.log("path : " + req.path);

  db.collection("memberCount").findOne(
    { name: "totalCount" },
    function (err, res) {
      console.log(res.totalCount);
      var totalCount = res.totalCount;

      db.collection("member").insertOne(
        {
          _id: totalCount + 1,
          email: req.body.email,
          password: req.body.password,
          nickname: req.body.nickname,
          phone: req.body.phone,
        },
        function (err, res) {
          console.log(`${req.body.email} 저장완료`);

          db.collection("memberCount").updateOne(
            { name: "totalCount" },
            { $inc: { totalCount: 1 } },
            function (err, res) {
              if (err) {
                return console.log(err);
              }
            }
          );
        }
      );
    }
  );

  res.send("post success");
});

router.post(
  "/login",
  passport.authenticate("local", {
    // local 방식으로 회원인지 인증
    failureRedirect: "/fail", // 회원인증 실패하면 /fail로 이동
  }),
  function (요청, 응답) {
    // 응답.redirect('/');
    응답.send("200 OK");
  }
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // form의 name 값 == id
      passwordField: "password",
      session: true, // 로그인 후 세션에 저장할 것인지 여부
      passReqToCallback: false, // 아이디, 비번 이외에 다른 정보 검증 시
    },
    function (email_input, pw_input, done) {
      console.log(email_input, pw_input);
      db.collection("member").findOne(
        { email: email_input },
        function (err, res) {
          // done(서버에러, 성공시사용자DB데이터, 에러메세지)
          //      성공시사용자DB데이터 : 아이디/비번 안맞으면 false 넣어야함
          if (err) return done(err);
          if (!res)
            return done(null, false, { message: "존재하지 않는 아이디입니다" });
          if (pw_input == res.password) {
            // 아이디/비번 맞으면 세션을 하나 만들어줘야 함
            // 로그인 성공 -> 세션정보를 만듦 -> 마이페이지 방문시 세션검사
            return done(null, res);
          } else {
            return done(null, false, {
              message: "비밀번호가 올바르지 않습니다",
            });
          }
        }
      );
    }
  )
);

// id를 이용해서 세션을 저장시키는 코드(로그인 성공시 발동) -> 암호화 해서 쿠키에 저장
passport.serializeUser(function (user, done) {
  done(null, user.email);
});

// 마이페이지 접속 시 발동 -> 이 세션 데이터를 가진 사람을 DB에서 찾아주세요
// 로그인한 유저의 개인정보를 DB에서 찾는 역할
// -> 로그인한 유저의 세션아이디를 바탕으로 개인정보를 DB에서 찾는 역할
passport.deserializeUser(function (email_input, done) {
  db.collection("member").findOne({ id: email_input }, function (err, res) {
    done(null, res);
  });
});

// 미들웨어 쓰는 법
// router.get('/mypage', isLogin, function(req, res){
//     console.log(req.user);
//     // 응답.render('mypage.ejs', {사용자 : 요청.user});
// });

// function isLogin(req, res, next){
//     if(req.user){
//         next(); // 다음으로 통과시키라는 뜻
//     } else {
//         res.send('로그인하지 않음');
//     }
// }

module.exports = router;
