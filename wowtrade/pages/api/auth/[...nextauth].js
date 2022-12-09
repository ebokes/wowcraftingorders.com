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
            authorization: {params: {scope: 'openid wow.profile'}}
        })
        // ...add more providers here
    ],
    callbacks: {
        async jwt({token, account}) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                // const response = await fetch(`oauth.battle.net/oauth/check_token`,
                //     method: 'POST',)
                token.account = account;
                token.accessToken = account.access_token
            }
            return token
        },
        async session({session, token}) {
            // Send properties to the client, like an access_token from a provider.
            session.accessToken = token.accessToken
            session.token = token;
            if (!await tokenIsValid(session.token)) return null;
            return session
        }
    }
}

const tokenIsValid = async (token) => {
    const promises = ["us", "eu"].map(region => {
        return fetch(`https://oauth.battle.net/oauth/check_token?token=${token}&region=${region}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
    });

    const responses = await Promise.all(promises);
    return responses.any(response => response.status === 200);
}

export default NextAuth(authOptions)