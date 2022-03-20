const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
//const room = document.getElementById("room");
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
