const socket = io();

console.log(socket);
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
//const h3 = room.querySelector("h3");

const scroll = document.getElementById("scroll");
const scroll2 = document.getElementById("scroll2");

scroll2.style.display = "block";

let roomName;

function addusers(users) {
  console.log(users);
  var scrollp = document.createElement("p");
  scrollp.style.backgroundColor = "red";
  scrollp.innerHTML = users;
  scroll2.appendChild(scrollp);
}

function visitorscreen() {
  scroll.style.display = "none";
  scroll2.style.display = "block";
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
  const input = room.querySelector("#msg input");

  const intputvalue = input.value;

  socket.emit("new_message", input.value, roomName, () => {
    addMessage1(`You: ${intputvalue}`);
  });
  input.value = "";
}
function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#name input");
  const intputvalue = input.value;
  socket.emit("nickname", input.value);
}

function showRoom(msg) {
  welcome.hidden = true;
  room.hidden = false;
  console.log("entered room");
  const msgForm = room.querySelector("#msg");
  const nameForm = room.querySelector("#name");
  msgForm.addEventListener("submit", handleMessageSubmit);
  nameForm.addEventListener("submit", handleNicknameSubmit);
  handleWelcomeSubmit();
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("#roomname");
  const nickname = form.querySelector("#nickname");

  socket.emit("enter_room", input.value, showRoom);

  roomName = input.value;
  input.value = "";
  //h3.innerText = `Room ${roomName}`;
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
  addMessage2(`${user}님 도착`);
});

socket.on("bye", (left) => {
  addMessage2(`${left}님 나감 `);
});

socket.on("new_message", addMessage2);

socket.on("users", (users) => {
  addusers(users);
});

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");
const call = document.getElementById("call");

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
  if (!muted) {
    muteBtn.innerText = "Unmute";
    muted = true;
  } else {
    muteBtn.innerText = "Mute";
    muted = false;
  }
}
muteBtn.addEventListener("click", handleMuteClick);

async function initCall() {
  call.hidden = false;
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
