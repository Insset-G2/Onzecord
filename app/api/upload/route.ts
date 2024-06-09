import { NextRequest, NextResponse } from "next/server";
import {  NextApiResponse } from "next";
import path from "path";
import { writeFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";

export async function POST( req: NextRequest, res: NextApiResponse ) {

    const formData = await req.formData();

    const file = formData.get("file")
        , name = formData.get("name");

    if ( !file )
        return NextResponse.json({ error: "No files received." }, { status: 400 });

    // @ts-ignore
    const buffer    = Buffer.from( await file.arrayBuffer() )
        , filename  = name

  try {

    const folder = path.join(process.cwd(), "public/upload");

    if (!existsSync( folder ))
        mkdirSync( folder, { recursive: true });

    await writeFile(
        path.join(process.cwd(), "public/upload/" + filename),
        buffer
    );

    return NextResponse.json({ id: filename, status: 200 });

    } catch ( error ) {
        return NextResponse.json({ Message: "Failed", status: 500 });
    }

};
