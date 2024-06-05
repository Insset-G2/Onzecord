"use client"

import useContextProvider from "@/hooks/useContextProvider"
import { useEffect } from "react";

export default function UserList( ) {

    const { contextValue } = useContextProvider( );

    return (
        <div className="flex flex-col space-y-4 p-4">
            { contextValue.users.map( ( user, i ) => (
                <div key={ i } className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-neutral-800 rounded-full relative min-w-10 min-h-10">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse absolute right-0 bottom-0"></div>
                    </div>
                    <div className="flex flex-col">
                        <p>{ user.username }</p>
                        <p className="text-neutral-500">{ user.description }</p>
                    </div>
                </div>
            ))}
        </div>
    )

}