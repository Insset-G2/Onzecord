"use client"

import useContextProvider from "@/hooks/useContextProvider"
import { useEffect } from "react";
export default function UserList( ) {

    const { contextValue } = useContextProvider( );

    useEffect(() => {
        console.log( contextValue.users );
    }, [ contextValue.users ])

    return (
        <div className="flex flex-col space-y-4 p-4">
            { contextValue.users.map( ( user: { username: string, description: string, id: string, image: string }, i: number ) => (
                <div key={ i } className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-neutral-800 rounded-full relative min-w-10 min-h-10">
                        {
                            user.image ? (
                                <img src={ user.image } className="w-10 h-10 rounded-full" />
                            ) : (
                                <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center">
                                    { user.username.split( "" ).slice( 0, 2 ).join( "" ) }
                                </div>
                            )
                        }
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse absolute right-0 bottom-0" />
                    </div>
                    <div className="flex flex-col">
                        <p>{ user.username }</p>
                        <p className={ `text-neutral-500 line-clamp-1 ${ user.description ? "" : "h-3" }` }>{ user.description }</p>
                    </div>
                </div>
            ))}
        </div>
    )

}