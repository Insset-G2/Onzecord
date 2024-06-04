"use client"

import Image from "next/image";
import { Button } from "@/components/ui/button"
import { ChevronRightIcon } from "@radix-ui/react-icons"
import Cobe from "@/components/Cobe"
import Spotlight from "@/components/Spotlight"
import Link from "next/link";

export default function Page() {
  return (

    <main>
        <div className="h-screen w-full dark:bg-neutral-800 dark:bg-grid-white/[0.1] bg-grid-black/[0.2] relative flex items-center justify-center overflow-hidden">

            <div className="absolute left-0 top-0 z-10 h-full w-full bg-[radial-gradient(circle,rgba(2,0,36,0)0,rgb(16,17,16,100%))]" />
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_bottom,transparent_0%,black)]"/>
            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="#ffffff90"
            />

            <div className="flex flex-col items-center justify-center relative z-40 gap-8 px-3 md:w-[90%]">

                <p className="text-4xl sm:text-7xl max-w-[680px] text-center font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
                    Onzecord
                </p>

                <div className="flex items-center justify-start gap-2 text-2xl mb-0 max-w-[680px] text-center font-normal text-white/70">
                    L&apos;alternative à Discord que vous attendiez ( pas )
                </div>

              <div className={`flex items-center justify-center gap-4 relative z-20 mt-5`}>
                  <Button disabled className="px-8 py-5 rounded-sm hover:ring-2 hover:ring-offset-2 hover:ring-offset-neutral-900 hover:ring-white transition-all duration-300">
                      Login
                  </Button>
                  <Button asChild variant="secondary" className="px-8 py-5 rounded-sm hover:ring-2 hover:ring-offset-2 hover:ring-offset-neutral-900 hover:ring-neutral-500 transition-all duration-300">

                    <Link href="/servers">
                        Open the app
                        <ChevronRightIcon className="ml-2 h-5 w-5" />
                    </Link>

                  </Button>

              </div>

          </div>

          <div className="absolute top-[70vh] sm:-bottom-[30%] left-0 right-0 z-20 flex justify-center w-full">
              <Cobe />
          </div>

      </div>
    </main>
  );
}
