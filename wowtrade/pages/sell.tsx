import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { REALM_LIST } from "../data/realms";
import Link from "next/link";
import { useState } from "react";
import { ListingPayload } from "../types/types";
import { ROOT_URL } from "./_app";

export default function Sell() {
    const [region, setRegion] = useState<string>("en");
    const [realm, setRealm] = useState<string>("thrall");
    const [search, setSearch] = useState<string>("");
    const [characterName, setCharacterName] = useState<string>("");
    const [discordTag, setDiscordTag] = useState<string>("");
    const [battleNetTag, setBattleNetTag] = useState<string>("");
    const [gold, setGold] = useState<string>("0");
    const [silver, setSilver] = useState<string>("0");
    const [copper, setCopper] = useState<string>("0");
    const [errors, setErrors] = useState<string[]>([]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const payload = {
            itemId: parseInt(search),
            commission: {
                gold: parseInt(gold),
                silver: parseInt(silver),
                copper: parseInt(copper),
            },
            seller: {}
        } as ListingPayload;
        try {
            const response = await fetch(`${ROOT_URL}/listings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const body = await response.json();
                console.log("body: ", body);
                console.log("body: ", body);
                alert("Errors: \n" + body);
            } else {
                alert("Successfully submitted listing!");
            }
        } catch (err) {
            console.error("Error: ", err);
            alert("Unknown error. Please check that all fields are filled out and correct.");
        }
    }

    return <div>
        <main className={"p-3"}>
            <h3>Create a Listing</h3>
            <Form style={{ width: "100%" }}>
                <Row>
                    <h4>Realm Options</h4>
                    <Col>
                        <Form.Label>Region</Form.Label>
                        <Form.Control as="select" value={region} onChange={(e) => {
                            localStorage.setItem("region", e.target.value);
                            setRegion(e.target.value);
                        }}>
                            <option value="en">EN (Americas)</option>
                            <option value="eu">EU (Europe)</option>
                            <option value="kr">KR (Korea)</option>
                            <option value="tw">TW (Taiwan)</option>
                        </Form.Control>
                    </Col>
                    <Col>
                        <Form.Label>Realm</Form.Label>
                        <Form.Control as="select" value={realm} onChange={(e) => {
                            localStorage.setItem("realm", e.target.value);
                            setRealm(e.target.value)
                        }}
                                      placeholder={REALM_LIST[0]}>
                            {REALM_LIST.sort().map((realm) => (
                                <option value={realm}>{realm}</option>
                            ))}
                        </Form.Control>
                    </Col>
                </Row>
                <Row className={"my-3"}>
                    <h4>Item Details</h4>
                    <Col md={12}>
                        <InputGroup>
                            <InputGroup.Text id="basic-addon1">https://www.wowhead.com/item=</InputGroup.Text>
                            <Form.Control type="number" value={search} onChange={(e) => setSearch(e.target.value)
                            } placeholder="199686"/>
                        </InputGroup>
                        <Link href={`https://www.wowhead.com/item=${search}`}/>
                    </Col>
                </Row>
                <Row className={"my-3"}>
                    <h4>Commission</h4>
                    <Col md={4}>
                        <InputGroup>
                            <Form.Control type="number" value={gold} onChange={(e) => setGold(e.target.value)
                            }/>
                            <InputGroup.Text id="basic-addon1">gold</InputGroup.Text>
                        </InputGroup>
                    </Col>
                    <Col md={4}>
                        <InputGroup>
                            <Form.Control type="number" value={silver} onChange={(e) => setSilver(e.target.value)
                            }/>
                            <InputGroup.Text id="basic-addon1">silver</InputGroup.Text>
                        </InputGroup>
                    </Col>
                    <Col md={4}>
                        <InputGroup>
                            <Form.Control type="number" value={copper} onChange={(e) => setCopper(e.target.value)
                            }/>
                            <InputGroup.Text id="basic-addon1">copper</InputGroup.Text>
                        </InputGroup>
                    </Col>
                </Row>
                <Row className={"my-3"}>
                    <h4>Seller Details</h4>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Character Name</Form.Label>
                            <Form.Control type="text" value={characterName}
                                          onChange={(e) => setCharacterName(e.target.value)
                                          }/>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Discord Tag</Form.Label>
                            <Form.Control type="text" value={discordTag} onChange={(e) => setDiscordTag(e.target.value)
                            }/>
                            <Form.Text muted>Optional, but recommended.</Form.Text>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Battle.net Tag</Form.Label>
                            <Form.Control type="text" value={battleNetTag}
                                          onChange={(e) => setBattleNetTag(e.target.value)
                                          }/>
                            <Form.Text muted>Optional.</Form.Text>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className={"my-3"}>
                    <Col md={12}>
                        <Button variant="primary" type="submit" style={{ width: "100%" }} onClick={handleSubmit}>
                            Submit Listing
                        </Button>
                    </Col>
                </Row>
            </Form>
        </main>
    </div>
}