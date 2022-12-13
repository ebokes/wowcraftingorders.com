import { Col, Form, Row } from "react-bootstrap";
import { EU_REALMS, US_REALMS } from "../data/realms";
import { useContext, useEffect } from "react";
import { RegionRealmTypeContext } from "../pages/_app";
import { REGIONS } from "../data/regions";
import { refreshWowheadLinks } from "../utils/wowhead";

/*
    Buyer = I'm a buyer, show seller listings and submit buyer listings
    Seller = I'm a seller, show buyer listings and submit seller listings.
 */
export const BUYER = "buyer", SELLER = "seller";

export function SetRegionRealmType() {
    const context = useContext(RegionRealmTypeContext);
    useEffect(refreshWowheadLinks, [context.region, context.realm, context.type]);
    return <Row className={"mb-2"}>
        <Col md={4}>
            <Form.Label>Region</Form.Label>
            <Form.Control as="select"
                          value={context.region} onChange={(e) => {
                context.setRegion(e.target.value); // Error checking done in the context function
            }}>
                <option value={REGIONS.US}>US (Americas)</option>
                <option value={REGIONS.EU}>EU (Europe)</option>
            </Form.Control>
            <Form.Text muted>Currently, only the Americas & Europe are supported.</Form.Text>
        </Col>
        <Col md={4}>
            <Form.Label>Realm</Form.Label>
            <Form.Control as="select"
                          value={context.realm} onChange={(e) => {
                context.setRealm(e.target.value)
            }} placeholder={US_REALMS[0]}>
                {context.region === REGIONS.US && US_REALMS.sort().map((realm) => {
                    return <option key={realm} value={realm}>{realm}</option>
                })}
                {context.region === REGIONS.EU && EU_REALMS.sort().map((realm) => {
                    return <option key={realm} value={realm}>{realm}</option>
                })}
            </Form.Control>
        </Col>
        <Col md={4}>
            <Form.Group>
                <Form.Label>Are you a buyer or seller?</Form.Label>
                <Form.Control as={"select"} value={context.type} onChange={(e) => {
                    switch (e.target.value) {
                        case BUYER: {
                            context.setType(BUYER);
                            break;
                        }
                        case SELLER: {
                            context.setType(SELLER);
                            break;
                        }
                        default: {
                            throw new Error(`Invalid listings type: ${e.target.value}`);
                        }
                    }
                }}>
                    <option value={BUYER}>I'm a Buyer
                    </option>
                    <option value={SELLER}>I'm a Seller
                    </option>
                </Form.Control>
            </Form.Group>
        </Col>
    </Row>
}