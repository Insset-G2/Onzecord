export default function ServersLayout({ children }: Readonly<{ children: React.ReactNode }>) {

    return (
        <div className="bg-neutral-950/20 text-white h-[calc(100vh-4rem)] flex">
            { children }
        </div>
    )

}