import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useContext, useEffect } from "react";
import ListingsList from "../components/ListingsList";
import { Form } from "react-bootstrap";
import { RegionRealmContext } from "./_app";
import { SetRegionRealmView } from "../components/SetRealms";
import Link from "next/link";
import useSWR from "swr";
import { refreshWowheadLinks } from "../util/wowhead";

export default function Home() {
    const context = useContext(RegionRealmContext);
    useEffect(refreshWowheadLinks, [context.region, context.realm]);
    const { data: listings, error } = useSWR(`/${context.region}/${context.realm}/items`);

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
                <ListingsList listings={listings} error={error}/>
            </main>
        </div>
    )
}