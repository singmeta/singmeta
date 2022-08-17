


const socket = io();

console.log(socket);
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
const scroll = document.getElementById("scroll");
const scroll2 = document.getElementById("scroll2");
const musicBtn = document.getElementById("musicbutton");
const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");
const call = document.getElementById("call");




musicBtn.addEventListener("click", handleMusicClick);
muteBtn.addEventListener("click", handleMuteClick);

scroll.style.display ="block";
scroll2.style.display = "none";

var arr = window.location.pathname.split("/");

let roomName;
var userlist;

/*

*/
function addusers(users) {
  console.log(users);
  userlist = users;

}
function visitorscreen() {
  scroll.style.display = "none";
  scroll2.style.display = "block";
  console.log(socket["users"]);
  

  var userdiv = document.getElementById("msg-field2")
  userlist.forEach(user=>{
    var scrollp = document.createElement("p");
    scrollp.style.backgroundColor = "red";
    scrollp.innerHTML = user;
    userdiv.appendChild(scrollp);
  
  })





  console.log(roomName);
}

function chatscreen() {
  scroll.style.display = "block";
  scroll2.style.display = "none";
}
function addMessage1(message) {
  //const ul = room.querySelector("ul");

  var div = document.getElementById("msg-field");
  var btn = document.createElement("p");
  btn.className = "hello";

  btn.style.float = "right";
  btn.innerHTML = message;

  div.appendChild(btn);

  btn.style.clear = "right";

  var objDiv = document.getElementById("msg-field");
  objDiv.scrollTop = objDiv.scrollHeight;
}

function addMessage2(message) {
  var div = document.getElementById("msg-field");
  var btn = document.createElement("p");
  btn.className = "hello";
  btn.innerHTML = message;
  btn.style.backgroundColor = "#f8e896";
  div.appendChild(btn);

  btn.style.clear = "right";

  var objDiv = document.getElementById("msg-field");
  objDiv.scrollTop = objDiv.scrollHeight;
}

room.hidden = true;

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg textarea");
  const intputvalue = input.value;

  socket.emit("new_message", input.value, roomName, () => {
    addMessage1(`You: ${intputvalue}`);
  });
  console.log("front");
  console.log(roomName);
  console.log(input.value);
  console.log(socket.roomName);
  console.log(socket);

  input.value = "";
}
async function handleNicknameSubmit(event) {
  //event.preventDefault();
  //const input = room.querySelector("#name input");
  var inputvalue;

  if(arr[2]==="enterRoom"){
    inputvalue = await window.location.pathname.split("/")[6];
    console.log(inputvalue);
  }else if(arr[2]==="createRoom"){
    inputvalue = await window.location.pathname.split("/")[5];
    console.log(inputvalue);
  } 
  await socket.emit("nickname", inputvalue);

}


async function showRoom(msg) {
  welcome.hidden = true;
  room.hidden = false;
  console.log("entered room");
  const msgForm = room.querySelector("#msg");
  const nameForm = room.querySelector("#name");


  msgForm.addEventListener("submit", handleMessageSubmit);
  await handleWelcomeSubmit();
}

async function handleRoomSubmit(event) {
  //event.preventDefault();
  const input = form.querySelector("#roomname");
  //const nickname = form.querySelector("#nickname");
  if(arr[2]==="enterRoom"){
    roomName = await window.location.pathname.split("/")[7];
    console.log(roomName);
  }else if(arr[2]==="createRoom"){
    roomName = await window.location.pathname.split("/")[6];
    console.log(roomName);
  }  
  socket.emit("enter_room", roomName, showRoom);
  input.value = "";
  //h3.innerText = `Room ${roomName}`;
}
window.onload=async function(){
  await handleNicknameSubmit();
  await handleRoomSubmit();
}



function tmpConsole(){
  console.log('test');	// test
}


form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
  addMessage2(`${user}님 도착`);
});

socket.on("bye", (left) => {
  addMessage2(`${left}님 나감 `);
});

socket.on("new_message",(msg)=>{
  console.log("new_message_recived")
  console.log(msg);
  addMessage2(msg)}
  );

socket.on("users", (users) => {
  addusers(users);
  console.log("userlist");
  console.log(users);
});



call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;
let myPeerConnection;
let myDataChannel;

async function getMedia(deviceId) {
  const initialConstrains = {
    audio: true,
    video: false,
  };
  const cameraConstraints = {
    audio: true,
  };
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstraints : initialConstrains
    );
    myFace.srcObject = myStream;
  } catch (e) {
    console.log(e);
  }
}
function handleMuteClick() {
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));

  var mutetext = document.getElementById("mutetext");
  if (!muted) {
    mutetext.innerText = "음소거";
    muted = true;
  } else {
    mutetext.innerText = "작동중";
    muted = false;
  }
}

var musicstart = false;


function handleMusicClick() {
  if(musicstart == false){

    if(muted==false){
      musicstart = true;
      startRecording();
    }else{
      console.log("음소거상태");
      alert("음소거 상태입니다! 마이크를 켜주세요")
    }
    

  }else{
    musicstart = false;
    stopRecording();
  }
  var musictext = document.getElementById("musictext");
  if (musicstart) {
    musictext.innerText = "녹음중";
  } else {
    musictext.innerText = "중단중";
  }
}



async function initCall() {
  call.hidden = true;
  await getMedia();
  makeConnection();
}

async function handleWelcomeSubmit(event) {
  await initCall();
}

socket.on("welcome", async () => {
  myDataChannel = myPeerConnection.createDataChannel("chat");
  myDataChannel.addEventListener("message", (event) => console.log(event.data));
  console.log("made data channel");
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  console.log("sent the offer");
  socket.emit("offer", offer, roomName);
});

socket.on("offer", async (offer) => {
  myPeerConnection.addEventListener("datachannel", (event) => {
    myDataChannel = event.channel;
    myDataChannel.addEventListener("message", (event) =>
      console.log(event.data)
    );
  });
  console.log("received the offer");
  myPeerConnection.setRemoteDescription(offer);
  const answer = await myPeerConnection.createAnswer();
  myPeerConnection.setLocalDescription(answer);
  socket.emit("answer", answer, roomName);
  console.log("sent the answer");
});

socket.on("answer", (answer) => {
  console.log("received the answer");
  myPeerConnection.setRemoteDescription(answer);
});

socket.on("ice", (ice) => {
  console.log("received candidate");
  myPeerConnection.addIceCandidate(ice);
});

// RTC Code

function makeConnection() {
  myPeerConnection = new RTCPeerConnection({
    iceServers: [
      {
        urls: [
          "stun:stun.l.google.com:19302",
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
          "stun:stun3.l.google.com:19302",
          "stun:stun4.l.google.com:19302",
        ],
      },
    ],
  });
  myPeerConnection.addEventListener("icecandidate", handleIce);
  myPeerConnection.addEventListener("addstream", handleAddStream);
  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
}

function handleIce(data) {
  console.log("sent candidate");
  socket.emit("ice", data.candidate, roomName);
}

function handleAddStream(data) {
  const peerFace = document.getElementById("peerFace");
  peerFace.srcObject = data.stream;
}







/* ----------------*/

//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream;              //stream from getUserMedia()
var rec;                    //Recorder.js object
var input;                  //MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb.
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //new audio context to help us record


//add events to those 2 buttons

function startRecording() {
    console.log("recordButton clicked");

    // Disable the record button until we get a success or fail from getUserMedia()

    navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(function(stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

        audioContext = new AudioContext({sampleRate: 16000});

        // assign to gumStream for later use
        gumStream = stream;

        // use the stream
        input = audioContext.createMediaStreamSource(stream);

        // Create the Recorder object and configure to record mono sound (1 channel) Recording 2 channels will double the file size
        rec = new Recorder(input, {numChannels: 1})

        //start the recording process
        rec.record()

        console.log("Recording started");

    }).catch(function(err) {
        //enable the record button if getUserMedia() fails
        recordButton.disabled = false;
        stopButton.disabled = true;
    });
}
function stopRecording() {
    console.log("stopButton clicked");

    //disable the stop button, enable the record too allow for new recordings
 

    //tell the recorder to stop the recording
    rec.stop(); //stop microphone access
    gumStream.getAudioTracks()[0].stop();

    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {
    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    var li = document.createElement('li');
    var link = document.createElement('a');

    console.log(blob);

    console.log(url);

    //name of .wav file to use during upload and download (without extension)
    var filename = new Date().toISOString();

    //add controls to the <audio> element
    au.controls = true;
    au.src = url;

    //save to disk link
    link.href = url;
    link.download = filename+".wav"; //download forces the browser to download the file using the  filename
    link.innerHTML = "Save to disk";

    console.log(filename+".wav");


    var formdata = new FormData();
formdata.append("title", "1");
formdata.append("singer", "1");
formdata.append("track", blob, "a98796cc-5c17-4e14-99ad-ec953cb14633.wav");

var requestOptions = {
  method: 'POST',
  body: formdata,
  redirect: 'follow'
};

fetch("http://localhost:5002/audio", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

 
}