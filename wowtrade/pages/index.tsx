import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState } from "react";
import ListingsList from "../components/ListingsList";
import { Col, Form, InputGroup, Row } from "react-bootstrap";

export default function Home() {
    const [region, setRegion] = useState("en");
    const [realm, setRealm] = useState("thrall");

    return (
        <div className={styles.container}>
            <Head>
                <title>WoW Trade</title>
                <meta name="description" content="Trading site for high-quality World of Warcraft work orders."/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={"p-3"}>
                <Form style={{ width: "100%" }}>
                    <Row>
                        <Col>
                            <Form.Label>Region</Form.Label>
                            <Form.Control as="select" value={region} onChange={(e) => setRegion(e.target.value)}>
                                <option value="en">EN (Americas)</option>
                                <option value="eu">EU (Europe)</option>
                                <option value="kr">KR (Korea)</option>
                                <option value="tw">TW (Taiwan)</option>
                            </Form.Control>
                        </Col>
                        <Col>
                            <Form.Label>Realm</Form.Label>
                            <Form.Control value={realm} onChange={(e) => setRealm(e.target.value)}
                                          placeholder={"Area 52"}></Form.Control>
                        </Col>
                    </Row>
                    <InputGroup>
                    </InputGroup>
                </Form>
                <ListingsList region={region} realm={realm}/>
            </main>
        </div>
    )
}
