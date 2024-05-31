"use client"

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"

import UserList from "@/components/UserList"
import useContextProvider from "@/hooks/useContextProvider";
import { useEffect } from "react";

export default function Page({ params: { serverID } }: { params: { serverID: string } }) {

    const { contextValue, setContextValue } = useContextProvider( );

    useEffect(() => {
        setContextValue((contextValue: any) => ({
            ...contextValue,
            selectedServer: serverID,
            selectedChannel: null
        }))
    }, [ serverID, setContextValue ])

    return (
        <div className="w-full h-[calc(100vh-4rem)] flex">
            
        </div>
        // <div className="w-screen h-max flex">
        //     <div className="h-screen bg-neutral-900/30 w-80 overflow-scroll">
        //         {fakeChannels.map((channel) => (
        //             <div key={ channel.id } className="p-4 hover:bg-neutral-900/40 transition-colors">
        //                 { channel.name }
        //             </div>
        //         ))}
        //     </div>
        //     <ResizablePanelGroup direction="horizontal" className="w-screen h-screen bg-neutral-950 text-white">
                
        //         <ResizableHandle withHandle />

        //         <ResizablePanel minSize={20} maxSize={80}>
        //             Messages { params.serverID } de
        //         </ResizablePanel>

        //         <ResizableHandle withHandle />

        //         <ResizablePanel minSize={0} maxSize={20}>
        //             Users
        //         </ResizablePanel>
        //     </ResizablePanelGroup>
        // </div>
    )
}