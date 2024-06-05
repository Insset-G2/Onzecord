const { createServer } = require( "node:http");
const next = require( "next" );
const { Server } = require( "socket.io" );
const LoremIpsum = require("lorem-ipsum").LoremIpsum;

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 8080;

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
    console.log( "New connection", socket.id );
    socket.on("getServers", () => {
      sendServer( socket );
    });

    socket.on( "joinChannel", ({ serverID, channelID, user }) => {

        console.log( socket.id, "joinChannel", serverID, channelID, user.username)

        socket.join( `${ serverID }/${ channelID }` );
        users[ socket.id ] = { serverID, channelID, user };

        io.emit(
            "joinChannel", {
                users: Object
                    .values( users )
                    .filter( u => u.serverID === serverID && u.channelID === channelID )
                    .map( u => u.user )
            }
        );
    });

    socket.on( "getMessages", ( { serverID, channelID } ) => {

        console.log( "getMessages", serverID, channelID )

        socket.emit( "getMessages", {
            serverID, channelID, messages: messages?.[ serverID ]?.[ channelID ] || [ ]
        });

    });

    socket.on( "sendMessage", ({ serverID, channelID, message, author }) => {

        console.log( "sendMessage", serverID, channelID, message, author )

        if( !messages[ serverID ] )
            messages[ serverID ] = { };

        if( !messages[ serverID ][ channelID ] )
            messages[ serverID ][ channelID ] = [ ];

        messages[ serverID ][ channelID ].push({
            message,
            author,
            timestamp: Date.now(),
        });

        io.to(
            `${ serverID }/${ channelID }`
        ).emit( "newMessage", {
            serverID, channelID, content: {
                message,
                author,
                timestamp: Date.now(),
            }
        });
    })

    socket.on("disconnect", () => {
      delete users[ socket.id ];
      io.emit( "joinChannel", {
        users: Object.values( users ).map( u => u.user )
      });
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
