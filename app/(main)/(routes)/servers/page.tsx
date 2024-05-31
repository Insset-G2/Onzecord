"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import useContextProvider from "@/hooks/useContextProvider"
import { useWebsocket } from "@/hooks/useWebsocket";

export default function Servers( ) {

    return (
        <div className="w-full container pt-20">

            <h1 className="text-2xl font-bold">Community Servers</h1>
            <p className="text-neutral-500">Join a server to chat with other users.</p>
            
            <div className="grid grid-cols-4 gap-4 w-full mt-20">
                { Array.from( { length: 8 } ).map( ( _, i ) => (
                    <Card key={ i } className="bg-neutral-900/70">
                        <CardHeader>
                            <CardTitle>Fake Server</CardTitle>
                            <CardDescription>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <button className="btn btn-primary">Join</button>                            
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )

}