"use client"

import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"

import { useState, useEffect, useCallback, useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "./ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { cn } from "@/lib/utils"
import { ArrowLeft, ArrowLeftIcon, CalendarIcon } from "lucide-react"
import { Calendar } from "./ui/calendar"
import { Textarea } from "./ui/textarea"
import useContextProvider from "@/hooks/useContextProvider"


export function CommandMenu( ) {

    const ref = useRef<HTMLDivElement | null>(null)

    const [ open, setOpen ]             = useState( false )
        , [ pages, setPages ]           = useState<string[]>([ "home" ])
        , [ inputValue, setInputValue ] = useState<string>( "" )

    const activePage = pages[ pages.length - 1 ]

    const popPage = useCallback( ( ) => {
        setPages( ( pages ) => {
            const x = [...pages]
            x.splice( -1, 1 )
            return x
        })
    }, [])

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <CommandDialog
            open={open}
            onOpenChange={setOpen}
        >
            <Command
                ref={ ref }
                onKeyDown={(e) => {

                    if ( activePage === "home" && inputValue.length  )
                        return

                    if ( e.key === "Backspace" && activePage !== "home" && pages.length < 3 ) {
                        e.preventDefault()
                        popPage()
                    }

                } }
            >
                <div className="flex space-x-2 ml-4 mt-3">
                    { pages.map( ( p, i ) => (
                       <>
                            { i == 2 && (
                                <span className="text-neutral-500 text-sm font-mono mt-0.5"> {">"} </span>
                            )}
                            <div key={p} className="bg-neutral-900 text-neutral-300 px-2 py-0.5 rounded-md text-sm font-mono">
                                { p.charAt(0).toUpperCase() + p.slice(1) }
                            </div>

                       </>
                    ))}
                </div>
                { ( pages.length < 3 ) && (
                    <CommandInput
                        autoFocus
                        onValueChange={(value) => setInputValue(value)}
                        placeholder="Type a command or search..."
                    />
                )}
                <CommandList>
                    { ( pages.length < 3 ) && (
                        <CommandEmpty>No results found.</CommandEmpty>
                    )}
                    { activePage === "home" && (
                        <Home
                            reminder={() => setPages([...pages, "reminder"])}
                            crypto={() => setPages([...pages, "crypto"])}
                        />
                    )}
                    { activePage === "reminder" && (
                        <Reminder
                            create={( ) => { setPages([...pages, "create"]) }}
                        />
                    )}
                    { activePage === "crypto" && (
                        <Crypto
                            graphs={( ) => { setPages([...pages, "graphs"]) }}
                        />
                    )}
                    { activePage === "create" && (
                        <CreateReminder
                            setPages={setPages}
                            setOpen={() => setOpen(false)}
                        />
                    ) }
                    { activePage === "graphs" && (
                        <CryptoGraphs
                            setPages={setPages}
                        />
                    ) }

                </CommandList>
            </Command>
        </CommandDialog>
    )
}

function Item({
    children,
    shortcut,
    onSelect = () => { },
}: {
    children: React.ReactNode
    shortcut?: string
    onSelect?: (value: string) => void
}) {
    return (
        <CommandItem onSelect={ onSelect }>
            <div className="flex items-center justify-between w-full">
                { children }
                { shortcut && (
                    <div className="text-neutral-500 text-xs font-mono ml-1">
                        {shortcut.split( " " ).map((key) => {
                            return <kbd key={key}>{key}</kbd>
                        })}
                    </div>
                )}
            </div>

        </CommandItem>
    )
}

function Home({ reminder, crypto }: { reminder: () => void, crypto: () => void }) {
    return (
        <CommandGroup heading="Home">
            <CommandItem onSelect={ () => reminder() }>Reminder</CommandItem>
            <CommandItem onSelect={ () => crypto() }>Crypto</CommandItem>
        </CommandGroup>
    )
}

function Reminder({ create }: { create: () => void }) {
    return (
        <>
            <CommandGroup heading="Reminder">
                <Item>Check reminders</Item>
                <Item onSelect={ create }>New reminder</Item>
                <Item>Clear reminders</Item>
                <Item>Update reminder</Item>
                <CommandSeparator className="my-1" />
                <Item shortcut="Pascal">Open the reminder&apos;s GitHub</Item>
            </CommandGroup>

        </>
    )
}

function CreateReminder({ setPages, setOpen }: { setPages: (pages: string[]) => void, setOpen: ( open: boolean ) => void }) {

    const {
        createReminder,
        contextValue,
    } = useContextProvider();

    const [ date, setDate ] = useState<Date | null>( null )

    const formSchema = z.object({
        name: z.string()
            .min(1, "Name must be at least 1 character")
            .max(100, "Name must be less than 100 characters"),

        description: z.string().max(1000, "Description must be less than 1000 characters"),

        time: z.date(),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            time: new Date(),
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        createReminder(
            contextValue.selectedServer,
            contextValue.selectedChannel,
            contextValue.user.username,
            values.name,
            values.description,
            values.time.toISOString()
        )
        setPages(["home"])
        setOpen(false)
    }

    return (
        <div className="m-5">
            <Button
                className="-ml-4"
                variant={"link"}
                onClick={() => setPages(["home", "reminder"])}
            >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back
            </Button>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input autoFocus placeholder="Title" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        className="h-24"
                                        placeholder="Description"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !date && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {date ? format(date, "PPP") : <span>Choose a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Create reminder</Button>
                </form>
            </Form>
        </div>

    )
}

function Crypto({ graphs }: { graphs: () => void }) {
    return (
        <CommandGroup heading="Crypto">
            <Item>Check prices</Item>
            <Item onSelect={ graphs }>Graphs</Item>
            <Item>Clear graphs</Item>
            <Item>Update graphs</Item>
            <CommandSeparator className="my-1" />
            <Item shortcut="Pascal">Open the crypto&apos;s GitHub</Item>
        </CommandGroup>
    )
}

function CryptoGraphs({ setPages }: { setPages: (pages: string[]) => void }) {

    const {
        getCryptoGraphs,
        contextValue,
    } = useContextProvider();

    const formSchema = z.object({
        crypto: z.string()
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            crypto: "",
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        getCryptoGraphs(
            contextValue.selectedServer,
            contextValue.selectedChannel,
            values.crypto
        )
    }

    return (
        <div className="m-5">
            <Button
                className="-ml-4"
                variant={"link"}
                onClick={() => setPages(["home", "crypto"])}
            >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back
            </Button>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="crypto"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cryptocurrency</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select the cryptocurrency" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="litecoin">Litecoin</SelectItem>
                                        <SelectItem value="bitcoin">Bitcoin</SelectItem>
                                        <SelectItem value="ethereum">Ethereum</SelectItem>
                                        <SelectItem value="solana">Solana</SelectItem>
                                    </SelectContent>
                                </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <Button type="submit">Get graphs</Button>
                </form>
            </Form>


        </div>
    )
}