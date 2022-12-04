import { Listing } from "../types/types";
import { Alert, Card, Col, Form, Row } from "react-bootstrap";
import { ListingView } from "./ListingView";
import { useEffect, useState } from "react";
import { refreshWowheadLinks } from "../utils/wowhead";
import Image from "next/image";
import { dateSort } from "../utils/sort";
import { filterByQuality, filterBySearch } from "../utils/filter";
import { ROOT_URL } from "../pages/_app";
import { useSession } from "next-auth/react";


const SORT_TYPES = {
    TIME_POSTED_NEW_TO_OLD: "Time Posted (Newest to Oldest)",
}

interface Props {
    listings: Listing[] | undefined;
    error: any;
    setListingsCallback?: (listings: Listing[]) => void;
}

/**
 * Generic component for rendering a list of listings along with a search box and selection of sorts and filters.
 */
export default function ListingsList({ listings, error, setListingsCallback }: Props) {

    // Errors shouldn't be fatal, but should be thrown silently and a generic error message should be thrown
    if (error) console.error(error);

    // State
    const session = useSession();
    const [search, setSearch] = useState("");
    const [sortMethod, setSortMethod] = useState<string>(SORT_TYPES.TIME_POSTED_NEW_TO_OLD);
    const [quality, setQuality] = useState("All");
    const [errors, setErrors] = useState<string[]>([]);
    const [success, setSuccess] = useState<boolean>(false);

    // Hooks
    useEffect(refreshWowheadLinks, [search, listings, error]);

    const deleteUserListing = async (id: string) => {
        if (!setListingsCallback) throw new Error(`Attempting to delete when no setListingCallback was provided.`);
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
            if (listings) setListingsCallback(listings.filter((listing) => listing.id !== id));
        } else {
            setErrors(["Error deleting listing. Please try again."])
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
            <Row className={"my-4"}>
                <Col md={8}>
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
            </Row>
            <Row>
                <Col md={12}>
                    <Form.Group controlId={"quality"}>
                        <Form.Label>Minimum Quality</Form.Label>
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

        {!listings && !error && <Image width="30" height="30" alt="Loading" src={"/loading.gif"}/>}
        {listings && listings.length === 0 && <div>No listings found.</div>}
        {error && <div>Error fetching data. Please refresh and try again.</div>}

        {success && <Alert key={"success"}>Listing deleted successfully.</Alert>}
        {errors.length > 0 && <div>{errors.map((error) => <Alert key={"danger"}>{error}</Alert>)}</div>}

        <Row sm={1} lg={2} xxl={3} className="card-deck pb-5" style={{ height: "fit-content" }}>
            {listings && listings
                .filter(filterBySearch(search))
                .filter(filterByQuality(quality))
                .map((listing: Listing) => (
                    <div
                        key={listing.id}
                        className="p-2"
                        style={{ alignItems: "stretch" }}
                    >
                        <Card
                            className={"bg-black text-white"}
                            style={{
                                border: "2px gray solid",
                                padding: "20px",
                                minHeight: "100%",
                                paddingBottom: "50px",
                            }}
                        >
                            <ListingView key={listing.id} listing={listing} includeItem includeSeller
                                         includeTimestamp={false}
                                         includeDelete={true} deleteUserListing={deleteUserListing}/>
                        </Card>
                    </div>
                ))}
        </Row>
    </div>
}