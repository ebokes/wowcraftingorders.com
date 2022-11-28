import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Script from "next/script";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row } from "react-bootstrap";
import { SWRConfig } from "swr";

let ROOT_URL: string;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    ROOT_URL = 'http://localhost:5001/wowtrade/us-central1/app';
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

        <script
            id={'custom'}>{`var whTooltips = whTooltips || { colorLinks: true, iconizeLinks: true, renameLinks: true};`}</script>
        <Script strategy={"afterInteractive"} src={'https://wow.zamimg.com/js/tooltips.js'}/>

        <Row>
            <Col md={1}></Col>
            <Col md={10}>
                <SWRConfig value={{
                    fetcher: (url) => fetch(ROOT_URL + url).then(r => r.json())
                }}>
                    <Component {...pageProps} />
                </SWRConfig>
            </Col>
            <Col md={1}></Col>
        </Row>


    </div>
}
