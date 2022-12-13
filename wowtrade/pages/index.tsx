import Head from 'next/head'
import { useContext, useEffect } from "react";
import ListingsList from "../components/ListingsList";
import { Form } from "react-bootstrap";
import { RegionRealmTypeContext, updateListingTimestamps } from "./_app";
import { BUYER, SELLER, SetRegionRealmType } from "../components/SetRealms";
import Link from "next/link";
import useSWR from "swr";
import { refreshWowheadLinks } from "../utils/wowhead";
import { REGIONS } from "../data/regions";
import { EU_CONNECTED_REALMS, US_CONNECTED_REALMS } from "../data/realms";
import { useSession } from "next-auth/react";

export default function Home() {
    const context = useContext(RegionRealmTypeContext);
    const session = useSession();
    useEffect(refreshWowheadLinks, [context.region, context.realm]);
    const itemsQueryString = `/${context.region}/${context.realm}/${context.type === BUYER ? "seller_listings" : "buyer_listings"}`;

    const { data: listings, error } = useSWR(itemsQueryString);

    let connectedRealms;
    if (context.region === REGIONS.US) {
        connectedRealms = US_CONNECTED_REALMS.find((connectedRealmList: string[]) => connectedRealmList.includes(context.realm))
    } else if (context.region === REGIONS.EU) {
        connectedRealms = EU_CONNECTED_REALMS.find((connectedRealmList: string[]) => connectedRealmList.includes(context.realm))
    } else {
        throw new Error(`Invalid region: ${context.region}`);
    }

    useEffect(() => {
        updateListingTimestamps(session, context.region).catch(e => console.error(e));
    }, [session, context.region])

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
                <p>You can view listings on this page. To create a listing, either indicating you want to buy an item (a
                    buy order) or indicating you can craft an item (a sell order) please check out the <Link
                        href={"/create"}>Create a Listing</Link> page.</p>
                <Form style={{ width: "100%" }}>
                    <SetRegionRealmType/>
                </Form>

                {connectedRealms !== undefined &&
                    <p className={"mb-3"}>Showing listings from connected realms {connectedRealms.join(", ")}.</p>}
                <ListingsList type={context.type === BUYER ? SELLER : BUYER} listings={listings}
                              error={error} includeDelete={false}/>
            </main>
        </div>
    )
}