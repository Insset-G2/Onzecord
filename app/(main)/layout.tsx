"use client"

import ServerNavbar from "@/components/ServerNavbar";
import useContextProvider from "@/hooks/useContextProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

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
import { useEffect, useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {

    const {
        setContextValue,
        contextValue,
        user
    } = useContextProvider( );

    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
      setIsClient(Boolean( typeof window !== 'undefined' && window.document ) )
    }, []);
    const [open, setOpen] = useState( user.username ? false : true );

    const formSchema = z.object({
        username: z.string()
            .min(2, {
                message: "Username must be at least 2 characters.",
            })
            .max(20, {
                message: "Username must be at most 20 characters.",
            }),
        description: z.string()
            .max(30, {
                message: "Username must be at most 30 characters",
            })
            .optional()
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            description: ""
        }
    })

    if (isClient && !contextValue.user.username ) {
        return (
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Hello there!
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Before you can start chatting, we need to know a little bit about you.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit((values) => {
                            setContextValue({
                                ...contextValue,
                                user: {
                                    ...contextValue.user,
                                    image: `https://avatar.vercel.sh/${values.username}.png`,
                                    username: values.username,
                                    description: values.description
                                }
                            })
                            setOpen(false);
                        })} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Username" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is your public display name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Description" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is your public description, ( optional, max 30 characters )
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button className="w-full" type="submit">Submit</Button>
                        </form>
                    </Form>
                </AlertDialogContent>
            </AlertDialog>
        )
    } else if( contextValue.user.username ) {
        return (
        <div className="bg-neutral-900/95">
            <ServerNavbar />
            <div className="h-[calc(100vh-65px)]">
                { children }
            </div>
        </div>
        )
    }

    return null;

}