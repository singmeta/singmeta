import * as Colyseus from "colyseus.js";

/*================================================
| Array with current online players
*/
let onlinePlayers = [];

/*================================================
| Colyseus connection with server
*/
console.log(window.location.pathname);

var client = new Colyseus.Client("ws://localhost:3002");
let room = client
  .joinOrCreate(window.location.pathname)
  .then((room) => {
    console.log(room.name);
    console.log(room.sessionId, "joined", room.name);
    return room;
  })
  .catch((e) => {
    console.log("JOIN ERROR", e);
  });

export { onlinePlayers, room };
