import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { MotionDiv } from "@/components/Motion"

import Spotlight from "@/components/Spotlight"

import { signIn } from "@/app/auth"
import SignIn from "@/components/SignIn"

  
async function onSubmit( values: any ) {
    "use server"
    await signIn('credentials', {
        redirectTo: '/protected',
        email: values.email,
        password: values.password,
    });

}

export default function Page() {
    return (
        <main className="h-screen w-full dark:bg-neutral-800 dark:bg-grid-white/[0.1] bg-grid-black/[0.2] relative flex items-center justify-center">

            <div className="absolute left-0 top-0 z-10 h-full w-full bg-[radial-gradient(circle,rgba(2,0,36,0)0,rgb(16,17,16,100%))]" />
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_bottom,transparent_0%,black)]"/>
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

                <Card className="w-[350px] bg-neutral-950/50 backdrop-blur-lg bg-opacity-90 text-neutral-100 p-6 rounded-md border border-neutral-800">
                    <CardHeader>
                        <CardTitle>Sign in</CardTitle>
                        <CardDescription>Hello there, Join over 0 users today!</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <SignIn action={ onSubmit } />
                    </CardContent>
                </Card>
            </MotionDiv>
        </main>
    );


}