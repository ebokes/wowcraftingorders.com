import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useContext, useEffect, useState } from "react";
import ListingsList from "../components/ListingsList";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import Link from "next/link";
import { RegionRealmContext } from "./_app";
import { SetRegionRealmView } from "../components/SetRealms";

export default function Home() {

    // TODO: Cache region and realm in localStorage
    const context = useContext(RegionRealmContext);
    const [search, setSearch] = useState("");

    // TODO: Add a "search" button to the input group, which will help not overload the API with useless queries

    // Forces Wowhead tooltips to redraw
    useEffect(() => {
        const inlineScript = document.createElement('script');
        inlineScript.innerHTML = 'window.$WowheadPower.refreshLinks();';
        document.body.append(inlineScript);

        return () => {
            inlineScript.remove();
        };
    }, [context.region, context.realm, search]);

    return (
        <div className={styles.container}>
            <Head>
                <title>WoW Trade</title>
                <meta name="description"
                      content="WowTrade.xyz is a marketplace for high-quality work orders in World of Warcraft (WoW)."/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={"p-3"}>
                <h3>What Is This?</h3>
                <p>WowTrade.xyz is a marketplace for high-quality work orders in World of Warcraft (WoW). Public work
                    orders don't guarantee a quality (if you're unfamiliar with the new crafting system, read <Link
                        href={"https://www.wowhead.com/guide/professions/overview-dragonflight"}>this page on
                        Wowhead</Link>), so this site is intended to enable people to sell high-quality work orders for
                    a
                    higher amount, without needing to spam trade chat.</p>

                <Form style={{ width: "100%" }}>
                    <SetRegionRealmView/>
                    <Row className={"my-4"}>
                        <h4>Item Settings</h4>
                        <p>Allows you to search for a specific item.</p>
                        <Col md={12}>
                            <InputGroup>
                                <InputGroup.Text id="basic-addon1">https://www.wowhead.com/item=</InputGroup.Text>
                                <Form.Control type="number" value={search}
                                              onChange={(e) => {
                                                  setSearch(e.target.value.trim())
                                              }} placeholder="199686"/>
                            </InputGroup>
                            <Link href={`https://www.wowhead.com/item=${search}`}/>
                        </Col>
                    </Row>
                </Form>

                <h3 className={"mt-4"}>Search Results</h3>
                <ListingsList search={search}/>
            </main>
        </div>
    )
}