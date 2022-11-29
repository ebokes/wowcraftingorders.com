import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from "react";
import ListingsList from "../components/ListingsList";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { REALM_LIST } from "../data/realms";
import Link from "next/link";

export default function Home() {

    // TODO: Cache region and realm in localStorage
    const [region, setRegion] = useState("en");
    const [realm, setRealm] = useState(REALM_LIST[0]);
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
    }, [region, realm, search]);

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
                    orders don't guarantee a quality (if you're unfamiliar with the new crafting system, read <a
                        href={"https://www.wowhead.com/guide/professions/overview-dragonflight"}>this page on
                        Wowhead</a>), so this site is intended to enable people to sell high-quality work orders for a
                    higher amount, without needing to spam trade chat.</p>

                <Form style={{ width: "100%" }}>
                    <Row>
                        <h4>Realm Settings</h4>
                        <Col>
                            <Form.Label>Region</Form.Label>
                            <Form.Control as="select" value={region} onChange={(e) => {
                                localStorage.setItem("region", e.target.value);
                                setRegion(e.target.value)
                            }}>
                                <option value="en">EN (Americas)</option>
                            </Form.Control>
                            <Form.Text muted>Will be adding more regions soon!</Form.Text>
                        </Col>
                        <Col>
                            <Form.Label>Realm</Form.Label>
                            <Form.Control as="select" value={realm} onChange={(e) => {
                                localStorage.setItem("realm", e.target.value);
                                setRealm(e.target.value)
                            }}
                                          placeholder={REALM_LIST[0]}>
                                {REALM_LIST.sort().map((realm) => (
                                    <option key={realm} value={realm}>{realm}</option>
                                ))}
                            </Form.Control>
                            <Form.Text muted>Will add a quicker way to search soon!</Form.Text>
                        </Col>
                    </Row>
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
                <ListingsList region={region} realm={realm} search={search}/>
            </main>
        </div>
    )
}