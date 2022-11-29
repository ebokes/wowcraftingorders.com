import { useRouter } from "next/router";
import useSWR from "swr";
import { Form, ListGroup } from "react-bootstrap";
import { Listing } from "../../../types/types";
import Script from "next/script";
import { totalMoneyValue } from "../../../components/ListingsList";
import { useState } from "react";
import Link from "next/link";

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
    if (!region || !realm || !itemID) return <div>Loading...</div>
    if (error) {
        console.error("SWR Error: ", error);
        return <div>Failed to load listings for this item. Please try and refresh the page.</div>
    }

    return <div>
        <div className={"mt-5"}></div>
        {data &&
            <Link style={{ fontSize: "1.5rem" }} href={`https://www.wowhead.com/item=${itemID}`}>Loading
                Tooltip...</Link>}
        {!data && <div>Loading...</div>}
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
                    <ListGroup.Item key={listing.itemId}>
                        <p className={"m-0"}><b>Seller:</b> {listing.seller.characterName}</p>
                        <p className={"m-0"}><b>Quality Guarantee: </b>{listing.quality + " " + "(1 = Worst, 5 = Best)"}
                        </p>
                        <p className={"m-0"}><b>Commission:</b>{" "}
                            {listing.commission.gold}<span style={{ color: "#D4A017" }}>g</span>{" "}
                            {listing.commission.silver}<span style={{ color: "#C0C0C0" }}>s</span>{" "}
                            {listing.commission.copper}<span style={{ color: "#B87333" }}>c</span></p>
                        {listing.seller.discordTag &&
                            <p className={"m-0"}><b>Discord Tag:</b> {listing.seller.discordTag}</p>}
                        {listing.seller.battleNetTag &&
                            <p className={"m-0"}><b>Discord Tag:</b> {listing.seller.battleNetTag}</p>}
                    </ListGroup.Item>
                ))}
        </ListGroup>
        {data && <Script strategy={"afterInteractive"}>{`window.$WowheadPower.refreshLinks();`}</Script>}
    </div>
}