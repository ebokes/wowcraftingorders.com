import { Button, Col, Form, InputGroup, ListGroup, Row } from "react-bootstrap";
import { REALM_LIST } from "../data/realms";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ListingPayload } from "../types/types";
import { ROOT_URL } from "./_app";
import { useSession } from "next-auth/react";

export default function Sell() {

    const session = useSession();

    const [region, setRegion] = useState<string>("en");
    const [realm, setRealm] = useState<string>(REALM_LIST[0]);
    const [search, setSearch] = useState<string>("");
    const [characterName, setCharacterName] = useState<string>("");
    const [discordTag, setDiscordTag] = useState<string>("");
    const [battleNetTag, setBattleNetTag] = useState<string>("");
    const [gold, setGold] = useState<string>("0");
    const [silver, setSilver] = useState<string>("0");
    const [copper, setCopper] = useState<string>("0");
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [success, setSuccess] = useState<boolean>(false);

    // Wowhead tooltips
    useEffect(() => {
        const inlineScript = document.createElement('script');
        inlineScript.innerHTML = 'window.$WowheadPower.refreshLinks();';
        document.body.append(inlineScript);

        return () => {
            inlineScript.remove();
        };
    }, [region, realm, search, characterName, discordTag, battleNetTag, gold, silver, copper]);

    if (session.status !== "authenticated") {
        return (
            <p>Please sign in to submit a listing. This ensures people can only post listings for characters they
                own.</p>
        );
    }


    const isValid = () => {
        const errors = [];
        if (!region) errors.push("Region is required.");
        if (!realm) errors.push("Realm is required.");
        if (!search) errors.push("Item ID is required.");
        if (!characterName) errors.push("Character name is required.");
        if (gold === "" && silver === "" && copper === "") errors.push("Commission must be nonzero.");
        setErrors(errors);
        return errors.length === 0;
    }
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors([]);
        setSuccess(false);

        const payload = {
            itemId: parseInt(search),
            commission: {
                gold: parseInt(gold),
                silver: parseInt(silver),
                copper: parseInt(copper),
            },
            seller: {
                region,
                realm,
                characterName,
                discordTag: discordTag === "" ? undefined : discordTag,
                battleNetTag: battleNetTag === "" ? undefined : battleNetTag,
            }
        } as ListingPayload;
        if (!isValid()) {
            setSubmitting(false);
            return;
        }

        try {
            console.log(`Sending payload ${JSON.stringify(payload)} headers ${JSON.stringify({
                "Content-Type": "application/json",
                // @ts-ignore
                "Authorization": `Bearer ${session.data.accessToken}`
            })}`);
            const response = await fetch(`${ROOT_URL}/listings`, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    // @ts-ignore
                    "Authorization": `Bearer ${session.data.accessToken}`
                },
                body: JSON.stringify(payload)
            });
            if (response.status === 201) {
                setSuccess(true);
            } else {
                switch (response.status) {
                    case 400: // Error messages sent alongside with more detail
                    case 401: {
                        const body = await response.json();
                        setErrors(
                            body.map((error: any) => error.message)
                        );
                        break;
                    }
                    case 409: {
                        setErrors(["This character already has a listing for this item."]);
                        break;
                    }
                    default: {
                        console.warn("Unanticipated response from backend: ", response);
                        setErrors(["An unknown error occurred. Please try again shortly."]);
                        break;
                    }
                }
            }
        } catch (err) {
            console.error("Error: ", err);
            setErrors(["Unknown error. Please verify all fields are filled out and correct then try again."]);
            setSubmitting(false);
        }
        setSubmitting(false);
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
                        <Button disabled={submitting} variant="primary" type="submit" style={{ width: "100%" }}
                                onClick={handleSubmit}>
                            Submit Listing
                        </Button>
                    </Col>
                </Row>
            </Form>
            {errors && <ListGroup>
                {errors.map((error) => (
                    <ListGroup.Item variant="danger">{error}</ListGroup.Item>
                ))}
            </ListGroup>}
            {success && <ListGroup>
                <ListGroup.Item variant="success">Successfully submitted listing!</ListGroup.Item>
            </ListGroup>}
        </main>
    </div>
}