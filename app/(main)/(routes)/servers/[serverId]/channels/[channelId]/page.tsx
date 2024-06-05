"use client"

import useContextProvider from "@/hooks/useContextProvider"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SendIcon } from "lucide-react"
import { Message as _Message } from "@/components/ContextProvider"
import Image from "next/image"

export default function Page({
    params: { serverID, channelID }
}: Readonly<{ params: { serverID: string, channelID: string } }>) {

    const { contextValue,
        setContextValue,
        sendMessage,
        user,
        messages,
        getMessages,
        joinChannel,
        socket
    } = useContextProvider( );

    useEffect(() => {
        if( socket?.connected )
            joinChannel( serverID, channelID )
            getMessages( serverID, channelID )
    }, [ socket?.connected ])


    useEffect(() => {
        setContextValue((contextValue: any) => ({
            ...contextValue,
            selectedServer: serverID,
            selectedChannel: channelID
        }))
    }, [ serverID, channelID, setContextValue ])

    useEffect(() => {
        console.log( messages )
    }, [ messages ])

    return (
        <>
            <div className="flex-1 overflow-y-auto p-12 space-y-5 max-h-[-webkit-fill-available]">
                { messages.map((message: _Message, index: number) => (
                    <Message key={ index } message={ message } />
                )) }
            </div>
            <SendMessage
                channel={channelID}
                server={serverID}
                author={contextValue.user}
                data={sendMessage}
            />
        </>
    )
}

function SendMessage( {
    channel: channelID,
    server: serverID,
    author,
    data
}: {
    channel: string,
    server: string,
    author: {
        id: string;
        username: string;
        image: string;
    }
    data: ( server: string, channel: string, message: string, author: {
        id: string;
        username: string;
        image: string;
    } ) => void
}) {

    const [ message, setMessage ] = useState( "" );
    return (
        <div className="flex items-center px-20 py-5 bg-neutral-900/95 gap-2">
            <Input
                placeholder="Enter your message..."
                value={ message }
                onChange={ ( e ) => setMessage( e.target.value ) }
                onKeyDown={ ( e ) => {
                    if( e.key === "Enter" )
                        data( serverID, channelID, message, author )
                }}
            />
            <Button
                onClick={() => data( serverID, channelID, message, author )}
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
        return (
            <div className="flex space-x-4 group">
                <div className="w-10 h-10 bg-neutral-800 rounded-full relative">
                    <Image
                        height={ 40 }
                        width={ 40 }
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