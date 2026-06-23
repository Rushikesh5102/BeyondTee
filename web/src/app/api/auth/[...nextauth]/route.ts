/* eslint-disable */
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { API_URL } from "@/lib/api-config";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) return null;

                try {
                    // Call NestJS Backend
                    const res = await fetch(`${API_URL}/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            username: credentials.username,
                            password: credentials.password,
                        }),
                    });

                    const user = await res.json();

                    if (res.ok && user) {
                        return user;
                    }
                    return null;
                } catch (e) {
                    console.error("Login failed:", e);
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/auth/signin",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'google') {
                // Logic to handle Google Sign In with Backend
                // Ideally, we send the Google Access Token or ID Token to Backend to verify and create/find user.
                // For now, we will trust NextAuth and just allow it, BUT we need a backend user ID for orders.
                // TODO: Implement Backend Social Login Endpoint.
                // Temporary: Allow sign in, but user.id might be the Google ID.
                return true;
            }
            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.role = user.role || 'USER'; // Default role for Social Auth
                token.accessToken = user.access_token;
            }
            if (account?.provider === 'google') {
                // For Google, we might not have a backend access token yet unless we exchange it.
                // This is a common integration point. 
                // Let's ensure token.id is stable.
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.accessToken = token.accessToken;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
