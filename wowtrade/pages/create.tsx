import { Button, Col, Form, InputGroup, ListGroup, Row } from "react-bootstrap";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { ListingPayload, ReagentStack } from "../types/types";
import { RegionRealmTypeContext, ROOT_URL, updateListingTimestamps } from "./_app";
import { signIn, useSession } from "next-auth/react";
import { SetRegionRealmType } from "../components/SetRealms";
import { ITEMS } from "../data/items";
import ReactSelect from "react-select";
import { BAD_WORDS } from "../data/badwords";

export default function Create() {

    const session = useSession();
    const context = useContext(RegionRealmTypeContext);

    useEffect(() => {
        updateListingTimestamps(session, context.region).catch();
    }, [session])

    // Form input
    // TODO: Should probably model the state as an actual payload object
    let [payload, setPayload] = useState<ListingPayload>({
        itemId: 0,
        commission: {
            copper: 0,
            silver: 0,
            gold: 0
        },
        quality: "Rank 1",
        seller: {
            region: context.region,
            realm: context.realm,
            characterName: "",
        },
        providedReagents: []
    });
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
    }, [context.region, context.realm, payload]);

    if (session.status !== "authenticated" && !(!process.env.NODE_ENV || process.env.NODE_ENV === 'development')) {
        return (
            <div>
                <p className={"mt-5"}>Please sign in to submit a listing. This ensures people can only post listings for
                    characters they own.</p>
                {!session && <Button onClick={() => signIn("battlenet")}>Sign In to Battle.net</Button>}
            </div>
        );
    }


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors([]);
        setSuccess(false);

        // Workaround for payload keeping its initial values for context
        const updatedPayload = {
            ...payload, seller: {
                ...payload.seller, region: context.region, realm: context.realm
            }
        }

        const isValid = () => {
            const errors = [];
            if (!context.region) errors.push("Region is required.");
            if (!context.realm) errors.push("Realm is required.");
            if (!payload.itemId) errors.push("Item ID is required.");
            if (!payload.seller.characterName) errors.push("Character name is required.");
            if (payload.commission.gold === 0 && payload.commission.silver === 0 && payload.commission.copper === 0) {
                errors.push("Commission must be nonzero.");
            }
            if (payload.details && payload.details.length > 200) {
                errors.push("Details must be <= 200 characters.");
            }
            if (BAD_WORDS.find(word => payload.details && payload.details.toLowerCase().includes(word), false)) {
                errors.push("Please do not use inappropriate language in your additional details.");
            }

            setErrors(errors);
            return errors.length === 0;
        }
        if (!isValid()) {
            setSubmitting(false);
            return;
        }
        try {
            console.log(`Sending payload`, payload);
            const response = await fetch(`${ROOT_URL}/${context.type}`, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    // @ts-ignore
                    "Authorization": `Bearer ${session.data.accessToken}`
                },
                body: JSON.stringify(updatedPayload)
            });
            if (response.ok) {
                await response.json();
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
                        setErrors(["This character already has a listing for this item. Please delete and re-list if you need to change it."]);
                        break;
                    }
                    default: {
                        setErrors(["An unknown error occurred. Please try again shortly."]);
                        break;
                    }
                }
            }
        } catch (err) {
            setErrors(["Unknown error. Please verify all fields are filled out and correct then try again."]);
            console.error(err);
            setSubmitting(false);
        }
        setSubmitting(false);
    }

    return <div>
        <main className={"p-3"}>
            <h3>Create a Listing</h3>
            <p>To view your current listings, please use the <Link href={"my-listings"}>My Listings</Link> page.</p>
            <Form style={{ width: "100%" }}>
                <SetRegionRealmType/>
                <Row className={"my-3"}>
                    <h4>Seller Details</h4>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Character Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={payload.seller.characterName}
                                onChange={(e) => setPayload({
                                    ...payload,
                                    seller: { ...payload.seller, characterName: e.target.value }
                                })
                                }/>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Discord Tag</Form.Label>
                            <Form.Control
                                type="text" value={payload.seller.discordTag}
                                onChange={(e) => setPayload({
                                    ...payload,
                                    seller: { ...payload.seller, discordTag: e.target.value }
                                })
                                }/>
                            <Form.Text muted>Optional, but recommended.</Form.Text>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Battle.net Tag</Form.Label>
                            <Form.Control
                                type="text"
                                value={payload.seller.battleNetTag} onChange={(e) => setPayload({
                                ...payload,
                                seller: { ...payload.seller, battleNetTag: e.target.value }
                            })}/>
                            <Form.Text muted>Optional.</Form.Text>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className={"my-3"}>
                    <h4>Item Details</h4>
                    <Form.Group>
                        <Row>
                            <Col md={4}>
                                <Form.Label>Item</Form.Label>
                                <ReactSelect
                                    styles={{
                                        control: (baseStyles) => ({
                                            ...baseStyles,
                                            backgroundColor: "rgb(20, 25, 30)",

                                        }),
                                        dropdownIndicator: (baseStyles) => ({
                                            ...baseStyles,
                                            color: "white"
                                        }),
                                        option: (baseStyles) => ({
                                            ...baseStyles,
                                            backgroundColor: "rgb(20, 25, 30)",
                                            color: "white",
                                            ":hover": {
                                                backgroundColor: "rgb(40, 45, 50)",
                                            }
                                        }),
                                        menu: (baseStyles) => ({
                                            ...baseStyles,
                                            backgroundColor: "rgb(20, 25, 30)"
                                        }),
                                        singleValue: (baseStyles) => ({
                                            ...baseStyles,
                                            color: "white"
                                        }),
                                    }}
                                    defaultValue={{ value: -1, label: "No Item Selected" }}
                                    onChange={(newValue) => {
                                        if (!newValue) return;
                                        setPayload({ ...payload, itemId: newValue.value })
                                    }} options={[...ITEMS]
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .map(item => {
                                        return {
                                            value: item.id,
                                            label: item.name
                                        }
                                    })
                                    .concat([{ value: -1, label: "No Item Selected" }])
                                }/>

                                {!!payload.itemId &&
                                    <Link data-wowhead={`https://www.wowhead.com/item=${payload.itemId}`}
                                          href="#"></Link>}
                                {!!payload.itemId && <div>
                                    <Form>
                                        <ul>
                                            {ITEMS.find(item => item.id === payload.itemId)?.reagents.map(reagent => {
                                                return <li key={reagent.reagent.itemId}>{reagent.count}{"x "}<Link
                                                    href={`https://www.wowhead.com/item=${reagent.reagent.itemId}`}></Link>
                                                    {!!reagent.reagent.buyerProvides &&
                                                        <span>{" (Buyer-Provided)"}</span>}
                                                    {!reagent.reagent.buyerProvides &&
                                                        <Form.Check onChange={() => {
                                                            payload.providedReagents.find((iterationReagent: ReagentStack) => iterationReagent.reagent.itemId === reagent.reagent.itemId)
                                                                ? setPayload({
                                                                    ...payload,
                                                                    providedReagents: payload.providedReagents.filter((iterationReagent: ReagentStack) => iterationReagent.reagent.itemId !== reagent.reagent.itemId)
                                                                }) : setPayload({
                                                                    ...payload,
                                                                    providedReagents: [
                                                                        ...payload.providedReagents,
                                                                        reagent
                                                                    ]
                                                                })
                                                        }} type={"checkbox"}
                                                                    id={`reagent-${reagent.reagent.itemId}`}
                                                                    label={"I will provide this!"}/>}
                                                </li>
                                            })}
                                        </ul>
                                    </Form>
                                </div>}
                            </Col>
                            <Col md={4}>
                                <Form.Label>Minimum Quality</Form.Label>
                                <Form.Control
                                    as={"select"} value={payload.quality}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === "Rank 1" || value === "Rank 2" || value === "Rank 3" || value === "Rank 4" || value === "Rank 5") {
                                            setPayload({ ...payload, quality: value })
                                        } else {
                                            throw new Error(`Invalid quality ${e.target.value}`);
                                        }
                                    }}>
                                    <option value={"Rank 1"}>Rank 1 (Worst)</option>
                                    <option value={"Rank 1"}>Rank 1 (Worst)</option>
                                    <option value={"Rank 2"}>Rank 2</option>
                                    <option value={"Rank 3"}>Rank 3</option>
                                    <option value={"Rank 4"}>Rank 4</option>
                                    <option value={"Rank 5"}>Rank 5 (Best)</option>
                                </Form.Control>
                            </Col>
                            <Col md={4}>
                                <Form.Label>Additional Details</Form.Label>
                                <Form.Control
                                    type="text" value={payload.details}
                                    onChange={(e) => {
                                        setPayload({ ...payload, details: e.target.value });
                                    }}/>
                                <Form.Text muted>Free text field to provide any other information you want
                                    to. Please be civil.</Form.Text>
                            </Col>
                        </Row>
                    </Form.Group>
                </Row>
                <Row className={"my-3"}>
                    <h4>Commission</h4>
                    <Col md={4}>
                        <InputGroup>
                            <Form.Control
                                type="number" value={payload.commission.gold}
                                onChange={(e) => setPayload({
                                    ...payload, commission: {
                                        ...payload.commission, gold: parseInt(e.target.value)
                                    }
                                })
                                }/>
                            <InputGroup.Text
                                className={"bg-dark"} id="basic-addon1">gold</InputGroup.Text>
                        </InputGroup>
                    </Col>
                    <Col md={4}>
                        <InputGroup>
                            <Form.Control
                                type="number"
                                value={payload.commission.silver}
                                onChange={(e) => setPayload({
                                    ...payload, commission: {
                                        ...payload.commission, silver: parseInt(e.target.value)
                                    }
                                })}/>
                            <InputGroup.Text
                                className={"bg-dark"} id="basic-addon1">silver</InputGroup.Text>
                        </InputGroup>
                    </Col>
                    <Col md={4}>
                        <InputGroup>
                            <Form.Control
                                type="number"
                                value={payload.commission.copper}
                                onChange={(e) => setPayload({
                                    ...payload, commission: {
                                        ...payload.commission, copper: parseInt(e.target.value)
                                    }
                                })}/>
                            <InputGroup.Text
                                className={"bg-dark"} id="basic-addon1">copper</InputGroup.Text>
                        </InputGroup>
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