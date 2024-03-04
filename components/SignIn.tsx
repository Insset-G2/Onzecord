"use client"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Button } from "@/components/ui/button"
import { ChevronRightIcon } from "@radix-ui/react-icons"


import { MotionDiv } from "@/components/Motion"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
    email: z.string().email({
        message: "Invalid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }).max(100, {
        message: "Password must be at most 100 characters.",
    }).refine((password) => {
        return /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)
    }, {
        message: "Password must contain at least one uppercase letter, one lowercase letter, and one number."
    }),
})

export default function SignIn({ action }: Readonly<{ action: any; }>) {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email   : "caruellej@hotmail.fr",
            password: "23w9j423W9J4"
        },
    })

    return (
        <Form {...form}>
        <form 
            onSubmit={ form.handleSubmit( ( values ) => action( values ) ) }
            className="grid w-full items-center gap-4"
        >
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="something@like.this" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1.5">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="Your password" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button className="w-full" disabled={!form.formState.isValid} type="submit">
                Create account
                <ChevronRightIcon className="ml-2 size-5" />
            </Button>       
        </form>
    </Form>
    );
}