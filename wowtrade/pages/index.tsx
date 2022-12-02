import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useContext, useEffect } from "react";
import ListingsList from "../components/ListingsList";
import { Form } from "react-bootstrap";
import { RegionRealmContext } from "./_app";
import { SetRegionRealmView } from "../components/SetRealms";

export const refreshWowheadLinks = () => {
    const inlineScript = document.createElement('script');
    inlineScript.innerHTML = 'window.$WowheadPower.refreshLinks();';
    document.body.append(inlineScript);

    return () => {
        inlineScript.remove();
    };
};

export default function Home() {
    const context = useContext(RegionRealmContext);
    useEffect(refreshWowheadLinks, [context.region, context.realm]);

    return (
        <div className={styles.container}>
            <Head>
                <title>WoW Trade</title>
                <meta name="description"
                      content="WowTrade.xyz is a marketplace for high-quality work orders in World of Warcraft (WoW)."/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={"p-3"}>
                <h3>What Is This?</h3>
                <p>WowTrade.xyz is a marketplace for high-quality work orders in World of Warcraft (WoW). Public work
                    orders don't guarantee a quality so gravitate towards who's willing to do it for cheap, so this site
                    is intended to enable people to sell high-quality
                    work orders for a higher amount, without needing to spam trade chat.</p>
                <Form style={{ width: "100%" }}>
                    <SetRegionRealmView/>
                </Form>

                <h3 className={"mt-4"}>Search Results</h3>
                <ListingsList/>
            </main>
        </div>
    )
}