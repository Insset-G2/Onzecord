"use client"

import { createContext, useState, useMemo, useEffect } from "react";
import { useWebsocket } from "@/hooks/useWebsocket";
import { toast } from "sonner";
export const Context = createContext({
    socket: null as any,
    contextValue: {
        servers: [ ],
        users: [ ],
        selectedServer: null,
        selectedChannel: null,
    },
    setContextValue: ( value: any ) => { },
    messages: [ ] as Message[ ],
    user: {
        username: "",
        description: "",
        image: "",
    },
    users: [ ] as {
        username: string;
        description: string;
        id: string;
        image: string;
    }[ ],
    joinChannel: ( server: string, channel: string ) => { },
    sendMessage: ( serverID: string, channelID: string, message: string, author: {
        username: string;
        image: string;
    }, files: [ ] ) => { },
    getMessages: ( serverID: string, channelID: string ) => { },
    createReminder: ( serverID: string, channelID: string, author: string, reminder: string, description: string, time: string ) => { },
    getReminder: ( serverID: string, channelID: string ) => { },
    getCryptoGraphs: ( serverID: string, channelID: string, crypto: string ) => { },
    getCryptoValues: ( serverID: string, channelID: string ) => { },
    updateUser: ({ username, description }: { username: string, description: string }) => { },
    searchYoutube: ( serverID: string, channelID: string, query: string ) => { },
});


export interface Message {
    id: string;
    author: {
        id: string;
        username: string;
        image: string;
    }
    message: string;
    timestamp: string;
    translated: string | null;
    files: string[ ];
}

export const ContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [ messages, setMessages ] = useState<Message[ ]>( [ ] );
    const [ contextValue, setContextValue ] = useState( {
        user: {
            username: "",
            description: "",
            image: "",
        },
        servers: [ ],
        users: [ ],
        selectedServer: null,
        selectedChannel: null,
    } );
    const socket = useWebsocket(
        process.env.NODE_ENV === "development" ? "http://localhost:8080" : "https://onzecord-425916.ew.r.appspot.com"
    );

    useEffect(() => {
        if( contextValue.user.username && contextValue.user.username.length > 0 )
            socket?.connect( )
    }, [contextValue.user.username, socket])

    useEffect( ( ) => {

        socket?.on( "connect", () => {
            socket.emit("getServers")
        })

        socket?.on( "getServers", (value) => {
            setContextValue((contextValue: any) => {
                return {
                    ...contextValue,
                    servers: value.servers
                }
            });
        })

        socket?.on( "joinChannel", ({ users }) => {

            setContextValue((contextValue: any) => ({
                ...contextValue,
                users: users
            }))

        })

        socket?.on( "getMessages", (value) => {
            console.log("Got messages from server")
            setMessages(value.messages);
        })

        socket?.on( "newMessage", (value: { content: Message }) => {
            setMessages([
                ...messages,
                value.content
            ])

        })

        socket?.on( "reminderAdded", ( value: { reminder: string, description: string, time: string } ) => {

            if ( "error" in value )
                return toast.error( "An error occurred while creating the reminder" );

            toast.success( `Reminder ${ value.reminder } created for ${ new Date( value.time ).toLocaleString( ) }` );

        })

        return ( ) => {
            socket?.off("getServers");
            socket?.off("joinChannel");
            socket?.off("getMessages");
            socket?.off("newMessage");
            socket?.off("reminderAdded");
        }

    }, [ socket, messages ])

    function sendMessage(
        serverID: string,
        channelID: string,
        message: string,
        author: {
            username: string;
            image: string;
        },
        files: string[ ]
    ) {
        socket?.emit( "sendMessage", { serverID, channelID, message, author, files } );
    }

    function getMessages( serverID: string, channelID: string ) {
        socket?.emit( "getMessages", { serverID, channelID } );
    }

    function joinChannel( serverID: string, channelID: string ) {
        socket?.emit( "joinChannel", { serverID, channelID, user: contextValue.user })
    }

    function getServers( server: string ) {
        socket?.emit( "getServers", { server } );
    }

    function createReminder( serverID: string, channelID: string, author: string, reminder: string, description: string, time: string ) {
        socket?.emit( "createReminder", { serverID, channelID, author, reminder, description, time } );
    }

    function getCryptoGraphs( serverID: string, channelID: string, crypto: string ) {
        socket?.emit( "getCryptoGraphs", { serverID, channelID, crypto } );
    }

    function getCryptoValues( serverID: string, channelID: string ) {
        socket?.emit( "getCryptoValues", { serverID, channelID } );
    }

    function getReminder( serverID: string, channelID: string ) {
        socket?.emit( "getReminder", { serverID, channelID } );
    }

    function updateUser({ username, description }: { username: string, description: string }) {
        socket?.emit("updateUser", { username, description });
        setContextValue({
            ...contextValue,
            user: {
                ...contextValue.user,
                image: `https://avatar.vercel.sh/${username}.png`,
                username: username,
                description: description
            }
        })
    }

    function searchYoutube( serverID: string, channelID: string, query: string ) {
        socket?.emit( "searchYoutube", { serverID, channelID, query } );
    }

    return (
        <Context.Provider value={{
            contextValue,
            setContextValue,
            messages,
            user : {
                username : "",
                description: "",
                image: "",
            },
            users: [ ],
            sendMessage,
            getMessages,
            joinChannel,
            socket,
            createReminder,
            getReminder,
            getCryptoGraphs,
            getCryptoValues,
            updateUser,
            searchYoutube,
        }}>
            { children }
        </Context.Provider>
    );

};