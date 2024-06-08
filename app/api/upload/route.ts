import { NextRequest, NextResponse } from "next/server";
import {  NextApiResponse } from "next";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST( req: NextRequest, res: NextApiResponse ) {
    
    const formData = await req.formData();
    console.log( formData );

    const file = formData.get("file")
        , name = formData.get("name");

  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }
// @ts-ignore
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = name
  console.log(filename);
  try {
    await writeFile(
      path.join(process.cwd(), "public/upload/" + filename),
      buffer
    );
    return NextResponse.json({ id: filename, status: 200 });
  } catch (error) {
    console.log("Error occured ", error);
    return NextResponse.json({ Message: "Failed", status: 500 });
  }
};
