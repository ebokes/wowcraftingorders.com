import { Button, Col, Form, InputGroup, ListGroup, Row } from "react-bootstrap";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { Listing, ListingPayload } from "../types/types";
import { RegionRealmContext, ROOT_URL } from "./_app";
import { useSession } from "next-auth/react";
import { SetRegionRealmView } from "../components/SetRealms";
import { ListingView } from "../components/ListingView";

export default function Sell() {

    const session = useSession();
    const context = useContext(RegionRealmContext);
    const [userListings, setUserListings] = useState<Listing[]>([]);

    // Form input
    const [qualityGuarantee, setQualityGuarantee] = useState<string>("Rank 1");
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

    const deleteUserListing = async (id: string) => {
        const response = await fetch(ROOT_URL + `/listings/${id}`, {
            method: "DELETE",
        });
        if (response.ok) {
            setSuccess(true);
            setUserListings(userListings.filter((listing) => listing.id !== id));
        } else {
            setErrors(["Error deleting listing. Please try again."])
        }
    }

    // Wowhead tooltips
    useEffect(() => {
        const inlineScript = document.createElement('script');
        inlineScript.innerHTML = 'window.$WowheadPower.refreshLinks();';
        document.body.append(inlineScript);

        return () => {
            inlineScript.remove();
        };
    }, [context.region, context.realm, search, characterName, discordTag, battleNetTag, gold, silver, copper]);

    // Retrieve listings for user
    useEffect(() => {
        const fetchData = async () => {
            if (!session.data) return;
            const listings = await fetch(`${ROOT_URL}/${context.region}/listings`, {
                method: "GET",
                headers: {
                    // TODO: Proper way to not need to ignore this is to extend the Session type
                    // @ts-ignore
                    "Authorization": `Bearer ${session.data.accessToken}`
                }
            })
            const listingsJson: Listing[] = await listings.json();
            setUserListings(listingsJson);
        }

        fetchData().catch(console.error);
    }, [session, context.region, context.realm]);

    if (session.status !== "authenticated" && !(!process.env.NODE_ENV || process.env.NODE_ENV === 'development')) {
        return (
            <p>Please sign in to submit a listing. This ensures people can only post listings for characters they
                own.</p>
        );
    }


    const isValid = () => {
        const errors = [];
        if (!context.region) errors.push("Region is required.");
        if (!context.realm) errors.push("Realm is required.");
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
            quality: qualityGuarantee,
            commission: {
                gold: parseInt(gold),
                silver: parseInt(silver),
                copper: parseInt(copper),
            },
            seller: {
                region: context.region,
                realm: context.realm,
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
                <SetRegionRealmView/>
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
                    <h4>Item Details</h4>

                    <Form.Group>
                        <Row>
                            <Col md={8}>
                                <Form.Label>Item ID</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text id="basic-addon1">https://www.wowhead.com/item=</InputGroup.Text>
                                    <Form.Control type="number" value={search}
                                                  onChange={(e) => setSearch(e.target.value)
                                                  } placeholder="199686"/>
                                </InputGroup>
                                <Link href={`https://www.wowhead.com/item=${search}`}/>

                            </Col>
                            <Col md={4}>
                                <Form.Label>Quality Guarantee</Form.Label>
                                <Form.Control as={"select"} value={qualityGuarantee}
                                              onChange={(e) => setQualityGuarantee(e.target.value)}>
                                    <option value={"Rank 1"}>Rank 1 (Worst)</option>
                                    <option value={"Rank 2"}>Rank 2</option>
                                    <option value={"Rank 3"}>Rank 3</option>
                                    <option value={"Rank 4"}>Rank 4</option>
                                    <option value={"Rank 5"}>Rank 5 (Best)</option>
                                </Form.Control>

                            </Col>
                        </Row>
                    </Form.Group>
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

            <h3>Existing Listings</h3>
            <ListGroup>
                {userListings && userListings.map((listing) => (
                    <ListingView listing={listing} deleteUserListing={deleteUserListing} includeDelete
                                 key={listing.id}/>
                ))}
            </ListGroup>
        </main>
    </div>
}