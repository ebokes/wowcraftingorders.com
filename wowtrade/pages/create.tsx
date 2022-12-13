import { signIn, signOut, useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { RegionRealmTypeContext, ROOT_URL } from "./_app";
import { BuyerListingPayload, SellerListingPayload } from "../types/types";
import { Button, Col, Form, InputGroup, ListGroup, Row } from "react-bootstrap";
import { BAD_WORDS } from "../data/badwords";
import Link from "next/link";
import { BUYER, SELLER, SetRegionRealmType } from "../components/SetRealms";
import { INFUSIONS } from "../data/reagents/infusions";
import { ReagentsView } from "../components/Reagents";
import { ItemSelectView } from "../components/ItemSelect";

export default () => {
    const session = useSession();
    const context = useContext(RegionRealmTypeContext);

    let [payload, setPayload] = useState<BuyerListingPayload | SellerListingPayload>({
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
        providedReagents: [],
        infusions: context.type === SELLER ? INFUSIONS : undefined
    });

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [success, setSuccess] = useState<boolean>(false);

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
            if (payload.details && payload.details.length > 400) {
                errors.push("Details must be <= 400 characters.");
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
            const response = await fetch(`${ROOT_URL}/${context.type === BUYER ? "buyer_listings" : "seller_listings"}`, {
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
                        alert("Your Battle.net login session has expired. Please log in again.")
                        await signOut();
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
                <Row className={"my-1"}>
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
                            <Form.Text muted>Optional, but recommended.</Form.Text>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className={"my-1"}>
                    <h4>Item Details</h4>
                    <Form.Group>
                        <Row className={"mb-3"}>
                            <Col md={12}>
                                <Form.Label>Item</Form.Label>
                                <ItemSelectView payload={payload} setPayload={setPayload}/>
                                {!!payload.itemId &&
                                    <h5 className={"mt-2"}><Link
                                        data-wowhead={`https://www.wowhead.com/item=${payload.itemId}`}
                                        href="#"></Link></h5>}
                                {!!payload.itemId && <div>
                                    <ReagentsView payload={payload} setPayload={setPayload}/>
                                </div>}
                            </Col>
                        </Row>
                    </Form.Group>
                </Row>
                <Row className={"my-1"}>
                    <Col md={3}>
                        <Form.Label>{context.type === BUYER ? "Desired Quality" : "Minimum Quality"}</Form.Label>
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
                            <option value={"Rank 2"}>Rank 2</option>
                            <option value={"Rank 3"}>Rank 3</option>
                            <option value={"Rank 4"}>Rank 4</option>
                            <option value={"Rank 5"}>Rank 5 (Best)</option>
                        </Form.Control>
                    </Col>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>{context.type === BUYER ? "Commission I'll Pay" : "Commission I Want"}</Form.Label>
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
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Label>Additional Details</Form.Label>
                        <Form.Control
                            type="text" value={payload.details}
                            onChange={(e) => {
                                setPayload({ ...payload, details: e.target.value });
                            }}/>
                        <Form.Text muted>Provide any other information you want
                            to, such as your inspiration proc chance.</Form.Text>
                    </Col>
                </Row>
                <Row className={"mt-3"}>
                    <Col md={12}>
                        <Button disabled={submitting} variant="primary" type="submit" style={{ width: "100%" }}
                                onClick={handleSubmit}>
                            Submit Listing
                        </Button>
                        <Form.Text>Please double-check you selected whether you're a buyer or seller, which
                            determines which type of listing this creates.</Form.Text>
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