import ServerNavbar from "@/components/ServerNavbar";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="bg-neutral-900/95">
            <ServerNavbar/>
            <div className="h-[calc(100vh-65px)]">
                { children }
            </div>
        </div>
    )
}