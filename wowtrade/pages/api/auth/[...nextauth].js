import NextAuth from "next-auth"
import BattleNetProvider from "next-auth/providers/battlenet";

export const authOptions = {
    // Configure one or more authentication providers
    secret: process.env.SECRET,
    providers: [
        BattleNetProvider({
            clientId: process.env.BATTLENET_CLIENT_ID,
            clientSecret: process.env.BATTLENET_CLIENT_SECRET,
            issuer: process.env.BATTLENET_ISSUER,
            // authorization: {
            //     params: {scope: "wow.profile"},
            // },
            // token: {
            //     params: {scope: "wow.profile"},
            // }
        })
        // ...add more providers here
    ],
    callbacks: {
        async jwt({token, account}) {
            // Persist the OAuth access_token to the token right after signin
            console.log("jwt: ", token, account);
            if (account) {
                token.accessToken = account.access_token
            }
            return token
        },
        async session({session, token}) {
            // Send properties to the client, like an access_token from a provider.
            session.accessToken = token.accessToken
            return session
        }
    }
}

export default NextAuth(authOptions)