import useSWR from "swr";
import { Listing } from "../types/types";
import Script from "next/script";
import { ListGroup } from "react-bootstrap";

interface Props {
    region: string;
    realm: string;
    search: string;
}

// TODO: Only show each item once, with its lowest commission
export default function ListingsList({ region, realm, search }: Props) {
    const { data, error } = useSWR(`/${region}/${realm}/items`);
    if (error) return <div>Failed to load listings. Please try and refresh the page.</div>
    if (!data) return <div>Loading...</div>

    return <div>
        <ListGroup>
            {data
                .filter((listing: Listing) => {
                    if (search === "") return true;
                    return listing.itemId.toString() === search;
                })
                .map((listing: Listing) => (
                    <ListGroup.Item key={listing.itemId}>
                        <a href={`https://www.wowhead.com/item=${listing.itemId}`}>Link Text</a>{"    "}
                        <p className={"m-0"}>Commission:{" "}
                            {listing.commission.gold}<span style={{ color: "#D4A017" }}>g</span>{" "}
                            {listing.commission.silver}<span style={{ color: "#C0C0C0" }}>s</span>{" "}
                            {listing.commission.copper}<span style={{ color: "#B87333" }}>c</span></p>
                    </ListGroup.Item>
                ))}
        </ListGroup>
        {data && <Script strategy={"afterInteractive"}>{`window.$WowheadPower.refreshLinks();`}</Script>}
    </div>
}