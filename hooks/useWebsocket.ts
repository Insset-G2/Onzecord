import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const useWebsocket = ( url: string ) => {

    const [ socket, setSocket ] = useState<Socket | null>( null );

    useEffect( ( ) => {
        const newSocket = io( url, {
            autoConnect: false,
        });
        setSocket( newSocket );

        return () => {
            newSocket.close( );
        };
    }, [ url ]);

    return socket;
};