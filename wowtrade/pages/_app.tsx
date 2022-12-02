import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Script from "next/script";
import 'bootstrap/dist/css/bootstrap.min.css';
import { SWRConfig } from "swr";
import CustomNavbar from "../components/CustomNavbar";
import Container from "react-bootstrap/Container";
import { SessionProvider } from "next-auth/react"
import { createContext, useState } from "react";
import { REGIONS } from "../data/regions";
import { REALM_LIST } from "../data/realms";

export let ROOT_URL: string;
if (!process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV === 'development') {
    ROOT_URL = 'http://localhost:5001/wowtrade/us-central1/app';
} else if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'test') {
    ROOT_URL = 'https://us-central1-wowtrade.cloudfunctions.net/app-test';
} else {
    ROOT_URL = 'https://us-central1-wowtrade.cloudfunctions.net/app-prod';
}

export const RegionRealmContext = createContext({
    region: REGIONS.EN,
    setRegion: (_: string) => {
    },
    realm: REALM_LIST[0],
    setRealm: (_: string) => {
    },
})

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    const [realm, setRealm] = useState(REALM_LIST[0]);
    const [region, setRegion] = useState(REGIONS.EN);
    return <div>

        {/* TODO: Update measurement ID once I choose a domain */}
        <Script
            strategy="lazyOnload"
            src={`https://www.googletagmanager.com/gtag/js?id=G-M4VZ4J6S5J`}
        />
        <Script strategy="lazyOnload" id="ga-script">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'ABCD', {
              page_path: window.location.pathname,
            });
        `}
        </Script>

        <Script
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7827406820675555"
            crossOrigin="anonymous"
            strategy={"afterInteractive"}
        ></Script>

        <script
            id={'custom'}>{`var whTooltips = whTooltips || { colorLinks: true, iconizeLinks: true, renameLinks: true};`}</script>
        <Script strategy={"beforeInteractive"} src={'https://wow.zamimg.com/js/tooltips.js'}/>


        <SessionProvider session={session}>
            <RegionRealmContext.Provider value={{
                region: region,
                setRegion: (region: string) => {
                    if (region === "en") setRegion(REGIONS.EN);
                    throw new Error("Unrecognized region " + region);
                }, realm: realm,
                setRealm: (realm: string) => {
                    setRealm(realm);
                }
            }}>
                <SWRConfig value={{
                    fetcher: (url) => fetch(ROOT_URL + url).then(r => r.json())
                }}>
                    <CustomNavbar/>
                    <Container>
                        <Component {...pageProps} />
                    </Container>
                </SWRConfig>
            </RegionRealmContext.Provider>
        </SessionProvider>

    </div>
}
