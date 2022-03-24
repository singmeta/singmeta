var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;

// 몽고디비 연결
var db;
MongoClient.connect('mongodb://localhost:27017/', function(에러, client){
    if(에러) {
        return console.log(에러);
    }

    db = client.db('SINGMETA');
});

// 방 만들기 : 테마(themeNum), 방이름(roomName), 인원수(headCount), 비밀번호 유무(pw_YN), 비밀번호(pw)
router.post('/createRoom', function (req, res, next) {
    if(!req.body.themeNum) { // 변경가능
        console.log("No themeNum in request body");
        return res.status(400).json({ message: "No themeNum in request body" });
    } else if(!req.body.roomName) { // 변경가능
        console.log("No roomName in request body");
        return res.status(400).json({ message: "No roomName in request body" });
    } else if(!req.body.headCount) { // 변경가능
        console.log("No headCount in request body");
        return res.status(400).json({ message: "No headCount in request body" });
    } else if(!req.body.pw_YN) { // 변경가능
        console.log("No password in request body");
        return res.status(400).json({ message: "No password in request body" });
    } 

    console.log('POST 호출 / roomName : ' + req.body.roomName);
    console.log('path : ' + req.path);

    db.collection('roomCount').findOne({name : 'totalCount'}, function(err, res){
        console.log(res.totalCount);
        var totalCount = res.totalCount;

        db.collection('room').insertOne({_id:totalCount + 1, Theme:req.body.themeNum, roomName:req.body.roomName, headCount:req.body.headCount, pw_YN:req.body.pw_YN, pw:req.body.pw}, function(err, res){
            console.log(`${req.body.roomName} 저장완료`);

            db.collection('roomCount').updateOne({name : 'totalCount'}, { $inc : {totalCount:1} }, function(err, res){
                if(err) {
                    return console.log(err);
                }
            });
            
        });
    });

    res.send('post success');
});

// 모든 방 조회
router.get('/getRooms', function (req, res, next) {
    console.log('GET 호출 / data : ' + req.query.data);
    console.log('path : ' + req.path);
    let list;

    db.collection('room').find().toArray(function(err, res){
        list = res;
        console.log(res);
    });

    res.send(200, {rooms : list});
});

// 특정 방 조회
// router.get('/getRoom', function (req, res, next) {
//     console.log('GET 호출 / data : ' + req.query.data);
//     console.log('path : ' + req.path);
//     let list;

//     db.collection('room').find().toArray(function(err, res){
//         list = res;
//         console.log(res);
//     });

//     res.send('get success', {rooms : list});
// });

// router.put('/put/:id', function (req, res, next) {
//     console.log('UPDATE 호출 / id : ' + req.params.id);
//     console.log('body : ' + req.body.data);
//     console.log('path : ' + req.path);

//     db.collection('memo').updateOne({id : req.params.id}, { $set : {title:req.body.title, data:req.body.data} }, function(err, res){
//         if(err) {
//             return console.log(err);
//         }
//     });

//     res.send('put success')
// });

// router.delete('/delete/:id', function (req, res, next) {
//     console.log('DELETE 호출 / id : ' + req.params.id);
//     console.log('path : ' + req.path);
//     res.send('delete success')
// });



module.exports = router;