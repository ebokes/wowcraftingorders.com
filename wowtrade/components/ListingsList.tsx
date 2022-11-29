import useSWR from "swr";
import { Listing } from "../types/types";
import Script from "next/script";
import { ListGroup } from "react-bootstrap";
import { ListingView } from "./ListingView";
import { commissionSort } from "../util/utils";
import { useContext } from "react";
import { RegionRealmContext } from "../pages/_app";

interface Props {
    search: string;
}

export function totalMoneyValue(gold: number | undefined, silver: number | undefined, copper: number | undefined) {
    return (gold ?? 0) * 10000 + (silver ?? 0) * 100 + (copper ?? 0);
}

// TODO: Only show each item once, with its lowest commission
export default function ListingsList({ search }: Props) {
    const context = useContext(RegionRealmContext);
    const { data, error } = useSWR(`/${context.region}/${context.realm}/items`);
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
                .sort(commissionSort)
                .map((listing: Listing) => (
                    <ListingView listing={listing} includeDelete={false} key={listing.id}/>
                ))}
        </ListGroup>
        {data && <Script strategy={"afterInteractive"}>{`window.$WowheadPower.refreshLinks();`}</Script>}
    </div>
}