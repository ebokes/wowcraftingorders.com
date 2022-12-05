import { signIn, useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { RegionRealmContext, ROOT_URL, updateListingTimestamps } from "./_app";
import { Listing } from "../types/types";
import ListingsList from "../components/ListingsList";
import Link from "next/link";
import { Button } from "react-bootstrap";

export default function MyListings() {
    const session = useSession();
    const context = useContext(RegionRealmContext);
    const [listings, setListings] = useState<Listing[] | undefined>();

    useEffect(() => {
        updateListingTimestamps(session, context.region).catch();
    }, [session])

    // Retrieve listings for user
    useEffect(() => {
        const fetchData = async () => {
            if (!session.data) return;
            const listings = await fetch(`${ROOT_URL}/${context.region}/listings`, {
                method: "GET",
                headers: {
                    // TODO: Proper way to not need to ignore this is to extend the Session type
                    // @ts-ignore
                    "Authorization": `Bearer ${session.data.accessToken}`
                }
            })
            const listingsJson: Listing[] = await listings.json();
            setListings(listingsJson);
        }

        fetchData().catch();
    }, [session, context.region, context.realm]);

    if (session.status !== "authenticated" && !(!process.env.NODE_ENV || process.env.NODE_ENV === 'development')) {
        return (
            <div>
                <p className={"mt-5"}>Please sign in to view your listings.</p>
                {!session && <Button onClick={() => signIn("battlenet")}>Sign In to Battle.net</Button>}
            </div>
        );
    }

    return <div>
        <h3 className={"mt-3"}>My Listings</h3>
        <p>To create a new listing, please use the <Link href={"/sell"}>Sell</Link> page.</p>
        <p>The "Last Active" time on your listings will regularly update anytime you are on the site and logged
            into Battle.net.</p>
        <ListingsList listings={listings} error={undefined} includeDelete={true} setListingsCallback={setListings}/>
    </div>
}