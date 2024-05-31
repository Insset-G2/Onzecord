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
    users: [ ] as {
        username: string;
        description: string;
        id: string;
        image: string;
    }[ ],
    sendMessage: ( channel: string, message: string, author: string ) => { },
    getMessages: ( server: string, channel: string ) => { }
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
        channel: string,
        message: string,
        author: string
    ) {
        socket?.emit( "sendMessage", { channel, message, author } );
    }

    function getMessages( server: string, channel: string ) {
        socket?.emit( "getMessages", { server, channel } );
    }

    function getServers( server: string ) {
        socket?.emit( "getServers", { server } );
    }

    socket?.on( "getMessages", ( value ) => {
        setMessages( value.messages );
    })

    socket?.on( "newMessage", ( value: { message: Message } ) => {
        setMessages([
            ...messages,
            value.message
        ])
    })
    
    return (
        <Context.Provider value={{
            contextValue,
            setContextValue,
            messages,
            users: [{
                username: "Jérémy",
                description: "Hello, this is a description",
                id: "1",
                image: "https://bla.com",
            }],
            sendMessage,
            getMessages,
            socket
        }}>
            { children }
        </Context.Provider>
    );

};