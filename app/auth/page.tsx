"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { MotionDiv } from "@/components/Motion"

import Spotlight from "@/components/Spotlight"


import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

function dbNotReady( ) {
    toast.message(
        "Hey there!", {
            description: "The database became operational too late, auth does not work, but I will let you check Dimitri&#39;s work.",
            action: {
                label: "open",
                onClick: ( ) => {
                    window.open( "https://usermanager-service-y74o3d564a-uc.a.run.app/api-information", "_blank" );
                }
            }
        }
    )
}

function serverLogin({ email, password }: { email: string, password: string }) {
    dbNotReady( )
    // Normally you would send this data to the server, set a cookie, and redirect the user ? But for now we will just log the data,
    // because the database is not set up yet.
}

function serverRegister({ email, password }: { email: string, password: string }) {
    dbNotReady( )
    // Normally you would send this data to the server, set a cookie, and redirect the user ? But for now we will just log the data,
    // because the database is not set up yet.
}


export default function Page() {

    const loginFormSchema = z.object({
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

    const login = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
    })

    const registerFormSchema = z.object({
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
        confirmPassword: z.string().min(8, {
            message: "Password must be at least 8 characters.",
        }).max(100, {
            message: "Password must be at most 100 characters.",
        }).refine(( data ) => {
            // @ts-ignore
            return data.password === data.confirmPassword
        }, {
            message: "Passwords must match."
        }),
    })

    const register = useForm<z.infer<typeof registerFormSchema>>({
        resolver: zodResolver(registerFormSchema),
    })

    return (
        <main className="h-screen w-full dark:bg-neutral-800 dark:bg-grid-white/[0.1] bg-grid-black/[0.2] relative flex items-center justify-center">

            <div className="absolute left-0 top-0 z-10 h-full w-full bg-[radial-gradient(circle,rgba(2,0,36,0)0,rgb(16,17,16,100%))]" />
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_bottom,transparent_0%,black)]" />
            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="white"
            />

            <MotionDiv
                className="flex flex-col items-center justify-center relative z-40 gap-8 px-3 md:w-[90%]"
                animate={{ opacity: 1, y: 0, scale: 1 }}
                initial={{ opacity: 0, y: 20, scale: 0.99 }}
                transition={{ duration: 0.3 }}
            >
                <Tabs defaultValue="login" className="w-[350px] z-10">
                    <TabsList>
                        <div className="flex justify-between w-full">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="register">Register</TabsTrigger>
                        </div>
                    </TabsList>
                    <TabsContent value="login">
                        <Card className="w-[350px] bg-neutral-950/50 backdrop-blur-lg bg-opacity-90 text-neutral-100 rounded-md border border-neutral-800">
                            <CardHeader>
                                <CardTitle>Login</CardTitle>
                                <CardDescription>Enter your email below to login to your account.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...login}>
                                    <form
                                        onSubmit={login.handleSubmit((serverLogin))}
                                        className="grid w-full items-center gap-4"
                                    >
                                        <FormField
                                            control={login.control}
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
                                            control={login.control}
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
                                        <Button className="w-full" disabled={!login.formState.isValid} type="submit">
                                            Login
                                            <ChevronRightIcon className="ml-2 size-5" />
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="register">
                        <Card className="w-[350px] bg-neutral-950/50 backdrop-blur-lg bg-opacity-90 text-neutral-100 rounded-md border border-neutral-800">
                            <CardHeader>
                                <CardTitle>Register</CardTitle>
                                <CardDescription>Enter your email below to register a new account.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...register}>
                                    <form
                                        onSubmit={register.handleSubmit((serverLogin))}
                                        className="grid w-full items-center gap-4"
                                    >
                                        <FormField
                                            control={register.control}
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
                                            control={register.control}
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
                                        <FormField
                                            control={register.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col space-y-1.5">
                                                    <FormLabel>Confirm Password</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="Your password ( yes, again )" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button className="w-full" disabled={!register.formState.isValid} type="submit">
                                            Register
                                            <ChevronRightIcon className="ml-2 size-5" />
                                        </Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </MotionDiv>

        </main>
    );


}