import fs from "fs"
import { NextRequest, NextResponse } from "next/server";

export async function GET( req: NextRequest, res: NextResponse ) {

  const url = req.url.split("/public/")[1]
  const publicDir = __dirname.split(".next")[0] + "public/upload/"

  if (!fs.existsSync( publicDir + url ))
    return new Response("File not found", {
      status: 404,
      statusText: "not found",
    });

  const file = fs.readFileSync( publicDir + url )

  return new Response(file, {
    status: 200,
    statusText: "ok",
  });
}