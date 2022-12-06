import { signIn, useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { RegionRealmTypeContext, ROOT_URL, updateListingTimestamps } from "./_app";
import { Listing } from "../types/types";
import ListingsList from "../components/ListingsList";
import Link from "next/link";
import { Button } from "react-bootstrap";

export default function MyListings() {
    const session = useSession();
    const context = useContext(RegionRealmTypeContext);
    const [buyerListings, setBuyerListings] = useState<Listing[] | undefined>();
    const [sellerListings, setSellerListings] = useState<Listing[] | undefined>();

    useEffect(() => {
        updateListingTimestamps(session, context.region).catch();
    }, [session])

    // Retrieve listings for user
    useEffect(() => {
        const fetchData = async () => {
            if (!session.data) return;
            const listings = await fetch(`${ROOT_URL}/${context.region}/buyer_listings`, {
                method: "GET",
                headers: {
                    // TODO: Proper way to not need to ignore this is to extend the Session type
                    // @ts-ignore
                    "Authorization": `Bearer ${session.data.accessToken}`
                }
            })
            setBuyerListings(await listings.json());
        }

        fetchData().catch();
    }, [session, context.region, context.realm]);

    useEffect(() => {
        const fetchData = async () => {
            if (!session.data) return;
            const listings = await fetch(`${ROOT_URL}/${context.region}/seller_listings`, {
                method: "GET",
                headers: {
                    // TODO: Proper way to not need to ignore this is to extend the Session type
                    // @ts-ignore
                    "Authorization": `Bearer ${session.data.accessToken}`
                }
            })
            setSellerListings(await listings.json());
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

        {sellerListings && <div>
            <h3>Your Seller Listings</h3>
            <p>These are the listings you've indicated you can <i>craft</i>.</p>
            <ListingsList type={"seller_listings"} listings={sellerListings} error={undefined} includeDelete={true}
                          setListingsCallback={setSellerListings}/>
        </div>}

        {buyerListings && <div><h3>Your Buyer Listings (you want to buy these items)</h3>
            <p>These are the listings you've indicated you want to <i>buy</i>.</p>
            <ListingsList type={"buyer_listings"} listings={buyerListings} error={undefined} includeDelete={true}
                          setListingsCallback={setBuyerListings}/>
        </div>}

    </div>
}