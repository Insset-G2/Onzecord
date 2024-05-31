"use client"

import { useContext } from "react";
import { Context } from "@/components/ContextProvider";

export default function useContextProvider( ): any {
    
    const context = useContext( Context );

    if ( context === undefined )
        throw new Error( "Expected this hook to be called inside a <ContextProvider> component." );

    return context;

}