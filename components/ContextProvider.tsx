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
    message: string;
    timestamp: string;
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
    const socket = useWebsocket( "ws://localhost:8080" );

    useEffect(() => {

        if( contextValue.user.username && contextValue.user.username.length > 0 )
            socket?.connect( )
        else
            return;

        socket?.on("connect", () => {
            console.log("Connected to server")
            socket.emit("getServers")
        })

        socket?.on("getServers", (value) => {
            setContextValue((contextValue: any) => {
                return {
                    ...contextValue,
                    servers: value.servers
                }
            });
        })

        socket?.on("joinChannel", ({ users }) => {

            setContextValue((contextValue: any) => ({
                ...contextValue,
                users: users
            }))
        })

        socket?.on("getMessages", (value) => {
            console.log("Got messages from server")
            setMessages(value.messages);
        })

        socket?.on("newMessage", (value: { content: Message }) => {

            setMessages([
                ...messages,
                value.content
            ])
        })

    }, [contextValue, contextValue.user, messages, socket])

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
        socket?.emit( "joinChannel", { serverID, channelID, user: contextValue.user })
    }

    function getServers( server: string ) {
        socket?.emit( "getServers", { server } );
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
            socket
        }}>
            { children }
        </Context.Provider>
    );

};