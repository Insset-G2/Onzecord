"use client"

import { createContext, useState, useMemo, useEffect } from "react";
import { useWebsocket } from "@/hooks/useWebsocket";
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
    } ) => { },
    getMessages: ( serverID: string, channelID: string ) => { }
});


export interface Message {
    id: string;
    author: {
        id: string;
        username: string;
        image: string;
    }
    content: string;
    timestamp: string;
}

export const ContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [ messages, setMessages ] = useState<Message[ ]>( [ ] );
    const [ contextValue, setContextValue ] = useState( {
        servers: [ ],
        users: [ ],
        selectedServer: null,
        selectedChannel: null,
    } );
    const socket = useWebsocket( "ws://localhost:3000" );

    socket?.on( "connect", ( ) => {
        socket.emit( "getServers" )
    })

    socket?.on( "getServers", ( value ) => {
        console.log( "Got servers:", value)
        setContextValue((contextValue: any) => {
            return {
                ...contextValue,
                servers: value.servers
            }
        });
    })

    function sendMessage(
        serverID: string,
        channelID: string,
        message: string,
        author: {
            username: string;
            image: string;
        }
    ) {
        socket?.emit( "sendMessage", { serverID, channelID, message, author } );
    }

    function getMessages( serverID: string, channelID: string ) {
        socket?.emit( "getMessages", { serverID, channelID } );
    }

    function joinChannel( serverID: string, channelID: string ) {
        socket?.emit( "joinChannel", { serverID, channelID } );
    }

    function getServers( server: string ) {
        socket?.emit( "getServers", { server } );
    }

    socket?.on( "getMessages", ( value ) => {
        setMessages( value.messages );
    })

    socket?.on("newMessage", (value: { reply: Message } ) => {
        console.log( "Got new message:", value )
        setMessages([
            ...messages,
            value.reply
        ])
    })

    return (
        <Context.Provider value={{
            contextValue,
            setContextValue,
            messages,
            user: {
                username: Math.random().toString(36).substring(7),
                description: "",
                image: "https://bla.com",
            },
            users: [{
                username: "Jérémy",
                description: "Hello, this is a description",
                id: "1",
                image: "https://bla.com",
            }],
            sendMessage,
            getMessages,
            joinChannel,
            socket
        }}>
            { children }
        </Context.Provider>
    );

};