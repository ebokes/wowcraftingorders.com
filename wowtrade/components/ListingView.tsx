import { Listing } from "../types/types";
import { Button } from "react-bootstrap";
import Link from "next/link";
import Script from "next/script";
import format from "date-fns/format";

interface Props {
    listing: Listing;
    deleteUserListing?: (id: string) => void;
    includeItem?: boolean;
    includeSeller?: boolean;
    includeDelete?: boolean;
}

/**
 * Given a listing, renders it.
 * @param listing
 * @param deleteUserListing A callback function that deletes the listing.
 * @param includeItem Whether to include a link to the item itself.
 * @param includeSeller Whether to include who's selling it.
 * @param includeDelete Whether to include a button to delete the listing.
 * @constructor
 */
export function ListingView({ listing, deleteUserListing, includeItem, includeSeller, includeDelete }: Props) {

    // Assumed to be true unless set otherwise
    if (includeItem === undefined) includeItem = true;
    if (includeSeller === undefined) includeSeller = true;
    if (includeDelete === undefined) includeDelete = true;

    if (includeDelete && !deleteUserListing || !includeDelete && deleteUserListing) {
        throw new Error("You must either provide a callback to delete the listing, or set includeDelete to false.");
    }

    return <div>
        {includeItem && <b><Link style={{ fontSize: "18px" }}
                                 href={`/${listing.seller.region}/${listing.seller.realm}/item/${listing.itemId}`}
                                 data-wowhead={`item=${listing.itemId}`}>Loading
            Tooltip...</Link></b>}
        {includeSeller && <p className={"m-0"}><b>Seller:</b> {listing.seller.characterName}</p>}
        <p className={"m-0"}><b>Min. Quality: </b>{listing.quality + "/5"}
        </p>
        <p className={"m-0"}><b>Commission:</b>{" "}
            {listing.commission.gold}<span style={{ color: "#D4A017" }}><b>g</b></span>{" "}
            {listing.commission.silver}<span style={{ color: "#909090" }}><b>s</b></span>{" "}
            {listing.commission.copper}<span style={{ color: "#B87333" }}><b>c</b></span></p>
        {listing.seller.discordTag &&
            <p className={"m-0"}><b>Discord Tag:</b> {listing.seller.discordTag}</p>}
        {listing.seller.battleNetTag &&
            <p className={"m-0"}><b>Discord Tag:</b> {listing.seller.battleNetTag}</p>}
        {includeDelete && deleteUserListing &&
            <Button variant={"danger"} onClick={() => deleteUserListing(listing.id)}>Delete Listing</Button>}
        <p><b>Posted: {format(new Date(listing.timestampSeconds * 1000), "EEEE, LLL d")}</b></p>
        {listing && <Script strategy={"afterInteractive"}>{`window.$WowheadPower.refreshLinks();`}</Script>}
    </div>
}