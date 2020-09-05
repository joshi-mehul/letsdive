const express = require("express");
const app = express();
const port = 8002;
const server = require("http").Server(app);
const io = require("socket.io")(server);
const cors = require("cors");
const md5 = require('md5');

const rooms = new Map();
const users = new Map();
const clients = {};

app.use(cors());

/*
 * Turn the map<String, Object> to an Object so it can be converted to JSON
 */
function mapToObj(inputMap) {
    let obj = {};

    inputMap.forEach(function (value, key) {
        obj[key] = value;
    });

    return obj;
}


io.on("connection", function (client) {

    client.on('select-or-add-room', (event) => {
        if (event.roomName) {
            let roomId = md5(event.roomName);
            let userId = md5(event.userName);
            let roomMembers;
            if (rooms.has(roomId)) {
                roomMembers = rooms.get(roomId).roomMembers ? rooms.get(roomId).roomMembers : new Map();
            } else {
                roomMembers = new Map();
            }

            if (rooms.has(roomId)) {
                if (roomMembers.has(userId)) {
                    if (users.has(userId)) {
                        roomMembers.set(userId, users.get(userId))
                    } else {
                        users.set(userId, {id: userId, name: event.userName})
                        roomMembers.set(userId, users.get(userId))
                    }
                } else {
                    roomMembers.set(userId, {id: userId, name: event.userName})
                }
            } else {
                if (users.has(userId)) {
                    roomMembers.set(userId, users.get(userId))
                } else {
                    users.set(userId, {id: userId, name: event.userName})
                    roomMembers.set(userId, users.get(userId))
                }
            }
            rooms.set(roomId, {name: event.roomName, roomMembers});
            if(clients[userId] === undefined) {
                clients[userId] = client;
            }
            client.emit("select-or-add-room", {
                id: roomId,
                name: event.roomName,
                members: mapToObj(roomMembers),
                userName: event.userName
            })
            roomMembers.forEach((value, key) => {
                if(clients[key]) {
                    clients[key].emit("feed", {
                        id: roomId,
                        message: `${event.userName} joined this room`,
                    })
                }
            })
        }
    })



    client.on('add-to-playlist', (event) => {
        const roomId = md5(event.roomName);
        const room = rooms.get(roomId);
        room.playlist = room.playlist || [];
        let response;
        if (room.playlist.length === 8) {
            response = { removed: room.playlist.shift(), added: event.youtubeURL};
            room.playlist.push(event.youtubeURL)
        } else {
            response = { removed: null, added: event.youtubeURL};
            room.playlist.push(event.youtubeURL)
        }
        if(room && room.roomMembers) {
            room.roomMembers.forEach((value, key) => {
                if(clients[key]) {
                    clients[key].emit("add-to-playlist", response)
                }
            })
        }
    });

    client.on('feed', (event) => {
        const roomId = md5(event.roomName);
        const room = rooms.get(roomId);
        if(room && room.roomMembers) {
            room.roomMembers.forEach((value, key) => {
                if(clients[key]) {
                    clients[key].emit("feed", {
                        id: roomId,
                        message: event.message,
                        userName: event.userName
                    })
                }
            })
        }
    });

    client.on("disconnect", function () {
        if (!client.user_id || !clients[client.user_id]) {
            return;
        }
        let targetClients = clients[client.user_id];
        for (let i = 0; i < targetClients.length; ++i) {
            if (targetClients[i] == client) {
                targetClients.splice(i, 1);
            }
        }
    });
});

server.listen(port, () =>
    console.log(`Example app listening on port ${port}!`)
);
