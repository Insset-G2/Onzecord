import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { Storage } from "@google-cloud/storage";

export async function POST( req: NextRequest ) {

    const formData = await req.formData();

    const file = formData.get("file")
        , name = formData.get("name");

    if ( !file || !name )
        return NextResponse.json({ error: "No files received." }, { status: 400 });

    // @ts-ignore
    const buffer = Buffer.from( await file.arrayBuffer() );

    try {

        const storage = new Storage({
            keyFilename: path.join( process.cwd(), "/onzecord-425916-54811c9a72a4.json" ),
        });

        const bucket = storage.bucket( `${ process.env.GCP_BUCKET_NAME }` );

        await new Promise( ( resolve, reject ) => {

            const file = bucket.file( name as string );
            const writeStream = file.createWriteStream();

            writeStream.on( "error", ( error ) => {
                console.error( error );
                reject( error );
            });

            writeStream.on( "finish", () => {
                resolve( true );
            });

            writeStream.write( buffer );
            writeStream.end();

        });

        return NextResponse.json({ id: name, status: 200 });

    } catch ( error ) {

        return NextResponse.json({ Message: "Failed", status: 500 });

    }

};
