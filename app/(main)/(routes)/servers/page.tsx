"use client"

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useRouter } from 'next/navigation'

export default function Servers( ) {

    const router = useRouter();

    return (
        <div className="w-full container pt-20">

            <h1 className="text-2xl font-bold">Community Servers</h1>
            <p className="text-neutral-500">Join a server to chat with other users.</p>
            <p className="text-neutral-500 mt-5">
                It&apos;s just an example, you can&apos;t actually join any server :), please just select one on the navigation bar.
            </p>
            <div className="grid grid-cols-4 gap-4 w-full mt-20">
                { Array.from( { length: 3 } ).map( ( _, i ) => (
                    <Card key={ i } className="bg-neutral-900/70">
                        <CardHeader>
                            <CardTitle>Server { i + 1 }</CardTitle>
                            <CardDescription>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant={ "secondary" } className="w-full" onClick={ () => {
                                router.push( `/servers/${ i + 1 }` )
                            } }>Join Server</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )

}