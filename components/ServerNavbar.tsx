"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
  } from "@/components/ui/breadcrumb"

import { SlashIcon , ChevronDownIcon, DiscIcon } from "@radix-ui/react-icons"

import useContextProvider from "@/hooks/useContextProvider"
import Link from "next/link"
import { Button } from "./ui/button"
import { UserIcon } from "lucide-react"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useState } from "react"
import { useRouter } from 'next/navigation'

export default function Navbar( ) {

    const {
        updateUser,
        contextValue,
    } = useContextProvider( );

    const [isOpen, setIsOpen] = useState(false);

    const formSchema = z.object({
        username: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        description: z.string().max(30, {
            message: "Description must be less than 30 characters.",
        }),
    })

    const form = useForm( {
        resolver: zodResolver( formSchema ),
        defaultValues: {
            username: contextValue.user.username,
            description: contextValue.user.description,
        },
    } );

    const onSubmit = ( data: any ) => {
        updateUser( data );
        setIsOpen( false );
    }

    return (
        <div className="w-full border-b border-neutral-600/40 bg-neutral-900/95 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/30">
            <div className="mx-10 flex h-16 items-center justify-between">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <DiscIcon />
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <SlashIcon />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex items-center gap-1">

                                    { contextValue.selectedServer ? (
                                        contextValue.servers.find( ( server: any ) => server.id == contextValue.selectedServer )?.name
                                    ) : (
                                        "Select a server"
                                    )}
                                    <ChevronDownIcon />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    { contextValue.servers ? (
                                        contextValue.servers.map( ( server: any ) => (
                                            <DropdownMenuItem key={ server.id }>
                                                <BreadcrumbLink asChild>
                                                    <Link
                                                        className="size-full"
                                                        href={ `/servers/${ server.id }` }
                                                    >
                                                        { server.name }
                                                    </Link>
                                                </BreadcrumbLink>
                                            </DropdownMenuItem>
                                        ))
                                    ) : (
                                        <DropdownMenuItem>Documentation</DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </BreadcrumbItem>
                        { contextValue.selectedServer ? (
                            <>
                                <BreadcrumbSeparator>
                                    <SlashIcon />
                                </BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="flex items-center gap-1">
                                            { contextValue.selectedServer && contextValue?.servers.length > 0 && contextValue.selectedChannel ? (
                                                contextValue.servers.find( ( server: any ) => server.id == contextValue.selectedServer )
                                                    .channels.find( ( channel: any ) => channel.id == contextValue.selectedChannel )?.name
                                            ) : (
                                                "Select a channel"
                                            )}
                                            <ChevronDownIcon />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                            {
                                                contextValue.selectedServer && contextValue?.servers.length > 0 &&
                                                contextValue?.servers.find( ( server: any ) => server.id == contextValue.selectedServer )
                                                    .channels.map( ( channel: any ) => (
                                                        <DropdownMenuItem key={ channel.id }>
                                                            <BreadcrumbLink asChild>
                                                                <Link
                                                                    className="size-full"
                                                                    href={ `/servers/${ contextValue.selectedServer }/channels/${ channel.id }` }
                                                                >
                                                                    { channel.name }
                                                                </Link>
                                                            </BreadcrumbLink>
                                                        </DropdownMenuItem>
                                                    )
                                                )
                                            }

                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </BreadcrumbItem>
                            </>
                        ) : null }
                    </BreadcrumbList>
                </Breadcrumb>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>

                    <DialogTrigger asChild>
                        <Button variant="outline" className="bg-transparent">
                            <UserIcon className="mr-2 h-4 w-4" />
                            {contextValue.user.username}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit profile</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile here. Click save when you&apos;re done.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    name="username"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Username"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="description"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder="Description"
                                                    className="w-full"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type="submit">Save changes</Button>
                                </DialogFooter>
                            </form>
                        </Form>

                    </DialogContent>
                </Dialog>

            </div>
        </div>
    )

}