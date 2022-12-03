import { Card, ListGroup, Row } from "react-bootstrap";
import { ListingView } from "../components/ListingView";
import Image from "next/image";
import Script from "next/script";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { RegionRealmContext, ROOT_URL } from "./_app";
import { Listing } from "../types/types";
import Link from "next/link";

export default function MyListings() {
    const session = useSession();
    const context = useContext(RegionRealmContext);
    const [userListings, setUserListings] = useState<Listing[] | undefined>(undefined);
    const [errors, setErrors] = useState<string[]>([]);
    const [success, setSuccess] = useState<boolean>(false);

    const deleteUserListing = async (id: string) => {
        setSuccess(false);
        setErrors([]);
        const response = await fetch(ROOT_URL + `/listings/${id}`, {
            method: "DELETE",
            headers: {
                // TODO: Proper way to not need to ignore this is to extend the Session type
                // @ts-ignore
                "Authorization": `Bearer ${session.data.accessToken}`
            }
        });
        if (response.ok) {
            setSuccess(true);
            setUserListings(userListings ? userListings.filter((listing) => listing.id !== id) : []);
        } else {
            setErrors(["Error deleting listing. Please try again."])
        }
    }

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
            setUserListings(listingsJson);
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
        <Row sm={1} lg={2} xxl={3} className="card-deck">
            {userListings && userListings.map((listing) => (
                <div
                    key={listing.id}
                    className="p-2"
                    style={{ alignItems: "stretch" }}
                >
                    <Card
                        style={{
                            boxShadow: "rgba(140, 140, 140, 0.2) 0px 0px 4px 3px",
                            height: "100%",
                            minHeight: "100%",
                            padding: "20px",
                            paddingBottom: "50px"
                        }}
                    >
                        <ListingView listing={listing} includeSeller={false} includeDelete={true} includeTimestamp
                                     deleteUserListing={deleteUserListing}/>
                    </Card>
                </div>

            ))}
        </Row>
        {errors && <ListGroup>
            {errors.map((error) => (
                <ListGroup.Item variant="danger">{error}</ListGroup.Item>
            ))}
        </ListGroup>}
        {success && <ListGroup>
            <ListGroup.Item variant="success">Successfully deleted listing!</ListGroup.Item>
        </ListGroup>}

        {userListings === undefined && <Image width="30" height="30" alt="Loading" src={"/loading.gif"}/>}
        {userListings && userListings.length === 0 &&
            <p>You haven't listed anything yet. <Link href={"/sell"}>Submit a listing</Link> and it'll show up here!
            </p>}
        {userListings && <Script strategy={"afterInteractive"}>{`window.$WowheadPower.refreshLinks();`}</Script>}
    </div>
}