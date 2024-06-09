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

    const { contextValue, setContextValue } = useContextProvider();

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
        <div className="w-full h-[calc(100vh-4rem)] flex">

        </div>
    )
}