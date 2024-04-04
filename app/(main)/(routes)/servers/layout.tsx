import ServerNavbar from "@/components/ServerNavbar";

// Get server data from the server, 

export default function ServersLayout({ children }: Readonly<{ children: React.ReactNode }>) {


    return (
        <div className="w-screen h-screen bg-neutral-950 text-white">
            <ServerNavbar servers={[]} />
            { children }
        </div>
    )

}