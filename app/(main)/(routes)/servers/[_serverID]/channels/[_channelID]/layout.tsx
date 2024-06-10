import UserList from "@/components/UserList";
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from "@/components/ui/resizable";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (

        <ResizablePanelGroup
            direction="horizontal"
            className="flex h-[calc(100vh-4rem)] bg-neutral-900/70 w-full"
        >
            <ResizablePanel
                defaultSize={80}
                className="flex flex-col flex-1"
            >
                {children}
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
                defaultSize={20}
                className="bg-neutral-900/95 overflow-scroll p-5"
            >
                <UserList />
            </ResizablePanel>
        </ResizablePanelGroup>

    )

}