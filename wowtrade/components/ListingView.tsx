import { Button, Row } from "react-bootstrap";
import Link from "next/link";
import differenceInMinutes from "date-fns/differenceInMinutes";
import differenceInHours from "date-fns/differenceInHours";
import differenceInDays from "date-fns/differenceInDays";
import { ITEMS } from "../data/items";
import { SELLER } from "./SetRealms";
import { BuyerListing, ReagentStack, SellerListing } from "../types/types";


interface Props {
    type: string;
    listing: BuyerListing | SellerListing;
    deleteUserListing?: (id: string) => void;
    includeItem?: boolean;
    includeSeller?: boolean;
    includeDelete?: boolean;
    includeTimestamp?: boolean;
}

/**
 * Given a listing, renders it.
 * @param listing
 * @param type Reversed from rest of project, but "buyer" indicates this is a buyer listing and vice versa
 * @param deleteUserListing A callback function that deletes the listing.
 * @param includeItem Whether to include a link to the item itself.
 * @param includeSeller Whether to include who's selling it.
 * @param includeDelete Whether to include a button to delete the listing.
 * @constructor
 */
export function ListingView({
                                type,
                                listing,
                                deleteUserListing,
                                includeItem,
                                includeSeller,
                                includeDelete,
                            }: Props) {

    // Assumed to be true unless set otherwise
    if (includeItem === undefined) includeItem = true;
    if (includeSeller === undefined) includeSeller = true;
    if (includeDelete === undefined) includeDelete = true;

    if (includeDelete && !deleteUserListing) {
        throw new Error("You must either provide a callback to delete the listing, or set includeDelete to false.");
    }

    let postTimestamp;
    try {
        postTimestamp = new Date(listing.timestampSeconds * 1000);
    } catch (err) {
        console.error(`Error parsing timestamp for listing ${JSON.stringify(listing)}`);
        console.error(err);
        throw new Error(`Error parsing timestamp for listing ${JSON.stringify(listing)}`);
    }

    const timeText = [];
    const daysDifference = differenceInDays(new Date(), postTimestamp);
    const hoursDifference = differenceInHours(new Date(), postTimestamp);
    const minutesDifference = differenceInMinutes(new Date(), postTimestamp);
    if (daysDifference > 0) {
        timeText.push(`${differenceInDays(new Date(), postTimestamp)}d`);
    }
    if (hoursDifference > 0 && daysDifference < 2) {
        timeText.push(`${differenceInHours(new Date(), postTimestamp) % 24}h`);
    }
    if (minutesDifference > 0 && hoursDifference < 4 && daysDifference === 0) {
        timeText.push(`${differenceInMinutes(new Date(), postTimestamp) % 60 % 24}m`);
    }

    let deltaTimeText;
    if (!timeText.length) {
        deltaTimeText = "Last active just now.";
    } else {
        deltaTimeText = "Last active " + timeText.join(" ") + " ago.";
    }

    const item = ITEMS.find(item => item.id === listing.itemId);
    if (!item) throw new Error("Couldn't find item!");

    return <div className={"bg-black text-white m-1 mb-2 p-3 border border-secondary rounded"}
                style={{ position: "relative" }}>
        <p className={"m-0"}>{includeItem && <b><Link style={{ fontSize: "18px" }}
                                                      href={`/item/${listing.itemId}`}
                                                      data-wowhead={`item=${listing.itemId}`}>{item.name}</Link></b>}</p>
        <Row>


            <p className={"m-0"}>
                <b>{type === SELLER ? "Guaranteed Quality: " : "Desired Quality: "}</b>{listing.quality + "/5"}
            </p>

            <p className={"m-0"}><b>Commission:</b>{" "}
                {listing.commission.gold}<span style={{ color: "#D4A017" }}><b>g</b></span>{" "}
                {listing.commission.silver}<span style={{ color: "#909090" }}><b>s</b></span>{" "}
                {listing.commission.copper}<span style={{ color: "#B87333" }}><b>c</b></span></p>
            {listing.seller.discordTag &&
                <p className={"m-0"}><b>Discord Tag:</b> {listing.seller.discordTag}</p>}
            {listing.seller.battleNetTag &&
                <p className={"m-0"}><b>Battle.net Tag:</b> {listing.seller.battleNetTag}</p>}
            {includeDelete && deleteUserListing &&
                <Button variant={"danger"} onClick={() => deleteUserListing(listing.id)}>Delete Listing</Button>}
            {type === SELLER && (listing as SellerListing).infusions && <div>
                    <span>Seller can craft with these infusions:
                    </span>{(listing as SellerListing).infusions.map((infusion, index) => {
                return (
                    <span key={index}><Link
                        href={`https://www.wowhead.com/item=${infusion.itemId}`}></Link>{index !== (listing as SellerListing).infusions.length - 1 ? ", " : ""}</span>)
            })}
            </div>}

            {listing.details && <p className={"m-0"}><b>{"Details: "}</b>{listing.details}</p>}
            {!!listing.providedReagents && !!listing.providedReagents.length &&
                <p className={"m-0"}>
                    <b>{type === SELLER ? "Seller-Provided: " : "Buyer-Provided: "}</b>
                    {listing.providedReagents.map((reagent: ReagentStack, i: number) => <span
                        key={reagent.reagent.itemId}>
                    {reagent.count}{"x "}<Link
                        href={`https://www.wowhead.com/item=${reagent.reagent.itemId}`}></Link>{i !== listing.providedReagents.length - 1 &&
                        <span>{", "}</span>}
                </span>)}
                </p>}
            {<div style={{ position: "absolute", top: "20px", right: "20px", textAlign: "right" }}>
                <p className={"mb-0"}>{includeSeller && <p className={"m-0"}>
                    {type === SELLER ? "Seller: " : "Buyer: "}
                    <b>{listing.seller.characterName}</b>-{listing.seller.realm}
                </p>}</p>
            </div>}

            {<div style={{ position: "absolute", bottom: "20px", right: "20px", textAlign: "right" }}>
                <p className={"mb-0"}>{deltaTimeText}</p>
            </div>}

        </Row>
    </div>
}