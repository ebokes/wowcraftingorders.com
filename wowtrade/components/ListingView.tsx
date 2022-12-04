import { Listing } from "../types/types";
import { Button } from "react-bootstrap";
import Link from "next/link";
import differenceInMinutes from "date-fns/differenceInMinutes";
import differenceInHours from "date-fns/differenceInHours";
import differenceInDays from "date-fns/differenceInDays";


interface Props {
    listing: Listing;
    deleteUserListing?: (id: string) => void;
    includeItem?: boolean;
    includeSeller?: boolean;
    includeDelete?: boolean;
    includeTimestamp?: boolean;
}

/**
 * Given a listing, renders it.
 * @param listing
 * @param deleteUserListing A callback function that deletes the listing.
 * @param includeItem Whether to include a link to the item itself.
 * @param includeSeller Whether to include who's selling it.
 * @param includeDelete Whether to include a button to delete the listing.
 * @param includeTimestamp Whether to include a timestamp of when the listing was created.
 * @constructor
 */
export function ListingView({
                                listing,
                                deleteUserListing,
                                includeItem,
                                includeSeller,
                                includeDelete,
                                includeTimestamp
                            }: Props) {

    // Assumed to be true unless set otherwise
    if (includeItem === undefined) includeItem = true;
    if (includeSeller === undefined) includeSeller = true;
    if (includeDelete === undefined) includeDelete = true;

    if (includeDelete && !deleteUserListing || !includeDelete && deleteUserListing) {
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
    if (differenceInDays(new Date(), postTimestamp) > 0) {
        timeText.push(`${differenceInDays(new Date(), postTimestamp)}d`);
    }
    if (differenceInHours(new Date(), postTimestamp) > 0) {
        timeText.push(`${differenceInHours(new Date(), postTimestamp) % 24}h`);
    }
    if (differenceInMinutes(new Date(), postTimestamp) > 0) {
        timeText.push(`${differenceInMinutes(new Date(), postTimestamp) % 60 % 24}m`);
    }

    let deltaTimeText;
    if (!timeText.length) {
        deltaTimeText = "Posted just now.";
    } else {
        deltaTimeText = "Posted " + timeText.join(" ") + " ago.";
    }

    return <div className={"bg-dark text-white"}>
        {includeItem && <b><Link style={{ fontSize: "18px" }}
                                 href={`/item/${listing.itemId}`}
                                 data-wowhead={`item=${listing.itemId}`}>Loading
            Tooltip...</Link></b>}
        {includeSeller && <p className={"m-0"}><b>Seller:</b> {listing.seller.characterName}</p>}
        <p className={"mb-2"}><b>Minimum Quality: </b>{listing.quality + "/5"}
        </p>
        <p className={"m-0"}><b>Commission:</b>{" "}
            {listing.commission.gold}<span style={{ color: "#D4A017" }}><b>g</b></span>{" "}
            {listing.commission.silver}<span style={{ color: "#909090" }}><b>s</b></span>{" "}
            {listing.commission.copper}<span style={{ color: "#B87333" }}><b>c</b></span></p>
        {listing.seller.discordTag &&
            <p className={"m-0"}><b>Discord Tag:</b> {listing.seller.discordTag}</p>}
        {listing.seller.battleNetTag &&
            <p className={"m-0"}><b>Battle.net Tag:</b> {listing.seller.battleNetTag}</p>}
        {!!listing.providedReagents && <p><b>{"Seller-Provided Reagents: "}</b>
            {listing.providedReagents.map((reagent, i) => <span key={i}>
                    {reagent.count}{"x "}<Link
                href={`https://www.wowhead.com/item=${reagent.reagent.itemId}`}></Link>{i !== listing.providedReagents.length - 1 &&
                <span>{", "}</span>}
                </span>)}
        </p>}
        {includeTimestamp && <div style={{ position: "absolute", bottom: "20px", right: "20px" }}>
            {postTimestamp && deltaTimeText !== "Posted ago." && <p className={"mb-0"}>{deltaTimeText}</p>}
            {postTimestamp && deltaTimeText === "Posted ago." && <p className={"mb-0"}>Posted just now.</p>}
        </div>}
        {includeDelete && deleteUserListing && <div style={{ position: "absolute", bottom: "20px", left: "20px" }}>
            <Button variant={"danger"} onClick={() => deleteUserListing(listing.id)}>Delete Listing</Button>
        </div>
        }
    </div>
}