import Head from 'next/head'
import { useContext, useEffect } from "react";
import ListingsList from "../components/ListingsList";
import { Form } from "react-bootstrap";
import { RegionRealmContext } from "./_app";
import { SetRegionRealmView } from "../components/SetRealms";
import Link from "next/link";
import useSWR from "swr";
import { refreshWowheadLinks } from "../utils/wowhead";
import { REGIONS } from "../data/regions";
import { EU_CONNECTED_REALMS, US_CONNECTED_REALMS } from "../data/realms";

export default function Home() {
    const context = useContext(RegionRealmContext);
    useEffect(refreshWowheadLinks, [context.region, context.realm]);
    const { data: listings, error } = useSWR(`/${context.region}/${context.realm}/items`);

    let connectedRealms;
    if (context.region === REGIONS.US) {
        connectedRealms = US_CONNECTED_REALMS.find((connectedRealmList: string[]) => connectedRealmList.includes(context.realm))
    } else if (context.region === REGIONS.EU) {
        connectedRealms = EU_CONNECTED_REALMS.find((connectedRealmList: string[]) => connectedRealmList.includes(context.realm))
    } else {
        throw new Error(`Invalid region: ${context.region}`);
    }

    return (
        <div>
            <Head>
                <title>WoW Crafting Orders</title>
                <meta name="description"
                      content="WoWCraftingOrders.com connects buyers and sellers of high-quality, private work orders in World of Warcraft (WoW)."/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={"p-3"} style={{ height: "100%" }}>
                <h3 className={"mt-4"}>Overview</h3>
                <p>WoWCraftingOrders.com connects buyers and sellers of private work orders, especially high-quality
                    ones. Finding skilled crafters can often be complicated, and trade chat doesn't really solve the
                    problem, which is where this site comes in.</p>
                <p>To buy an item, stay on this page! To list an item, please check out the <Link
                    href={"/sell"}>Sell</Link> page.</p>
                <Form style={{ width: "100%" }}>
                    <SetRegionRealmView/>
                </Form>

                <h3 className={"mt-4 mb-0"}>Recent Listings</h3>
                {connectedRealms !== undefined &&
                    <p className={"mb-3"}>Showing listings from connected realms {connectedRealms.join(", ")}.</p>}
                <ListingsList listings={listings} error={error} includeDelete={false}/>
            </main>
        </div>
    )
}