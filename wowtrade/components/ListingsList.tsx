import useSWR from "swr";
import { Listing } from "../types/types";
import Script from "next/script";
import { ListGroup } from "react-bootstrap";

interface Props {
    region: string;
    realm: string;
    search: string;
}

export function totalMoneyValue(gold: number | undefined, silver: number | undefined, copper: number | undefined) {
    return (gold ?? 0) * 10000 + (silver ?? 0) * 100 + (copper ?? 0);
}

// TODO: Only show each item once, with its lowest commission
export default function ListingsList({ region, realm, search }: Props) {
    const { data, error } = useSWR(`/${region}/${realm}/items`);
    if (error) return <div>Failed to load listings. Please try and refresh the page.</div>
    if (!data) return <div>Loading...</div>

    return <div>
        <ListGroup>
            {data
                .filter((listing: Listing) => { // Filter by item ID
                    if (search === "") return true;
                    return listing.itemId.toString() === search;
                })
                .filter((listing: Listing) => { // Filter by whether it's the lowest commission for the item
                    const otherListings = data.filter((otherListing: Listing) => {
                        return otherListing.itemId === listing.itemId;
                    });
                    return otherListings.every((otherListing: Listing) => {
                        return totalMoneyValue(otherListing.commission.gold, otherListing.commission.silver, otherListing.commission.copper) >= totalMoneyValue(listing.commission.gold, listing.commission.silver, listing.commission.copper);
                    });
                })
                .sort((a: Listing, b: Listing) => { // Sort by commission, lowest to highest
                    const aCommission = totalMoneyValue(a.commission.gold, a.commission.silver, a.commission.copper);
                    const bCommission = totalMoneyValue(b.commission.gold, b.commission.silver, b.commission.copper);
                    return aCommission - bCommission;
                })
                .map((listing: Listing) => (
                    <ListGroup.Item key={listing.itemId}>
                        <a href={`https://www.wowhead.com/item=${listing.itemId}`}>Loading Tooltip...</a>{"    "}
                        <p className={"m-0"}><b>Commission:</b>{" "}
                            {listing.commission.gold}<span style={{ color: "#D4A017" }}>g</span>{" "}
                            {listing.commission.silver}<span style={{ color: "#C0C0C0" }}>s</span>{" "}
                            {listing.commission.copper}<span style={{ color: "#B87333" }}>c</span></p>
                        <p className={"m-0"}><b>Seller:</b> {listing.seller.characterName}</p>
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