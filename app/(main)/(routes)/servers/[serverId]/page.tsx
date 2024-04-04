import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"

const fakeChannels = [
    { id: "1", name: "General" },
    { id: "2", name: "Random" },
    { id: "3", name: "Off-topic" },
    { id: "4", name: "Development" },
    { id: "5", name: "Design" },
    ...Array.from({ length: 25 }, (_, i) => ({ id: `${i+6}`, name: `Channel ${i+6}` })),
]

export default function Page() {
    return (
        <div className="w-screen h-max flex">
            <div className="h-screen bg-neutral-900/30 w-80 overflow-scroll">
                {fakeChannels.map((channel) => (
                    <div key={ channel.id } className="p-4 hover:bg-neutral-900/40 transition-colors">
                        { channel.name }
                    </div>
                ))}
            </div>
            <ResizablePanelGroup direction="horizontal" className="w-screen h-screen bg-neutral-950 text-white">
                
                <ResizableHandle withHandle />

                <ResizablePanel minSize={20} maxSize={80}>
                    Messages
                </ResizablePanel>

                <ResizableHandle withHandle />

                <ResizablePanel minSize={0} maxSize={20}>
                    Users
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}