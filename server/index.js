const { createServer } = require( "node:http");
const next = require( "next" );
const { Server } = require( "socket.io" );
const LoremIpsum = require("lorem-ipsum").LoremIpsum;

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

/* At this moment, we don't have data persistence, so we will store the messages in memory,
   yes, i"m aware that this is not a good idea... */

const messages  = { }
    , users     = { }

app.prepare().then(() => {

  const httpServer = createServer( handler );

  const io = new Server(httpServer);

  function sendServer( socket ) {
    return socket.emit( "getServers", { servers: [{
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
    }] });


  }

  io.on( "connection", ( socket ) => {

    socket.on("getServers", () => {
      sendServer( socket );
    });

    socket.on( "joinChannel", ({ serverID, channelID }) => {
        console.log( `Socket ${socket.id} joined ${serverID}/${channelID}` );
        socket.join( `${serverID}/${channelID}` );
    });

    socket.on( "getMessages", ( { serverID, channelID } ) => {

      const sentences = Math.floor(Math.random() * 30) + 10;
      const texts = Array.from({ length: sentences }, () => lorem.generateWords( sentences ));
      const messages = texts.map( ( content, index ) => ({
        id: index,
        content,
        author: {
          id: [1, 2, 3][Math.floor(Math.random() * 3) ],
          username: "User [" + Math.random().toString(36).substring(7) + "]",
          image: `https://avatar.vercel.sh/${Math.random().toString(36).substring(7)}`
        },
        timestamp: Date.now(),

      }) );

      socket.emit( "getMessages", { serverID, channelID, messages });

    });

    socket.on( "sendMessage", ({ serverID, channelID, message, author }) => {

      const reply = {
        id: Math.floor(Math.random() * 1000),
        message,
        author: {
          id: [1, 2, 3][Math.floor(Math.random() * 3) ],
          username: "User [" + Math.random().toString(36).substring(7) + "]",
          image: `https://avatar.vercel.sh/${Math.random().toString(36).substring(7)}`
        },
        timestamp: Date.now(),
      };
       console.log( reply )
      console.log( `Send message to ${serverID}/${channelID}` );
      io.to( `${serverID}/${channelID}` ).emit( "newMessage", { serverID, channelID, reply });
    })

    socket.on("disconnect", () => {
      delete users[ socket.id ];
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});


// Generate lorem ipsum messages
const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  }
});



function generateMessage( ) {
  const sentences = Math.floor(Math.random() * 10) + 4;
  return lorem.generateWords( sentences );
}