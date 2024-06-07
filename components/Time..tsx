"use client"

import { useEffect, useState } from "react";


function timeUntil( target: Date, time: Date = new Date() ) {

    const diff = time.getTime() - target.getTime()
        , seconds = Math.floor( diff / 1000 )
        , minutes = Math.floor( seconds / 60 )
        , hours = Math.floor( minutes / 60 )
        , days = Math.floor( hours / 24 )
        , weeks = Math.floor( days / 7 )
        , months = Math.floor( weeks / 4 )
        , years = Math.floor( months / 12 );

    if ( seconds < 60 )
        return "Just now";
    if ( minutes < 60 )
        return `${ minutes } minutes ago`;
    if ( hours < 24 )
        return `${ hours } hours ago`;
    if ( days < 7 )
        return `${ days } days ago`;
    if ( weeks < 4 )
        return `${ weeks } weeks ago`;
    if ( months < 12 )
        return `${ months } months ago`;
    return `${ years } years ago`;
}

export default function Time({ date }: { date: Date }) {

    const [ time, setTime ] = useState( new Date() );

    useEffect(() => {
        const interval = setInterval(() => {
            setTime( new Date() )
        }, 1000);
        return () => clearInterval( interval );
    }, []);

    return (
        <div>
            { timeUntil( date, time ) }
        </div>
    )





}