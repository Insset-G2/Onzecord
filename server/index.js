const { createServer } = require("node:http");
const next = require("next");
const { Server } = require("socket.io");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
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

const messages = {}
    , users    = {}

app.prepare().then(() => {

    console.log( process.env.NODE_ENV )

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
      time,
      email
    }) => {

      fetch(`${ process.env.NEXT_PUBLIC_REMINDER_URL }/reminder/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: reminder,
            trigger_time: time,
            description,
            email
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
            message: `**${ author }** created a reminder **${ reminder }** for **${ new Date( time ).toLocaleString() }**\n\n**Description:**\n${ description }\n\n${ email ? `A reminder email will be sent to **${ email }**` : "" }\n\n**ID:** \`${ resp.reminder.id }\``,
            author: {
              username: "Reminder",
              image: "/bot.png"
            }
          });
        })
        .catch(err => {

            console.error( err )

          socket.emit("reminderAdded", {
            reminder,
            description,
            time,
            error: err
          })

          addMessage({
            serverID,
            channelID,
            message: `${ author } tried to create a reminder: ${ reminder } at ${ new Date( time ).toLocaleString() } but failed`,
            author: {
              username: "Reminder",
              image: "/bot.png"
            }
          });
        });
    });

    socket.on( "getReminders", ({
        serverID,
        channelID
    }) => {

      fetch(`${ process.env.NEXT_PUBLIC_REMINDER_URL }/reminders/list`)
          .then(resp => resp.json())
          .then(resp => {

              addMessage({
                  serverID,
                  channelID,
                  message: resp.length === 0 ? "There are no reminders" : `Here are the reminders:\n${ resp.map( ( r, i )  => `${ i + 1 }. **${ r.title }** at **${ new Date( r.trigger_time ).toLocaleString() }**` ).join(",\n") }`,
                  author: {
                      username: "Reminder",
                      image: "/bot.png"
                  }
              });
          })
          .catch(err => {
              console.error(err);
          });

    });

    socket.on("deleteReminder", ({
      serverID,
      channelID,
      reminder
    }) => {

      fetch(`${ process.env.NEXT_PUBLIC_REMINDER_URL }/reminder/delete/${ reminder }`, {
          method: "DELETE"
        })
        .then(resp => resp.json())
        .then(resp => {

          addMessage({
            serverID,
            channelID,
            message: `Reminder **${ reminder }** has been deleted`,
            author: {
              username: "Reminder",
              image: "/bot.png"
            }
          });

        })
        .catch(err => {
          console.error(err);
          addMessage({
            serverID,
            channelID,
            message: `Failed to delete the reminder **${ reminder }**`,
            author: {
              username: "Reminder",
              image: "/bot.png"
            }
          });
        });

    });

    socket.on("updateReminder", ({
      serverID,
      channelID,
      author,
      reminder,
      title,
      description,
      time,
      email
    }) => {
      console.log( reminder )
      fetch(`${ process.env.NEXT_PUBLIC_REMINDER_URL }/reminder/update/${ reminder }`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title,
            description,
            trigger_time: time,
            email
          })
        })
        .then(resp => resp.json())
        .then(resp => {

          addMessage({
            serverID,
            channelID,
            message: `Reminder **${ title }** has been updated,\n\n**Description:**\n${ description }\n\n**Time:** ${ new Date( time ).toLocaleString() }\n\n**ID:** \`${ reminder }\``,
            author: {
              username: "Reminder",
              image: "/bot.png"
            }
          });

        })
        .catch(err => {
          console.error(err);
          addMessage({
            serverID,
            channelID,
            message: `Failed to update the reminder **${ reminder }**`,
            author: {
              username: "Reminder",
              image: "/bot.png"
            }
          });
        });

    });

    socket.on("getCryptoGraphs", async ({
      serverID,
      channelID,
      crypto
    }) => {


      await fetch(`${process.env.NEXT_PUBLIC_CRYPTO_URL}/graph/${crypto}`)
        .then(resp => resp.text())
        .then(async text => {

          const src    = text.match(/src="(.+?)"/)[1],
                base64 = src.split(",")[1];

            const storage = new Storage({
                keyFilename: path.join( process.cwd(), "/onzecord-425916-54811c9a72a4.json" ),
            });

        const bucket = storage.bucket( `${ process.env.GCP_BUCKET_NAME }` );

        const buffer = Buffer.from( base64, "base64" );

        await new Promise( ( resolve, reject ) => {

            const file = bucket.file( `${ crypto }.png` );
            const writeStream = file.createWriteStream();

            writeStream.on( "error", ( error ) => {
                console.error( error );
                reject( error );
            });

            writeStream.on( "finish", () => {
                resolve( true );
            });

            writeStream.write( buffer );
            writeStream.end();

        });


          addMessage({
            serverID,
            channelID,
            author: {
              username: "Crypto",
              image: "/bot.png"
            },
            message: `Here is the graph for ${crypto}`,
            files: [`${crypto}.png`],
          });
        })
        .catch(err => {
          console.error(err);
          addMessage({
            serverID,
            channelID,
            author: {
              username: "Crypto",
              image: "/bot.png"
            },
            message: `Failed to get the graph for ${crypto}`,
          });

        })

      });

    socket.on( "getCryptoValues", ({
        serverID,
        channelID,
    }) => {

        fetch(`${ process.env.NEXT_PUBLIC_CRYPTO_URL }/cryptodata`)
            .then(resp => resp.json())
            .then(resp => {
                console.log( resp )
                addMessage({
                    serverID,
                    channelID,
                    author: {
                        username: "Crypto",
                        image: "/bot.png"
                    },
                    message: `Here are the values for the cryptos ( euro € ) : \n ${ Object.entries( resp ).map( ([ key, value ]) => `- ${ key.charAt(0).toUpperCase() + key.slice(1) }: ${ value }€` ).join( "\n" ) }`,
                });
            })
            .catch(err => {
                console.log(err)
                addMessage({
                    serverID,
                    channelID,
                    author: {
                        username: "Crypto",
                        image: "/bot.png"
                    },
                    message: `Failed to get the values for ${ crypto }`,
                });
            });
        });

        socket.on( "updateUser", ({
            username,
            description,
        }) => {

            if ( !users[socket.id] )
                return;

            users[socket.id].user = {
                ...users[socket.id],
                username,
                description
            };
            io.emit("joinChannel", {
                users: Object.values(users).map(u => u.user)
            });
        });

        socket.on( "searchYoutube", ({
            serverID,
            channelID,
            query
        }) => {

            fetch( `${ process.env.NEXT_PUBLIC_YOUTUBE_URL }/search?query=${ query }` )
                .then( resp => resp.json() )
                .then( resp => {

                    addMessage({
                        serverID,
                        channelID,
                        author: {
                            username: "Youtube",
                            image: "/bot.png"
                        },
                        message: `Here are the videos for the query ${ query } : \n ${ resp?.youtube_results?.map( ( r, i ) => `${ i + 1 }. [${ r.title }](${ r.url })` ).join( ",\n" ) }\n\n**Click on the title to watch the videos**`,
                    });

                })
                .catch(err => {
                    console.error(err);
                    addMessage({
                        serverID,
                        channelID,
                        author: {
                            username: "Youtube",
                            image: "/bot.png"
                        },
                        message: `Failed to get the videos for \`${ query }\``,
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