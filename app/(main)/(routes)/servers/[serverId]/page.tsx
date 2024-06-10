"use client"

import { Button } from "@/components/ui/button";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Skeleton } from "@/components/ui/skeleton";

import { toast } from "sonner"

import useContextProvider from "@/hooks/useContextProvider";
import { useEffect } from "react";
import { useRouter } from "next/navigation"

export default function Page({ params: { serverID } }: { params: { serverID: string } }) {

    const { contextValue, setContextValue } = useContextProvider();
    const router = useRouter();

    useEffect(() => {
        setContextValue((contextValue: any) => ({
            ...contextValue,
            selectedServer: [ 1, 2, 3 ].includes(parseInt(serverID)) === false ? null : serverID,
            selectedChannel: null
        }))
    }, [serverID, setContextValue])

    if ( !serverID || [ 1, 2, 3, ].includes( parseInt( serverID ) ) === false ) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <h1 className="text-4xl text-neutral-500">Invalid Server ID</h1>
            </div>
        )
    }

    return (
        <div className="w-full h-[calc(100vh-4rem)] flex max-w-[750px] mx-auto mt-24">

            <div className="relative w-full">
                <Skeleton className="w-full h-44 rounded-lg" />
                <div className="text-2xl font-semibold rounded-full absolute top-32 left-5 size-20 bg-neutral-800 text-neutral-400 flex items-center justify-center">
                    { contextValue.servers.find((server: any) => server.id == contextValue.selectedServer)?.name.split(" ").map((word: string) => word[0].toUpperCase()).join("") }
                </div>
                <div className="flex items-center justify-between px-5 py-3">
                    <div>
                        <h1 className="text-2xl font-semibold text-neutral-400 mt-20 ml-2">
                            {contextValue.servers.find((server: any) => server.id == contextValue.selectedServer)?.name}
                        </h1>
                        <p className="text-neutral-500 ml-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec odio. Donec et nunc eget odio posuere semper. Nullam varius, nunc nec aliquam
                        </p>

                    </div>
                    <div className="flex items-center">
                        <Button
                            className="mr-2"
                            variant="secondary"
                            onClick={() => toast( "This feature is not available yet :( " ) }
                        >
                            Invite
                        </Button>
                    </div>
                </div>

                <div className="py-3 px-2 mt-12">
                    {contextValue.servers.find((server: any) => server.id == contextValue.selectedServer)?.channels.map((channel: any) => (
                        <div key={channel.id} className="w-full p-5 rounded-lg bg-neutral-800/60 mb-2 flex justify-between items-center">
                            <h1 className="text-sm text-neutral-400">{channel.name}</h1>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setContextValue((contextValue: any) => ({
                                        ...contextValue,
                                        selectedChannel: channel.id
                                    }))
                                    router.push(`/servers/${serverID}/channels/${channel.id}`)
                                }}
                            >
                                Select
                            </Button>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}