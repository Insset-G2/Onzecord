"use client"

import useContextProvider from "@/hooks/useContextProvider"
import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button, buttonVariants } from "@/components/ui/button"
import { FilePlus2, LanguagesIcon, Paperclip, SendIcon } from "lucide-react"
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
import { Skeleton } from "@/components/ui/skeleton"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import FileUploadDropzone from "@/components/FileUploadDropzone"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export default function Page({
    params: { serverID, channelID }
}: Readonly<{ params: { serverID: string, channelID: string } }>) {

    const [ openCommandPalette, setOpenCommandPalette ] = useState( false );
    const ref = useRef<HTMLDivElement>( null );

    const { contextValue,
        setContextValue,
        sendMessage,
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
        if( ref.current )
            ref.current.scrollTop = ref.current.scrollHeight
    }, [ messages ])

    return (
        <>

            <div ref={ref} className="flex-1 p-12 overflow-y-auto flex flex-col space-y-6 max-h-[-webkit-fill-available]">
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

                        if( !e.message && !e.files?.length )
                            return

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
    const [ translation, setTranslation ] = useState( "original" );
    const [ messageState, setMessageState ] = useState( message );

    return (

        <ContextMenu>
            <ContextMenuTrigger>
                <div className="flex space-x-4 group w-full">
                    <div className="w-10 h-10 bg-neutral-800 rounded-full relative">
                        <img
                            src={message.author.image}
                            alt={message.author.username}
                            className="w-10 h-10 rounded-full min-w-10 min-h-10"
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <p className="flex items-baseline">
                            {message.author.username}
                            <small className="group/time opacity-75 text-neutral-500 group/time-hover:!opacity-100 ml-2 flex">
                                <div className="block group/time-hover:hidden">
                                    <Time date={new Date(message.timestamp)} />
                                </div>
                                <div className="hidden group/time-hover:!block">
                                    ({new Date(message.timestamp).toLocaleString()})
                                </div>
                            </small>
                        </p>

                        {messageState.translated && messageState.translated === "[Translating]" ? (
                            <SkeletonText text={ message.message } />
                        ) : (
                            <Markdown className={ "markdown" } rehypePlugins={[rehypeHighlight]}>{
                                messageState.translated ? messageState.translated : message.message
                            }</Markdown>
                        )}
                        <div className="flex gap-1">
                            <div>
                                {message.files[0] && (
                                    <Dialog>
                                        <DialogTrigger
                                            className="m-0"
                                            asChild
                                        >
                                            <div
                                                className="relative rounded-sm"
                                                style={{
                                                    width: "300px",
                                                    height: "300px",
                                                    background: `url(/api/public/${message.files[0]})`,
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center"
                                                }}
                                            />
                                        </DialogTrigger>
                                        <DialogContent>
                                            <img
                                                src={`/api/public/${message.files[0]}`}
                                                alt={message.files[0]}
                                                className="rounded-md"
                                            />
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                {message.files[1] && (
                                    <Dialog>
                                        <DialogTrigger
                                            className="m-0"
                                            asChild
                                        >
                                            <div
                                                className="relative rounded-sm"
                                                style={{
                                                    width: `calc( ${message.files.length > 2 ? "296px" : "300px"} / ${message.files.length > 2 ? 2 : 1})`,
                                                    height: `calc( ${message.files.length > 2 ? "296px" : "300px"} / ${message.files.length > 2 ? 2 : 1})`,
                                                    background: `url(/api/public/${message.files[1]})`,
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center"
                                                }}
                                            />
                                        </DialogTrigger>
                                        <DialogContent>
                                            <img
                                                src={`/api/public/${message.files[1]}`}
                                                alt={message.files[1]}
                                                className="rounded-md w-full"
                                            />
                                        </DialogContent>
                                    </Dialog>
                                )}
                                {message.files[2] && (
                                    <Dialog>
                                        <DialogTrigger
                                            className="m-0"
                                            asChild
                                        >
                                            <div
                                                className="relative rounded-sm"
                                                style={{
                                                    width: `calc( 296px / 2)`,
                                                    height: `calc( 296px / 2)`,
                                                    background: `url(/api/public/${message.files[2]})`,
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center"
                                                }}
                                            />
                                        </DialogTrigger>
                                        <DialogContent className="w-fit m-0">
                                            <img
                                                src={`/api/public/${message.files[2]}`}
                                                alt={message.files[2]}
                                                className="rounded-md"
                                            />
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuSub>
                    <ContextMenuSubTrigger>
                        Translate
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                        <ContextMenuRadioGroup value={translation} onValueChange={(value) => {
                            setTranslation(value)
                            applyTranslation(value, messageState, setMessageState)
                        }}>
                            <ContextMenuRadioItem value="fr">French</ContextMenuRadioItem>
                            <ContextMenuRadioItem value="de">German</ContextMenuRadioItem>
                            <ContextMenuRadioItem value="en">English</ContextMenuRadioItem>
                            <ContextMenuSeparator />
                            <ContextMenuRadioItem value="original">Original</ContextMenuRadioItem>
                        </ContextMenuRadioGroup>
                    </ContextMenuSubContent>
                </ContextMenuSub>
            </ContextMenuContent>
        </ContextMenu>
    )

}

function applyTranslation( value: string, message: Message, setMessage: ( message: Message ) => void ) {
    setMessage({
        ...message,
        translated: "[Translating]"
    })
    fetch( process.env.NEXT_PUBLIC_TRANSACTIONS_URL as string, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "text": message.message,
            "from": "fr",
            "to": value
        })
    })
    .then( response => response.json() )
    .then( data => {
        setMessage({
            ...message,
            translated: data.translation
        })
    })
    .catch( error => {
        console.error( error )
    })

}

function SkeletonText( { text }: { text: string } ) {

    return (
        <div className="flex flex-col gap-2">
            {text.split("\n").map((line, index) => {
                const length = line.length
                return (
                    <div key={index} className="flex gap-2">
                        <Skeleton style={{
                            width: `${length * 2 }px`,
                            height: "1rem"
                        }} />
                    </div>
                )
            })}
        </div>
    )
}