import { signIn, signOut, useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { RegionRealmTypeContext, ROOT_URL, updateListingTimestamps } from "./_app";
import ListingsList from "../components/ListingsList";
import Link from "next/link";
import { Button, Col, Row } from "react-bootstrap";
import { BUYER, SELLER } from "../components/SetRealms";
import { BuyerListing, SellerListing } from "../types/types";

export default function MyListings() {
    const session = useSession();
    const context = useContext(RegionRealmTypeContext);
    const [buyerListings, setBuyerListings] = useState<(BuyerListing | SellerListing)[] | undefined>();
    const [sellerListings, setSellerListings] = useState<(BuyerListing | SellerListing)[] | undefined>();

    useEffect(() => {
        updateListingTimestamps(session, context.region).catch();
    }, [session])

    // Retrieve listings for user
    useEffect(() => {
        const fetchData = async () => {
            if (!session.data) return;
            try {
                const listings = await fetch(`${ROOT_URL}/${context.region}/buyer_listings`, {
                    method: "GET",
                    headers: {
                        // TODO: Proper way to not need to ignore this is to extend the Session type
                        // @ts-ignore
                        "Authorization": `Bearer ${session.data.accessToken}`
                    }
                })
                if (!listings.ok) {
                    switch (listings.status) {
                        case 401: {
                            alert("Your Battle.net session has expired. Please log in again.");
                            await signOut();
                            break;
                        }
                        default: {
                            console.error(`Error retrieving listings: ${listings.status}`);
                            break;
                        }
                    }
                }
                setBuyerListings(await listings.json());
            } catch (err) {
                console.error(err);
            }

        }

        fetchData().catch();
    }, [session, context.region, context.realm]);

    useEffect(() => {
        const fetchData = async () => {
            if (!session.data) return;
            try {
                const listings = await fetch(`${ROOT_URL}/${context.region}/seller_listings`, {
                    method: "GET",
                    headers: {
                        // TODO: Proper way to not need to ignore this is to extend the Session type
                        // @ts-ignore
                        "Authorization": `Bearer ${session.data.accessToken}`
                    }
                })
                if (!listings.ok) {
                    switch (listings.status) {
                        case 401: {
                            alert("Your Battle.net session has expired. Please log in again.");
                            await signOut();
                            break;
                        }
                        default: {
                            console.error(`Error retrieving listings: ${listings.status}`);
                            break;
                        }
                    }
                }
                setSellerListings(await listings.json());
            } catch (err) {
                console.error(err);
            }
        }

        fetchData().catch(e => console.error(e));
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
        <p>To create a new listing, please use the <Link href={"/create"}>Sell</Link> page. The "Last Active" time on
            your listings will regularly update anytime you are on the site and logged
            into Battle.net. No need to refresh the site or manually re-list anything.</p>

        <Row>
            <Col md={6}>
                <h3>Your Seller Listings</h3>
                <p>These are the listings you've indicated you can <i>craft</i>.</p>
                <ListingsList type={SELLER}
                              listings={sellerListings}
                              error={undefined}
                              includeDelete={true}
                              setListingsCallback={setSellerListings}/>
            </Col>
            <Col md={6}>
                <h3>Your Buyer Listings</h3>
                <p>These are the listings you've indicated you want to <i>buy</i>.</p>
                <ListingsList type={BUYER} listings={buyerListings} error={undefined} includeDelete={true}
                              setListingsCallback={setBuyerListings}/>
            </Col>
        </Row>
    </div>
}