import { Listing } from "../types/types";
import { Button, ListGroup } from "react-bootstrap";
import Link from "next/link";

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

    return <ListGroup.Item key={listing.itemId}>
        {includeItem && <Link href={`/${listing.seller.region}/${listing.seller.realm}/item/${listing.itemId}`}
                              data-wowhead={`item=${listing.itemId}`}>Loading
            Tooltip...</Link>}
        {includeSeller && <p className={"m-0"}><b>Seller:</b> {listing.seller.characterName}</p>}
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
        {includeDelete &&
            <Button variant={"danger"} onClick={() => deleteUserListing(listing.id)}>Delete Listing</Button>}
    </ListGroup.Item>
}