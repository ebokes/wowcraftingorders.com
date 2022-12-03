import { useRouter } from "next/router";
import useSWR from "swr";
import { Form, ListGroup } from "react-bootstrap";
import { Listing } from "../../../types/types";
import Script from "next/script";
import { totalMoneyValue } from "../../../components/ListingsList";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ListingView } from "../../../components/ListingView";

export default function itemPage() {

    // Hooks
    const router = useRouter();
    let { region, realm, itemID } = router.query;

    const [quality, setQuality] = useState("All");

    // TODO: This is a hacky workaround for me needing to use ...itemID in the path. Find a cleaner way to do it.
    if (itemID != null) { // Hacky workaround for me not being able to get
        itemID = itemID[1];
    }
    region = region as string; // TODO: Hacky, needs fix. Necessary so that Webstorm stops yelling at me for the later .toUpperCase()
    const { data, error } = useSWR(`/${region}/${realm}/item/${itemID}`);

    // Conditionally not rendering
    if (!region || !realm || !itemID) return <Image width="30" height="30" alt="Loading" src={"/loading.gif"}/>
    if (error) {
        return <div>Failed to load listings for this item. Please try and refresh the page.</div>
    }

    return <div>
        <div className={"mt-5"}></div>
        {data &&
            <Link style={{ fontSize: "1.5rem" }} href={`https://www.wowhead.com/item=${itemID}`}>Loading
                Tooltip...</Link>}
        {!data && <Image width="30" height="30" alt="Loading" src={"/loading.gif"}/>}
        {data && <h3 className={"mt-3"}>Listings on {region.toUpperCase()} {realm}</h3>}
        <Form>
            <Form.Group controlId={"quality"}>
                <Form.Label>Quality</Form.Label>
                <Form.Control as={"select"} onChange={(e) => setQuality(e.target.value)}>
                    <option value={"All"}>All</option>
                    <option value={"Rank 1"}>Rank 1 (Worst)</option>
                    <option value={"Rank 2"}>Rank 2</option>
                    <option value={"Rank 3"}>Rank 3</option>
                    <option value={"Rank 4"}>Rank 4</option>
                    <option value={"Rank 5"}>Rank 5 (Best)</option>
                </Form.Control>
            </Form.Group>
        </Form>
        <ListGroup>
            {data && data
                .filter((listing: Listing) => { // Filter
                    if (quality === "All") return true;
                    return listing.quality === quality;
                })
                .sort((a: Listing, b: Listing) => { // Sort by commission, lowest to highest
                    const aCommission = totalMoneyValue(a.commission.gold, a.commission.silver, a.commission.copper);
                    const bCommission = totalMoneyValue(b.commission.gold, b.commission.silver, b.commission.copper);
                    return aCommission - bCommission;
                })
                .map((listing: Listing) => (
                    <ListingView listing={listing} includeSeller includeTimestamp includeDelete={false}/>
                ))}
        </ListGroup>
        {data && <Script strategy={"afterInteractive"}>{`window.$WowheadPower.refreshLinks();`}</Script>}
    </div>
}