import * as Colyseus from "colyseus.js";
import "regenerator-runtime/runtime";

/*================================================
| Array with current online players
*/
let onlinePlayers = [];

/*================================================
| Colyseus connection with server
*/
console.log(window.location.pathname);

var client = new Colyseus.Client("ws://localhost:3000");

var roomname2;

let room = client
  .joinOrCreate(window.location.pathname)
  .then(async (room) => {
    await console.log("room created !!!!!");

    roomname2 = await window.location.pathname;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      roomname: roomname2,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:3000/apicheck2", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));

    return await room;
    /*
    console.log("front 1")
    console.log(room)
    console.log("front 2")
    console.log(room.name);
    console.log("front 3")
    console.log((room.onMessage((data)=>console.log(data))))
    console.log("front 4")
    console.log(room.sessionId, "joined", room.name);
*/
  })
  .catch((e) => {
    console.log("JOIN ERROR", e);
    console.log("error created");
  });

export { onlinePlayers, room };
