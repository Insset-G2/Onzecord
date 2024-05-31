"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

import {
AlertDialog,
AlertDialogAction,
AlertDialogCancel,
AlertDialogContent,
AlertDialogDescription,
AlertDialogFooter,
AlertDialogHeader,
AlertDialogTitle,
AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
  } from "@/components/ui/breadcrumb"

import { SlashIcon , ChevronDownIcon, DiscIcon } from "@radix-ui/react-icons"

import useContextProvider from "@/hooks/useContextProvider"
import Link from "next/link"
import { Button } from "./ui/button"
import { PlusIcon } from "lucide-react"

export default function Navbar( ) {

    const { 
        setContextValue,
        contextValue
    } = useContextProvider( );
    
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
                                    
                                    <Avatar className="h-7 w-7 mr-2">
                                        <AvatarImage src="" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>

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
                                            <Avatar className="h-7 w-7 mr-2">
                                                <AvatarImage src="" />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                            { contextValue.selectedServer && contextValue?.servers.length > 0 && contextValue.selectedChannel ? (
                                                contextValue.servers.find( ( server: any ) => server.id == contextValue.selectedServer )
                                                    .channels.find( ( channel: any ) => channel.id == contextValue.selectedChannel )?.name
                                            ) : (
                                                "Select a channel"
                                            )}
                                            <ChevronDownIcon />
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
                                                    ))
                                            }
                                            
                                                
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </BreadcrumbItem>
                            </>
                        ) : null }
                    </BreadcrumbList>
                </Breadcrumb>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant={ "outline" } className="bg-neutral-900/50">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Create server
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )

}