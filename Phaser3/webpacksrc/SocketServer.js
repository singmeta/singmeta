import * as Colyseus from "colyseus.js";

/*================================================
| Array with current online players
*/
let onlinePlayers = [];

/*================================================
| Colyseus connection with server
*/
console.log(window.location.pathname);

var client = new Colyseus.Client("ws://localhost:3000");

client.push("helloworld");

let room = client
  .joinOrCreate(window.location.pathname)
  .then((room) => {
    console.log("room created !!!!!");
    return room;
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
