"use client"

import useContextProvider from "@/hooks/useContextProvider"
import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SendIcon } from "lucide-react"
import { Message } from "@/components/ContextProvider"
import Image from "next/image"
import Time from "@/components/Time."
import { CommandMenu } from "@/components/CommandMenu"
import { motion } from "framer-motion"

export default function Page({
    params: { serverID, channelID }
}: Readonly<{ params: { serverID: string, channelID: string } }>) {

    const [ openCommandPalette, setOpenCommandPalette ] = useState( false );

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

    const ref = useRef<HTMLDivElement>( null );

    return (
        <>
            <div ref={ ref } className="flex-1 overflow-y-auto p-12 space-y-5 max-h-[-webkit-fill-available]">
                { messages.map((message: Message, index: number) => (
                    <DisplayMessage key={ index } message={ message } />
                )) }
            </div>
            <SendMessage
                setOpenCommandPalette={ setOpenCommandPalette }
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
    data,
}: {
        setOpenCommandPalette: ( value: boolean ) => void,
    channel: string,
    server: string,
    author: {
        id: string;
        username: string;
        image: string;
    },
    data: ( server: string, channel: string, message: string, author: {
        id: string;
        username: string;
        image: string;
    } ) => void
}) {

    const ref = useRef<HTMLInputElement>( null );
    const [ message, setMessage ] = useState( "" );
    const [ showPlaceholder, setShowPlaceholder ] = useState( true );
    return (

        <div className="flex items-center px-20 py-5 gap-2">
            <CommandMenu />
            <div className="relative flex-1">
                <Input
                    ref={ ref }
                    value={ message }
                    onFocus={ () => setShowPlaceholder( false ) }
                    onBlur={ () => setShowPlaceholder( true ) }
                    onChange={ ( e ) => setMessage( e.target.value ) }
                    onKeyDown={ ( e ) => {

                        if( e.key === "Enter" && message.length > 0 && !e.shiftKey ) {
                            data( serverID, channelID, message, author )
                            setMessage( "" )
                        }
                    }}
                />
                { message.length === 0 && showPlaceholder ? (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-neutral-400 absolute left-4 top-2 mr-2 text-sm pointer-events-none"
                    >
                        Write a message or press { " " }
                        <span className="bg-neutral-800 text-neutral-300 py-0.5 px-1 rounded text-sm font-mono">ctrl k</span>
                        { " " } to open the command palette
                    </motion.span>
                    ) : null
                }


            </div>

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

function DisplayMessage(
    { message }:
    { message: Message }
) {
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
                <p className="flex items-baseline">
                    { message.author.username }
                    <small className="group/time opacity-75 text-neutral-500 group/time-hover:!opacity-100 ml-2 flex">
                        <div className="block group/time-hover:hidden">
                            <Time date={new Date(message.timestamp)} />
                        </div>
                        <div className="hidden group/time-hover:!block">
                            ({ new Date(message.timestamp).toLocaleString() })
                        </div>
                    </small>
                </p>
                <p className="text-neutral-300/80">{ message.message }</p>
            </div>
        </div>
    )

}