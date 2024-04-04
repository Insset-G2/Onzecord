import { redirect } from "next/navigation"
import { ChatHeader } from "@/components/ChatHeader"

export default function Page({
    params
}: Readonly<{ params: { serverId: string, channelId: string } }>) {

    if ( !params.serverId ) 
        redirect( "/servers" )

    if( !params.channelId )
        redirect( `/servers/${ params.serverId }` )

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
                name={"channel.name"}
                serverId={"channel.serverId"}
                type="channel"
            />
        </div>
    )
}