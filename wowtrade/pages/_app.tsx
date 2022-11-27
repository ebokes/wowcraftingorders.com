import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Script from "next/script";
import 'bootstrap/dist/css/bootstrap.min.css';

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
        <Component {...pageProps} />
    </div>
}
