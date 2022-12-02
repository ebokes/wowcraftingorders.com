import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useContext, useEffect } from "react";
import ListingsList from "../components/ListingsList";
import { Form } from "react-bootstrap";
import { RegionRealmContext } from "./_app";
import { SetRegionRealmView } from "../components/SetRealms";
import Link from "next/link";

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
                      content="WoWCraftingOrders.com connects buyers and sellers of private work orders in World of Warcraft (WoW)."/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={"p-3"}>
                <h3 className={"mt-4"}>Overview</h3>
                <p>WoWCraftingOrders.com connects buyers and sellers of private work orders, especially high-quality
                    ones. Finding skilled crafters can often be complicated, and trade chat doesn't really solve the
                    problem, which is where this site comes in.</p>
                <p>To buy an item, stay on this page! To list an item, please check out the <Link
                    href={"/sell"}>Sell</Link> page.</p>
                <Form style={{ width: "100%" }}>
                    <SetRegionRealmView/>
                </Form>

                <h3 className={"mt-4 mb-0"}>Search Results</h3>
                <ListingsList/>
            </main>
        </div>
    )
}