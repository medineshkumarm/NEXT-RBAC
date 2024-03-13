import type { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'

import { GithubProfile } from 'next-auth/providers/github'

export const options: NextAuthOptions = {
    providers: [
        GitHubProvider({
            profile(profile: GithubProfile){
                // console.log(profile)
                return {
                    ...profile, 
                    role: profile.role ?? "user",
                    id: profile.id.toString(),
                    image: profile.avatar_url,    
                }
            },
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username:",
                    type: "text",
                    placeholder: "your-cool-username"
                },
                password: {
                    label: "Password:",
                    type: "password",
                    placeholder: "your-awesome-password"
                }
            },
            async authorize(credentials) {
                // This is where you need to retrieve user data 
                // to verify with credentials
                // Docs: https://next-auth.js.org/configuration/providers/credentials
                // note: Manager cannot access 'extra Page' but they can access "client Page"
                const user = { id: "42", name: "Dinesh", password: "dinesh123", role: "manager" } 

                if (credentials?.username === user.name && credentials?.password === user.password) {
                    return user
                } else {
                    return null
                }
            }
        })
    ],
    callbacks: {
        async jwt({token , user}){
            if(user) token.role = user.role
            return token
        },
        // If you want to use the role components
        async session({session,token}){
            if(session?.user) session.user.role = token.role
            return session
        }
    }
}