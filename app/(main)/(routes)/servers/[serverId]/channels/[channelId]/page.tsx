"use client"

import useContextProvider from "@/hooks/useContextProvider"
import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button, buttonVariants } from "@/components/ui/button"
import { FilePlus2, Paperclip, SendIcon } from "lucide-react"
import { Message } from "@/components/ContextProvider"
import Image from "next/image"
import Time from "@/components/Time."
import { CommandMenu } from "@/components/CommandMenu"
import { motion } from "framer-motion"
import Markdown from "react-markdown"
import rehypeHighlight from 'rehype-highlight'
import { Textarea } from "@/components/ui/textarea"
import { FileUploader, FileInput } from "@/components/ui/file-upload"
import { cn } from "@/lib/utils"
import { v4 as UUIDV4 } from "uuid"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import FileUploadDropzone from "@/components/FileUploadDropzone"

export default function Page({
    params: { serverID, channelID }
}: Readonly<{ params: { serverID: string, channelID: string } }>) {

    const [ openCommandPalette, setOpenCommandPalette ] = useState( false );
    const ref = useRef<HTMLDivElement>( null );

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
        if( ref.current )
            ref.current.scrollTop = ref.current.scrollHeight
    }, [ messages ])

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
    data: ( 
        server: string, 
        channel: string, 
        message: string, 
        author: {
            id: string;
            username: string;
            image: string;
        },
        files: { id: string }[] | []
    ) => void
}) {

    const ref = useRef<HTMLTextAreaElement>( null );
    return (

        <div className="flex items-center px-20 py-5 gap-2">
            <CommandMenu />
            <div className="relative flex-1">
                <FileUploadDropzone
                    placeholder=""
                    onSubmit={ ( e ) => {
                        if ( e.files && e.files.length > 0 ) {

                            const promises = Promise.all(
                                e.files?.map(async (file) => {
                                    const formData = new FormData();
                                    formData.append( "file", file);
                                    formData.append( "name", `${ UUIDV4() }.${ file.name.split(".").pop() }` );
                                    const response = await fetch("/api/upload", {
                                        method: "POST",
                                        body: formData,
                                    });
                                    return await response.json();
                                }) ?? []
                            );

                            promises.then(( files ) => {
                                data( serverID, channelID, e.message, author, [
                                    ...files.map( file => {
                                        return file.id
                                    })
                                ])
                            });

                        } else {
                            data( serverID, channelID, e.message, author, [ ] )
                        }
                        
                    }} 
                />

            </div>
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

                <p className="
                    text-neutral-300/90 whitespace-pre-wrap
                    [&>pre]:bg-neutral-950/20 [&>pre]:mt-2 [&>pre]:rounded-md [&>pre]:border [&>pre]:border-neutral-800 [&>pre]:overflow-x-auto [&>pre]:text-sm
                    [&>h1]:text-xl [&>h2]:text-lg [&>h3]:text-base [&>h4]:text-sm [&>h5]:text-xs [&>h6]:text-xs
                    [&>a]:text-blue-500 [&>a]:hover:text-blue-400 [&>a]:underline [&>a]:hover:no-underline
                    [&>ul]:list-disc [&>ol]:list-decimal [&>li]:ml-4 [&>li]:mt-2 [&>li]:mb-2
                    [&>blockquote]:border-l-4 [&>blockquote]:border-neutral-500 [&>blockquote]:pl-4 [&>blockquote]:mx-1
                ">
                    <Markdown rehypePlugins={[rehypeHighlight]}>{ message.message }</Markdown>
                </p>
                <div className="flex gap-1">
                    <div>
                        { message.files[0] && (
                            <div
                                className="relative rounded-sm"
                                style={{ 
                                    width: "300px", 
                                    height: "300px", 
                                    background: `url(/upload/${ message.files[0] })`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center"
                                }}
                            />
                        )}
                    </div>
                    <div className="flex flex-col gap-1">
                        { message.files[1] && (
                            <div
                                className="relative rounded-sm"
                                style={{ 
                                    width: `calc( ${ message.files.length > 2 ? "296px" : "300px" } / ${ message.files.length > 2 ? 2 : 1 })`,
                                    height: `calc( ${ message.files.length > 2 ? "296px" : "300px" } / ${ message.files.length > 2 ? 2 : 1 })`,
                                    background: `url(/upload/${ message.files[1] })`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center"
                                }}
                            />
                        )}
                        { message.files[2] && (
                            <div
                                className="relative rounded-sm"
                                style={{ 
                                    width: `calc( 296px / 2)`,
                                    height: `calc( 296px / 2)`,
                                    background: `url(/upload/${ message.files[2] })`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center"
                                }}
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Popover>
                        <PopoverTrigger
                            className="bg-neutral-800 border border-neutral-700 rounded-sm"
                        >
                            Open
                        </PopoverTrigger>
                        <PopoverContent>Place content for the popover here.</PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    )

}
