import { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import GitHub from "@auth/core/providers/github"
import Credentials from "@auth/core/providers/credentials"

const prisma = new PrismaClient()

export const authConfig = {
  adapter: PrismaAdapter( prisma ),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email   : { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },

      async authorize( credentials ) {

        if( !credentials.email || !credentials.password )
          throw new Error( "Please enter an email and password" )
          
        const user = await prisma.user.findUnique({
            where: {
                email: credentials.email
            }
        });

        if ( !user || !user?.hashedPassword ) {
          throw new Error( "No user found" )

          // check to see if password matches
          const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword)

          // if password does not match
          if (!passwordMatch) {
              throw new Error('Incorrect password')
          }

          return user;


              // if no user was found 
              if (!user || !user?.hashedPassword) {
                  throw new Error('No user found')
              }

              // check to see if password matches
              const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword)

              // if password does not match
              if (!passwordMatch) {
                  throw new Error('Incorrect password')
              }

              return user;

    }),
    GitHub({ 
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET 
    })
  ],
} satisfies NextAuthConfig;