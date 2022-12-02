import useSWR from "swr";
import { Listing } from "../types/types";
import Script from "next/script";
import { Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import { ListingView } from "./ListingView";
import { dateSort } from "../util/utils";
import { useContext, useEffect, useState } from "react";
import { RegionRealmContext } from "../pages/_app";
import { ITEMS } from "../data/items";
import Link from "next/link";
import { refreshWowheadLinks } from "../pages";
import Image from "next/image";

export function totalMoneyValue(gold: number | undefined, silver: number | undefined, copper: number | undefined) {
    return (gold ?? 0) * 10000 + (silver ?? 0) * 100 + (copper ?? 0);
}

// TODO: Only show each item once, with its lowest commission
export default function ListingsList() {
    const context = useContext(RegionRealmContext);
    const { data, error } = useSWR(`/${context.region}/${context.realm}/items`);
    const [search, setSearch] = useState("");
    useEffect(refreshWowheadLinks, [search]);

    if (error) return <div>Failed to load listings. Please try and refresh the page.</div>
    if (!data) return <Image width="30" height="30" alt="Loading" src={"/loading.gif"}/>
    if (data && !data.length) return <div>No listings found.</div>


    return <div>
        <Form style={{ width: "100%" }}>
            <Row className={"my-4"}>
                <Col md={12}>
                    <InputGroup>
                        <Form.Control type="text" value={search}
                                      onChange={(e) => {
                                          setSearch(e.target.value);
                                      }} placeholder="Filter Items..."/>
                    </InputGroup>
                    <Link href={`https://www.wowhead.com/item=${search}`}/>
                </Col>
            </Row>
        </Form>
        <Row sm={1} lg={2} xxl={3} className="card-deck">
            {data
                .filter(() => { // Filter by search query
                    if (search === "") return true;
                    return ITEMS.find(item => item.name.toLowerCase().replace(" ", "").includes(search.toLowerCase().replace(" ", "")));
                })
                .filter((listing: Listing) => { // Filter by whether it's the lowest commission for the item
                    const otherListings = data.filter((otherListing: Listing) => {
                        return otherListing.itemId === listing.itemId;
                    });
                    return otherListings.every((otherListing: Listing) => {
                        return totalMoneyValue(otherListing.commission.gold, otherListing.commission.silver, otherListing.commission.copper) >= totalMoneyValue(listing.commission.gold, listing.commission.silver, listing.commission.copper);
                    });
                })
                .sort(dateSort) // TODO: Should probably sort primarily by newest to oldest, once I have a timestamp here
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
                                paddingBottom: "20px",
                            }}
                        >
                            <ListingView listing={listing} includeDelete={false} key={listing.id}/>
                        </Card>
                    </div>
                ))}
        </Row>
        {data && <Script strategy={"afterInteractive"}>{`window.$WowheadPower.refreshLinks();`}</Script>}
    </div>
}