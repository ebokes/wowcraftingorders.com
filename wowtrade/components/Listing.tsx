import { Listing } from "../types/types";
import { ListGroup } from "react-bootstrap";
import Link from "next/link";

interface Props {
    listing: Listing;
}

export function ListingView({ listing }: Props) {
    return <ListGroup.Item key={listing.itemId}>
        <Link href={`/${listing.seller.region}/${listing.seller.realm}/item/${listing.itemId}`}
              data-wowhead={`item=${listing.itemId}`}>Loading
            Tooltip...</Link>{"    "}
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
}