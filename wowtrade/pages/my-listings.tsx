import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { RegionRealmContext, ROOT_URL } from "./_app";
import { Listing } from "../types/types";
import ListingsList from "../components/ListingsList";

export default function MyListings() {
    const session = useSession();
    const context = useContext(RegionRealmContext);
    const [listings, setListings] = useState<Listing[] | undefined>();

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
            <p className={"mt-5"}>Please sign in to view your listings.</p>
        );
    }

    return <div>
        <h3 className={"mt-3"}>My Listings</h3>
        <ListingsList listings={listings} error={undefined} includeDelete={true} setListingsCallback={setListings}/>
    </div>
}