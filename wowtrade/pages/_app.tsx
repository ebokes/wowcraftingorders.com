import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Script from "next/script";
import 'bootstrap/dist/css/bootstrap.min.css';
import { SWRConfig } from "swr";
import CustomNavbar from "../components/CustomNavbar";
import Container from "react-bootstrap/Container";
import { SessionProvider } from "next-auth/react"

export let ROOT_URL: string;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    ROOT_URL = 'http://localhost:5001/wowtrade/us-central1/app';
} else {
    ROOT_URL = 'https://wowtrade.web.app';
}

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
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
            <SWRConfig value={{
                fetcher: (url) => fetch(ROOT_URL + url, {
                    mode: "cors",
                }).then(r => r.json())
            }}>
                <CustomNavbar/>
                <Container>
                    <Component {...pageProps} />
                </Container>
            </SWRConfig>
        </SessionProvider>

    </div>
}
