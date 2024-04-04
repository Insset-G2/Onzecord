export async function GET(
    request: Request,
    { params }: { params: { task : string } }
) {
    
    const task = params.task

    if ( task === "generateServersList" )
        return new Response( JSON.stringify( getServers( ) ) )

}

function getServers( ) {
    return [
        {
            id: "1",
            name: "Server 1",
            icon: "https://via.placeholder.com/150"
        },
        {
            id: "2",
            name: "Server 2",
            icon: "https://via.placeholder.com/150"
        },
        {
            id: "3",
            name: "Server 3",
            icon: "https://via.placeholder.com/150"
        },
        {
            id: "4",
            name: "Server 4",
            icon: "https://via.placeholder.com/150"
        }
    ]
}