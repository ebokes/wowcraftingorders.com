// import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/custom.scss";

import type { AppProps } from 'next/app'
import Script from "next/script";

import { SWRConfig } from "swr";
import CustomNavbar from "../components/CustomNavbar";
import Container from "react-bootstrap/Container";
import { SessionProvider, signOut } from "next-auth/react"
import { createContext, useEffect, useState } from "react";
import { REGIONS } from "../data/regions";
import { US_REALMS } from "../data/realms";
import { CookiesProvider, useCookies } from "react-cookie";
import { SESSION_TYPE } from "../types/types";
import { BUYER, SELLER } from "../components/SetRealms";
import { refreshWowheadLinks } from "../utils/wowhead";

export let ROOT_URL: string;
export const DEV_ROOT_URL = 'http://localhost:5001/wowtrade/us-central1/app';
if (!process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV === 'development') {
    ROOT_URL = DEV_ROOT_URL; // Override some functionality in other classes during development that needs auth
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
    type: SELLER,
    setType: (_: string) => {
    }
})

export const updateListingTimestamps = async (session: SESSION_TYPE, region: string) => {
    const PING_INTERVAL = 1000 * 60 * 3; // Ping every two minutes
    const ping = async (session: SESSION_TYPE) => {
        if (session.status !== "authenticated") return;

        const LISTING_TYPES = ["buyer_listings", "seller_listings"];

        const promises = LISTING_TYPES.map(async (listingType) => {
            const response = await fetch(`${ROOT_URL}/${region}/${listingType}/ping`, {
                method: "GET",
                headers: {
                    // @ts-ignore
                    "Authorization": `Bearer ${session.data.accessToken}`
                }
            });
            if (response.status === 401) {
                alert("Your Battle.net session has expired. Please log in again.");
                await signOut();
            } else if (!response.ok) {
                console.error("Error pinging listings", response);
            } else {
                return (await response.json());
            }
        });

        const responses = await Promise.all(promises);
        responses.map((response) => {
            if (response.error) {
                console.error(response.error);
                switch (response.status) {
                    case 401: {
                        alert("Your session has expired. Please sign in again.");
                        signOut();
                        break;
                    }
                    default: {
                        console.error(`Unrecognized response status ${response.status} from ping request with response ${response} and message ${response.statusText}`);
                        break;
                    }
                }
            }
        });
    }

    ping(session).catch();
    const interval = setInterval(() => ping(session), PING_INTERVAL);
    return () => clearInterval(interval);
}

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    const [cookies, setCookie] = useCookies(["region", "realm", "type"]);
    const [realm, setRealm] = useState(US_REALMS[0]);
    const [region, setRegion] = useState(REGIONS.US);
    const [type, setType] = useState(SELLER);

    useEffect(() => {
        if (cookies.realm) setRealm(cookies.realm);
        if (cookies.region) setRegion(cookies.region);
        if (cookies.type) setType(cookies.type);
    }, []);

    useEffect(refreshWowheadLinks, [type]);


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

        <CookiesProvider>
            <SessionProvider session={session}>
                <RegionRealmTypeContext.Provider value={{
                    region: region,
                    setRegion: (region: string) => {
                        if (region === "us") {
                            setCookie("region", REGIONS.US, { path: "/" });
                            setRegion(REGIONS.US);
                        } else if (region === "eu") {
                            setCookie("region", REGIONS.EU, { path: "/" });
                            setRegion(REGIONS.EU);
                        } else {
                            throw new Error("Unrecognized region " + region);
                        }
                    }, realm: realm,
                    setRealm: (realm: string) => {
                        setCookie("realm", realm, { path: "/" });
                        setRealm(realm);
                    }, type: type,
                    setType: (type: string) => {
                        if (type !== BUYER && type !== SELLER) {
                            throw new Error(`Unrecognized listings type: ${type}`);
                        }
                        setCookie("type", type, { path: "/" });
                        setType(type);
                    }

                }}>
                    <SWRConfig value={{
                        fetcher: (url) => fetch(ROOT_URL + url).then(r => r.json()).catch(() => signOut())
                    }}>
                        <CustomNavbar/>
                        <Container>
                            <Component {...pageProps} />
                        </Container>
                    </SWRConfig>
                </RegionRealmTypeContext.Provider>
            </SessionProvider>
        </CookiesProvider>

    </div>
}
