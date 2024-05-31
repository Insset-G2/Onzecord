const { createServer } = require( "node:http");
const next = require( "next" );
const { Server } = require( "socket.io" );
const LoremIpsum = require("lorem-ipsum").LoremIpsum;

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();


const users = { }

app.prepare().then(() => {

  const httpServer = createServer(handler);

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

  io.of( "/" ).adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
  });

  io.of( "/" ).adapter.on("leave-room", (room, id) => {
    console.log(`socket ${id} has left room ${room}`);
  });


  
  

  io.on( "connection", ( socket ) => {

  //  Get all rooms, and the users in each room
    const rooms = io.sockets.adapter.rooms;
    console.log( rooms )
    for ( const room in rooms ) {
      const usersInRoom = io.sockets.adapter.rooms.get( room );
      console.log( "Room: ", room, "Users: ", usersInRoom );
    }


    users[ socket.id ] = {
      socket,
    }

    socket.on("getServers", () => {
      sendServer( socket );
    });

    socket.on( "getMessages", ( { serverId, channelId } ) => {

      users[ socket.id ].serverId = serverId;
      users[ socket.id ].channelId = channelId;

      if ( users[ socket.id ].room )
        socket.leave( users[ socket.id ].room );
      socket.join( `${ serverId }/${ channelId }`);

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

      socket.emit( "getMessages", { serverId, channelId, messages });

    });

    socket.on( "sendMessage", ( { serverId, channelId, content } ) => {
      const message = {
        id: Math.floor(Math.random() * 1000),
        content,
        author: {
          id: [1, 2, 3][Math.floor(Math.random() * 3) ],
          username: "User [" + Math.random().toString(36).substring(7) + "]",
          image: `https://avatar.vercel.sh/${Math.random().toString(36).substring(7)}`
        },
        timestamp: Date.now(),
      };
      io.to( `${serverId}/${channelId}` ).emit("newMessage", { serverId, channelId, message });
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