const { createServer } = require("node:http");
const next = require("next");
const { Server } = require("socket.io");
const fs = require("fs");
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 8080;

const app = next({
  dev,
  hostname,
  port
});

const handler = app.getRequestHandler();

/* At this moment, we don't have data persistence, so we will store the messages in memory,
   yes, i"m aware that this is not a good idea... */

const messages = {},
  users = {}

app.prepare().then(() => {

  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  function sendServer(socket) {
    return socket.emit("getServers", {
      servers: [{
        id: 1,
        name: "Server 1",
        channels: [{
          id: 1,
          name: "Channel 1",
        }, {
          id: 2,
          name: "Channel 2",
        }, {
          id: 3,
          name: "Channel 3",
        }],
      }, {
        id: 2,
        name: "Server 2",
        channels: [{
          id: 1,
          name: "Channel 2.1",
        }, {
          id: 2,
          name: "Channel 2.2",
        }],
      }, {
        id: 3,
        name: "Server 3",
        channels: [{
          id: 1,
          name: "Channel 3.1",
        }, {
          id: 2,
          name: "Channel 3.2",
        }],
      }]
    });
  }

  function addMessage({
    serverID,
    channelID,
    message,
    author,
    files = []
  }) {

    if (!messages[serverID])
      messages[serverID] = {};

    if (!messages[serverID][channelID])
      messages[serverID][channelID] = [];

    messages[serverID][channelID].push({
      message,
      author,
      timestamp: Date.now(),
      files
    });

    io.to(
      `${ serverID }/${ channelID }`
    ).emit("newMessage", {
      serverID,
      channelID,
      content: {
        message,
        author,
        timestamp: Date.now(),
        files
      }
    });

  }

  io.on("connection", (socket) => {

    socket.on("getServers", () => {
      sendServer(socket);
    });

    socket.on("joinChannel", ({
      serverID,
      channelID,
      user
    }) => {

      const oldChannel = users[socket.id]?.channelID,
        oldServer = users[socket.id]?.serverID;

      if (oldChannel && oldServer) {
        io.to(`${oldServer}/${oldChannel}`).emit("joinChannel", {
          users: Object.entries(users)
            .filter(([id, u]) => u.serverID === oldServer && u.channelID === oldChannel && id !== socket.id)
            .map(([_, u]) => u.user),
        });
        socket.leave(`${oldServer}/${oldChannel}`);
      }
      users[socket.id] = {
        serverID,
        channelID,
        user
      };
      socket.join(`${ serverID }/${ channelID }`);

      io.to(`${ serverID }/${ channelID }`).emit(
        "joinChannel", {
          users: Object
            .values(users)
            .filter(u => u.serverID === serverID && u.channelID === channelID)
            .map(u => u.user)
        }
      );
    });

    socket.on("getMessages", ({
      serverID,
      channelID
    }) => {
      socket.emit("getMessages", {
        serverID,
        channelID,
        messages: messages?.[serverID]?.[channelID] || []
      });
    });

    socket.on("sendMessage", ({
      serverID,
      channelID,
      message,
      author,
      files
    }) => {
      console.log(files);
      addMessage({
        serverID,
        channelID,
        message,
        author,
        files
      });
    })

    socket.on("disconnect", () => {
      delete users[socket.id];
      io.emit("joinChannel", {
        users: Object.values(users).map(u => u.user)
      });
    });

    socket.on("createReminder", ({
      serverID,
      channelID,
      author,
      reminder,
      description,
      time
    }) => {

      fetch(`${ process.env.REMINDER_URL }/reminder/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: reminder,
            trigger_time: time,
            description
          })

        })
        .then(resp => resp.json())
        .then(resp => {
          socket.emit("reminderAdded", {
            reminder,
            description,
            time,
            resp
          });

          addMessage({
            serverID,
            channelID,
            message: `${ author } created a reminder: ${ reminder } at ${ new Date( time ).toLocaleString() }`,
            author: {
              username: "Reminder",
              image: "https://cdn.discordapp.com/attachments/1181959975455694878/1248572504348557394/g4.png?ex=66642742&is=6662d5c2&hm=f5efea630ab597a5d4d33513980947fa2990d767f9e150003282794f762b8d3f&"
            }
          });
        })
        .catch(err => {
          socket.emit("reminderAdded", {
            reminder,
            description,
            time,
            error: err
          })
          addMessage({
            serverID,
            channelID,
            message: `${ author } created a reminder: ${ reminder } at ${ new Date( time ).toLocaleString() }`,
            author: {
              username: "Reminder",
              image: "https://cdn.discordapp.com/attachments/1181959975455694878/1248572504348557394/g4.png?ex=66642742&is=6662d5c2&hm=f5efea630ab597a5d4d33513980947fa2990d767f9e150003282794f762b8d3f&"
            }
          });
        });
    });

    socket.on("getCryptoGraphs", ({
      serverID,
      channelID,
      crypto
    }) => {

      fetch(`${ process.env.CRYPTO_URL }/graph/${ crypto }`)
        .then(resp => {
          if (resp.ok)
            return resp.blob();
          throw new Error("Crypto not found");
        })
        .then(async resp => {
          fs.writeFileSync(`./uploads/${ crypto }.png`, await resp.arrayBuffer());
          addMessage({
            serverID,
            channelID,
            message: `Here is the graph for ${ crypto }`,
            author: {
              username: "Crypto",
              image: "https://cdn.discordapp.com/attachments/1181959975455694878/1248572504348557394/g4.png?ex=66642742&is=6662d5c2&hm=f5efea630ab597a5d4d33513980947fa2990d767f9e150003282794f762b8d3f&"
            },
            files: [ `${ crypto }.png` ]
          });
        })
        .catch(err => {
          console.log(err)
          addMessage({
            serverID,
            channelID,
            message: `Oops, something went wrong while trying to get the graph for ${ crypto }`,
            author: {
              username: "Crypto",
              image: "https://cdn.discordapp.com/attachments/1181959975455694878/1248572504348557394/g4.png?ex=66642742&is=6662d5c2&hm=f5efea630ab597a5d4d33513980947fa2990d767f9e150003282794f762b8d3f&"
            }
          });
        });
      });

  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${ hostname }:${ port }`);
    });
});