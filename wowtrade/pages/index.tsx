import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>WoW Trade</title>
                <meta name="description" content="Trading site for high-quality World of Warcraft work orders."/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
            </main>
        </div>
    )
}
