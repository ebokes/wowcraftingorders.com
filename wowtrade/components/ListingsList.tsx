import { Listing } from "../types/types";
import Script from "next/script";
import { Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import { ListingView } from "./ListingView";
import { useEffect, useState } from "react";
import { refreshWowheadLinks } from "../util/wowhead";
import Image from "next/image";
import { dateSort } from "../util/sort";
import { data } from "browserslist";
import { filterBySearch } from "../util/filter";


const SORT_TYPES = {
    TIME_POSTED_NEW_TO_OLD: "Time Posted - New to Old",
}

interface Props {
    listings: Listing[];
    error: any;
}

/**
 * Generic component for rendering a list of listings along with a search box and selection of sorts and filters.
 */
export default function ListingsList({ listings, error }: Props) {

    // Errors shouldn't be fatal, but should be hidden from users
    if (error) console.error(error);

    // State
    const [search, setSearch] = useState("");
    const [sortMethod, setSortMethod] = useState<string>(SORT_TYPES.TIME_POSTED_NEW_TO_OLD);

    // Hooks
    useEffect(refreshWowheadLinks, [search]);

    switch (sortMethod) {
        case SORT_TYPES.TIME_POSTED_NEW_TO_OLD:
            listings = listings.sort(dateSort);
            break;
        default:
            throw new Error(`Attempted to sort by unrecognized sort method: ${sortMethod}`);
    }

    return <div>
        <Form style={{ width: "100%" }}>
            <Row className={"my-4"}>
                <Col md={8}>
                    <InputGroup>
                        <Form.Label>Filter by Name</Form.Label>
                        <Form.Control type="text" value={search}
                                      onChange={(e) => {
                                          setSearch(e.target.value);
                                      }} placeholder="Item Name"/>
                    </InputGroup>
                </Col>
                <Col md={4}>
                    <InputGroup>
                        <Form.Label>Sort Method</Form.Label>
                        <Form.Control as={"select"} value={sortMethod}
                                      onChange={(e) => {
                                          setSortMethod(e.target.value);
                                      }}>
                            {Object.keys(SORT_TYPES).map((sortType: string) => {
                                return <option value={sortType}>{sortType}</option>
                            })}
                        </Form.Control>
                    </InputGroup>
                </Col>
            </Row>
        </Form>
        {!listings && <Image width="30" height="30" alt="Loading" src={"/loading.gif"}/>}
        {listings && listings.length === 0 && <div>No listings found.</div>}
        {error && <div>Error fetching data. Please refresh and try again.</div>}

        <Row sm={1} lg={2} xxl={3} className="card-deck">
            {listings
                .filter(filterBySearch(search))
                .map((listing: Listing) => (
                    <div
                        key={listing.id}
                        className="p-2"
                        style={{ alignItems: "stretch" }}
                    >
                        <Card
                            style={{
                                boxShadow: "rgba(140, 140, 140, 0.2) 0px 0px 4px 3px",
                                padding: "20px",
                                minHeight: "100%",
                                paddingBottom: "40px",
                            }}
                        >
                            <ListingView listing={listing} includeItem includeSeller includeTimestamp={false}
                                         includeDelete={false}
                                         key={listing.id}/>
                        </Card>
                    </div>
                ))}
        </Row>
        {data && <Script strategy={"afterInteractive"}>{`window.$WowheadPower.refreshLinks();`}</Script>}
    </div>
}