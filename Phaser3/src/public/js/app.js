const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
const h3 = room.querySelector("h3");

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

room.hidden = true;

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");

  const intputvalue = input.value;

  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${intputvalue}`);
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

  socket.emit("enter_room", input.value, nickname.value, showRoom);

  roomName = input.value;
  input.value = "";
  h3.innerText = `Room ${roomName}`;
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
  addMessage(`${user} arrived`);
});

socket.on("bye", (left) => {
  addMessage(`${left} left `);
});

socket.on("new_message", addMessage);
