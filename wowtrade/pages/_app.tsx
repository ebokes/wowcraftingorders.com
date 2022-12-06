// import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/custom.scss";

import type { AppProps } from 'next/app'
import Script from "next/script";

import { SWRConfig } from "swr";
import CustomNavbar from "../components/CustomNavbar";
import Container from "react-bootstrap/Container";
import { SessionContextValue, SessionProvider } from "next-auth/react"
import { createContext, useState } from "react";
import { REGIONS } from "../data/regions";
import { US_REALMS } from "../data/realms";

export let ROOT_URL: string;
if (!process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV === 'development') {
    ROOT_URL = 'http://localhost:5001/wowtrade/us-central1/app';
} else if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') {
    ROOT_URL = 'https://us-central1-wowtrade.cloudfunctions.net/app-test';
} else {
    ROOT_URL = 'https://us-central1-wowtrade.cloudfunctions.net/app-prod';
}

export const RegionRealmTypeContext = createContext({
    region: REGIONS.US,
    setRegion: (_: string) => {
    },
    realm: US_REALMS[0],
    setRealm: (_: string) => {
    },
    type: "seller_listings",
    setType: (_: string) => {
    }
})

// TODO: Should properly type the Session object here
export const updateListingTimestamps = async (session: SessionContextValue<boolean> | { readonly data: null, readonly status: "loading" }, region: string) => {
    const PING_INTERVAL = 1000 * 60 * 2; // Ping every two minutes
    const ping = async () => {
        ["buyer_listings", "seller_listings"].map(listingType => {
            fetch(`${ROOT_URL}/${region}/${listingType}/ping`, {
                method: "GET",
                headers: {
                    // @ts-ignore
                    "Authorization": `Bearer ${session.data.accessToken}`
                }
            }).catch();
        })
    }
    // @ts-ignore
    if (session && session.status === "authenticated") {
        ping().catch();
        const interval = setInterval(ping, PING_INTERVAL);
        return () => clearInterval(interval);
    }
}

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    const [realm, setRealm] = useState(US_REALMS[0]);
    const [region, setRegion] = useState(REGIONS.US);
    const [type, setType] = useState("seller_listings");

    return <div
        style={{ height: "fit-content" }}>
        <style global jsx>{`
          html,
          body {
            height: 100%;
            min-height: fit-content;
          }
        `}</style>

        {/* TODO: Update measurement ID once I choose a domain */}
        <Script
            strategy="lazyOnload"
            src={`https://www.googletagmanager.com/gtag/js?id=G-9X8N7RLM2L`}
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
            <RegionRealmTypeContext.Provider value={{
                region: region,
                setRegion: (region: string) => {
                    if (region === "us") {
                        setRegion(REGIONS.US);
                    } else if (region === "eu") {
                        setRegion(REGIONS.EU);
                    } else {
                        throw new Error("Unrecognized region " + region);
                    }
                }, realm: realm,
                setRealm: (realm: string) => {
                    setRealm(realm);
                }, type: type,
                setType: (type: string) => {
                    if (type !== "buyer_listings" && type !== "seller_listings") {
                        throw new Error(`Unrecognized listings type: ${type}`);
                    }
                    setType(type);
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
            </RegionRealmTypeContext.Provider>
        </SessionProvider>

    </div>
}
