import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState } from "react";
import ListingsList from "../components/ListingsList";

export default function Home() {
    const [region, setRegion] = useState("en");
    const [realm, setRealm] = useState("thrall");

    return (
        <div className={styles.container}>
            <Head>
                <title>WoW Trade</title>
                <meta name="description" content="Trading site for high-quality World of Warcraft work orders."/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <ListingsList region={region} realm={realm}/>
            </main>
        </div>
    )
}
