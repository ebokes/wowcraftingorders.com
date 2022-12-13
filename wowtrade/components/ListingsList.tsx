import { BuyerListing, SellerListing } from "../types/types";
import { Alert, Col, Form, ListGroup, Row } from "react-bootstrap";
import { ListingView } from "./ListingView";
import { useEffect, useState } from "react";
import Image from "next/image";
import { dateSort } from "../utils/sort";
import { filterByQuality, filterBySearch } from "../utils/filter";
import { ROOT_URL } from "../pages/_app";
import { signOut, useSession } from "next-auth/react";
import { BUYER } from "./SetRealms";
import { refreshWowheadLinks } from "../utils/wowhead";


const SORT_TYPES = {
    TIME_POSTED_NEW_TO_OLD: "Time Posted (Newest to Oldest)",
}

interface Props {
    type: string; // This is reversed from the rest of the project, but "buyer" indicates these are buyer listings and "seller" indicates these are seller listings
    listings: (BuyerListing | SellerListing)[] | undefined;
    error: any;
    setListingsCallback?: (listings: (BuyerListing | SellerListing)[]) => void;
    includeDelete: boolean;
}

/**
 * Generic component for rendering a list of listings along with a search box and selection of sorts and filters.
 * This generic list inherits the listing type from props rather than from the context, enabling me to mix and
 * match on the same screen if need be.
 */
export default function ListingsList({ type, listings, error, setListingsCallback, includeDelete }: Props) {

    // Errors shouldn't be fatal, but should be thrown silently and a generic error message should be thrown
    if (error) console.error(error);

    // State
    const session = useSession();
    const [search, setSearch] = useState("");
    const [sortMethod, setSortMethod] = useState<string>(SORT_TYPES.TIME_POSTED_NEW_TO_OLD);
    const [quality, setQuality] = useState("All");
    const [errors, setErrors] = useState<string[]>([]);
    const [success, setSuccess] = useState<boolean>(false);

    useEffect(refreshWowheadLinks, [listings]);

    const deleteUserListing = async (id: string) => {
        if (!setListingsCallback) throw new Error(`Attempting to delete when no setListingCallback was provided.`);
        setSuccess(false);
        setErrors([]);
        const response = await fetch(ROOT_URL + `/${type === BUYER ? "buyer_listings" : "seller_listings"}/${id}`, {
            method: "DELETE",
            headers: {
                // TODO: Proper way to not need to ignore this is to extend the Session type
                // @ts-ignore
                "Authorization": `Bearer ${session.data.accessToken}`
            }
        });
        if (!response.ok) {
            switch (response.status) {
                case 401: {
                    alert("Your Battle.net session has expired. Please log in again.");
                    await signOut();
                    break;
                }
                default: {
                    setErrors(["Unknown error deleting listing. Please try again."])
                }
            }
        } else {
            if (listings) setListingsCallback(listings.filter((listing) => listing.id !== id));
            setSuccess(true);
        }
    }

    if (listings) {
        switch (sortMethod) {
            case SORT_TYPES.TIME_POSTED_NEW_TO_OLD:
                listings = listings.sort(dateSort);
                break;
            default:
                throw new Error(`Attempted to sort by unrecognized sort method: ${sortMethod}`);
        }
    }

    return <div>
        <Form className="mb-2 mt-0" style={{ width: "100%" }}>
            <Row>
                <Col md={5}>
                    <Form.Group>
                        <Form.Label>Filter by Name</Form.Label>
                        <Form.Control type="text" value={search}
                                      onChange={(e) => {
                                          setSearch(e.target.value);
                                      }} placeholder="Item Name"/>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>Sort Method</Form.Label>
                        <Form.Control as={"select"} value={sortMethod}
                                      onChange={(e) => {
                                          setSortMethod(e.target.value);
                                      }}>
                            {Object.values(SORT_TYPES).map((sortType: string) => {
                                return <option key={sortType} value={sortType}>{sortType}</option>
                            })}
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group controlId={"quality"}>
                        <Form.Label>Quality</Form.Label>
                        <Form.Control as={"select"}
                                      onChange={(e) => setQuality(e.target.value)}>
                            <option value={"All"}>All</option>
                            <option value={"Rank 1"}>Rank 1 (Worst)</option>
                            <option value={"Rank 2"}>Rank 2</option>
                            <option value={"Rank 3"}>Rank 3</option>
                            <option value={"Rank 4"}>Rank 4</option>
                            <option value={"Rank 5"}>Rank 5 (Best)</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
        </Form>

        {success && <Alert key={"success"} variant={"success"}>Listing deleted successfully.</Alert>}
        {errors.length > 0 && <div>{errors.map((error) => <Alert key={"danger"}>{error}</Alert>)}</div>}

        <Row className={"mt-3"}>
            <Col>
                <h4>{type === BUYER ? "Buyer Listings" : "Seller Listings"}</h4>
                {!listings && !error && <Image width="30" height="30" alt="Loading" src={"/loading.gif"}/>}
                {listings && listings.length === 0 && <div>
                    <p>Click on an item to view all listings for that item!</p>
                    <p>No listings found. Once some are created you'll see them here!</p>
                </div>}
                {error && <div>Error fetching data. Please refresh and try again.</div>}
                <ListGroup>
                    {listings && listings
                        .filter(filterBySearch(search))
                        .filter(filterByQuality(quality))
                        .map((listing: BuyerListing | SellerListing) => (
                            <ListingView type={type} key={listing.id} listing={listing} includeItem includeSeller
                                         includeDelete={includeDelete}
                                         deleteUserListing={deleteUserListing}/>
                        ))}
                </ListGroup>
            </Col>
        </Row>
    </div>
}