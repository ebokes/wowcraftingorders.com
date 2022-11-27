import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Script from "next/script";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col } from "react-bootstrap";
import { SWRConfig } from "swr";

let ROOT_URL: string;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development' && false) {
    ROOT_URL = 'http://localhost:5001';
} else {
    ROOT_URL = 'https://wowtrade.web.app';
}

export default function App({ Component, pageProps }: AppProps) {
    return <div>

        {/* TODO: Update measurement ID once I choose a domain */}
        <Script
            strategy="lazyOnload"
            src={`https://www.googletagmanager.com/gtag/js?id=ABCD`}
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
            id={'custom'}
        >{`if (typeof(whTooltips) === undefined) { var whTooltips = {colorLinks: true, iconizeLinks: true, renameLinks: true}; }`}</Script>
        <Script src={'https://wow.zamimg.com/js/tooltips.js'}/>

        <Col md={2}></Col>
        <Col md={8}>
            <SWRConfig value={{
                fetcher: (url) => fetch(ROOT_URL + url).then(r => r.json())
            }}>
                <Component {...pageProps} />
            </SWRConfig>
        </Col>
        <Col md={2}></Col>

    </div>
}
