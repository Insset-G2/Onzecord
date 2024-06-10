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
import { format, set } from "date-fns"

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
                            youtube={() => setPages([...pages, "youtube"])}
                        />
                    )}
                    { activePage === "reminder" && (
                        <Reminder
                            create={( ) => { setPages([...pages, "create"]) }}
                            remove={( ) => { setPages([...pages, "delete"]) }}
                            update={( ) => { setPages([...pages, "update"]) }}
                        />
                    )}
                    { activePage === "crypto" && (
                        <Crypto
                            setPages={setPages}
                            setOpen={setOpen}
                            graphs={( ) => { setPages([...pages, "graphs"]) }}
                        />
                    )}
                    { activePage === "create" && (
                        <CreateReminder
                            setPages={setPages}
                            setOpen={() => setOpen(false)}
                        />
                    ) }
                    { activePage === "delete" && (
                        <DeleteReminder
                            setPages={setPages}
                            setOpen={() => setOpen(false)}
                        />
                    ) }
                    { activePage === "update" && (
                        <UpdateReminder
                            setPages={setPages}
                            setOpen={() => setOpen(false)}
                        />
                    ) }
                    { activePage === "graphs" && (
                        <CryptoGraphs
                            setPages={setPages}
                            setOpen={() => setOpen(false)}
                        />
                    ) }
                    { activePage === "youtube" && (
                        <Youtube
                            search={() => setPages([...pages, "search"])}
                        />
                    )}
                    { activePage === "search" && (
                        <SearchYoutube
                            setPages={setPages}
                            setOpen={() => setOpen(false)}
                        />
                    )}

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

function Home({ reminder, crypto, youtube }: { reminder: () => void, crypto: () => void, youtube: () => void }) {
    return (
        <CommandGroup heading="Home">
            <CommandItem onSelect={ () => reminder() }>Reminder</CommandItem>
            <CommandItem onSelect={ () => crypto() }>Crypto</CommandItem>
            <CommandItem onSelect={ () => youtube() }>Youtube</CommandItem>
        </CommandGroup>
    )
}

function Reminder({ create, remove, update }: { create: () => void, remove: () => void, update: () => void }) {

    const {
        getReminder,
        contextValue,
    } = useContextProvider();

    return (
        <>
            <CommandGroup heading="Reminder">
                <Item onSelect={ ( ) => {
                    getReminder( contextValue.selectedServer, contextValue.selectedChannel )
                } }>Check reminders</Item>
                <Item onSelect={ create }>New reminder</Item>
                <Item onSelect={ remove }>Delete reminder</Item>
                <Item onSelect={ update }>Update reminder</Item>
                <CommandSeparator className="my-1" />
                <Item shortcut="Pascal" onSelect={() => window.open("https://github.com/Insset-G2/reminder-manager")}>Open the reminder&apos;s GitHub</Item>
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
        mail : z.string().email().optional(),
        description: z.string().max(1000, "Description must be less than 1000 characters"),

        time: z.date({
            required_error: "Date is required",
        }).refine((date) => {
            return date > new Date()
        }).transform((date) => {
            return new Date(date)
        }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        createReminder(
            contextValue.selectedServer,
            contextValue.selectedChannel,
            contextValue.user.username,
            values.name,
            values.description,
            values.time.toISOString(),
            values.mail
        ) 
        setOpen(false)
        setPages(["home"])
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
                        name="mail"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Mail (optional)" {...field} />
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
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
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

function DeleteReminder({ setPages, setOpen }: { setPages: (pages: string[]) => void, setOpen: ( open: boolean ) => void }) {

    const {
        deleteReminder,
        contextValue,
    } = useContextProvider();

    const formSchema = z.object({
        reminder: z.string().refine((reminder) => {
            return reminder.length > 0
        }, {
            message: "Reminder must be at least 1 character",
        }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            reminder: "",
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        deleteReminder(
            contextValue.selectedServer,
            contextValue.selectedChannel,
            values.reminder
        )
        setOpen(false)
        setPages(["home"])
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
                        name="reminder"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input autoFocus placeholder="Reminder ID" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Delete reminder</Button>
                </form>
            </Form>
        </div>
    )
}

function UpdateReminder({ setPages, setOpen }: { setPages: (pages: string[]) => void, setOpen: ( open: boolean ) => void }) {
    
    const {
        updateReminder,
        contextValue,
    } = useContextProvider();

    const [ date, setDate ] = useState<Date | null>( null )

    const formSchema = z.object({
        reminder: z.string().refine((reminder) => {
            return reminder.length > 0
        }, {
            message: "Reminder must be at least 1 character",
        }),
        title: z.string().min(1, "Title must be at least 1 character").max(100, "Title must be less than 100 characters"),
        description: z.string().max(1000, "Description must be less than 1000 characters"),
        email: z.string().email().optional(),
        time: z.date({
            required_error: "Date is required",
        }).refine((date) => {
            return date > new Date()
        }).transform((date) => {
            return new Date(date)
        }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            reminder: "",
            description: "",
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        updateReminder(
            contextValue.selectedServer,
            contextValue.selectedChannel,
            contextValue.user.username,
            values.reminder,
            values.title,
            values.description,
            values.time,
            values.email
        )
        setOpen(false)
        setPages(["home"])
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
                        name="reminder"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input autoFocus placeholder="Reminder ID" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Title" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Mail (optional)" {...field} />
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
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
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

                    <Button type="submit">Update reminder</Button>
                </form>
            </Form>
        </div>
    )

}


function Crypto({ graphs, setPages, setOpen }: { graphs: () => void, setPages: (pages: string[]) => void, setOpen: ( open: boolean ) => void }) {

    const {
        getCryptoValues,
        contextValue,
    } = useContextProvider();

    return (
        <CommandGroup heading="Crypto">
            <Item onSelect={ () => {
                getCryptoValues(
                    contextValue.selectedServer,
                    contextValue.selectedChannel
                )
                setOpen(false)
                setPages(["home"])
            } } >Check values</Item>
            <Item onSelect={ graphs }>Graphs</Item>
            <CommandSeparator className="my-1" />
            <Item shortcut="Leo"
                onSelect={ () => window.open("https://github.com/Insset-G2/cryptomonnaies") }
            >Open the crypto&apos;s GitHub</Item>
        </CommandGroup>
    )
}

function CryptoGraphs({ setPages, setOpen }: { setPages: (pages: string[]) => void, setOpen: ( open: boolean ) => void }) {

    const {
        getCryptoGraphs,
        contextValue,
    } = useContextProvider();

    const formSchema = z.object({
        crypto: z.string().refine((crypto) => {
            return ["litecoin", "bitcoin", "ethereum", "solana"].includes(crypto)
        }, {
            message: "Invalid cryptocurrency",
        }),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            crypto: "",
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema> ) => {
        getCryptoGraphs(
            contextValue.selectedServer,
            contextValue.selectedChannel,
            values.crypto
        )
        setOpen(false)
        setPages(["home"])
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
                                        <SelectTrigger autoFocus>
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

function Youtube({ search }: { search: () => void }) {
    return (
        <CommandGroup heading="Youtube">
            <Item shortcut="Yt" onSelect={ search }>
                Search a video
            </Item>
        </CommandGroup>
    )
}

function SearchYoutube({ setPages, setOpen }: { setPages: (pages: string[]) => void, setOpen: ( open: boolean ) => void }) {

        const {
            searchYoutube,
            contextValue,
        } = useContextProvider();

        const formSchema = z.object({
            search: z.string().min(1, "Search must be at least 1 character"),
        })

        const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                search: "",
            },
        })

        const onSubmit = (values: z.infer<typeof formSchema>) => {
            searchYoutube(
                contextValue.selectedServer,
                contextValue.selectedChannel,
                values.search
            )
            setOpen(false)
            setPages(["home"])
        }

        return (
            <div className="m-5">
                <Button
                    className="-ml-4"
                    variant={"link"}
                    onClick={() => setPages(["home", "youtube"])}
                >
                    <ArrowLeftIcon className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="search"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input autoFocus placeholder="Search" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Search</Button>
                    </form>
                </Form>
            </div>
        )
    }