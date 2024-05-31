"use client"

import { redirect } from "next/navigation"
import { ChatHeader } from "@/components/ChatHeader"
import useContextProvider from "@/hooks/useContextProvider"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SendIcon } from "lucide-react"
import { Message as _Message } from "@/components/ContextProvider"

export default function Page({
    params: { serverID, channelID }
}: Readonly<{ params: { serverID: string, channelID: string } }>) {

    const { contextValue, setContextValue, 
        sendMessage,
        messages,
        getMessages,
        socket
    } = useContextProvider( );

    useEffect(() => {
        if( socket?.connected )
            getMessages( serverID, channelID )
    }, [ socket?.connected ])


    useEffect(() => {
        setContextValue((contextValue: any) => ({
            ...contextValue,
            selectedServer: serverID,
            selectedChannel: channelID
        }))
    }, [ serverID, channelID, setContextValue ])

    return (
        <>
            <div className="flex-1 overflow-y-auto p-12 space-y-5 max-h-[-webkit-fill-available]">
                { messages.map((message: _Message, index: number) => (
                    <Message key={ index } message={ message } />
                )) }
            </div>
            <SendMessage de={sendMessage} />
        </>
    )
}

function SendMessage( { de }: { de: ( channel: string, message: string, author: string ) => void } ) {
    console.log( "de" )
    const [ message, setMessage ] = useState( "" );
    return (
        <div className="flex items-center px-20 py-5 bg-neutral-900/95 gap-2">
            <Input
                placeholder="Enter your message..."
                value={ message }
                onChange={ ( e ) => setMessage( e.target.value ) }
                onKeyDown={ ( e ) => {
                    if( e.key === "Enter" )
                        de( "1", message, "1" )
                }}
            />
            <Button
                onClick={() => de( "1", "Hello, world!", "1" )}
                variant="secondary"
                disabled={ message.length === 0 }
            >
                <SendIcon className="h-4 w-4" />
            </Button>
        </div>
    )
}

function Message(
    { message }:
    { message: _Message }
    ) { 
        console.log( message )

        return (
            <div className="flex space-x-4 group">
                <div className="w-10 h-10 bg-neutral-800 rounded-full relative">
                    <img 
                        src={ message.author.image }
                        alt={ message.author.username }
                        className="w-10 h-10 rounded-full min-w-10 min-h-10"
                    />
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse absolute right-0 bottom-0"></div>
                </div>
                <div className="flex flex-col">
                    <p>{ message.author.username }
                        <span className="opacity-0 text-neutral-500 group-hover:!opacity-100">

                        </span>
                    </p>
                    <p className="text-neutral-500">{ message.content }</p>
                </div>
            </div>
        )
        

    }