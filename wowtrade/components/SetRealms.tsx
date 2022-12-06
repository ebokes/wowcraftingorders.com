import { Col, Form, Row } from "react-bootstrap";
import { EU_REALMS, US_REALMS } from "../data/realms";
import { useContext } from "react";
import { RegionRealmTypeContext } from "../pages/_app";
import { REGIONS } from "../data/regions";

export function SetRegionRealmType() {
    const context = useContext(RegionRealmTypeContext);
    return <Row>
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
                <Form.Label>Listings Type</Form.Label>
                <Form.Control as={"select"} value={context.type} onChange={(e) => {
                    switch (e.target.value) {
                        case "buyer_listings": {
                            context.setType("buyer_listings");
                            break;
                        }
                        case "seller_listings": {
                            context.setType("seller_listings");
                            break;
                        }
                        default: {
                            throw new Error(`Invalid listings type: ${e.target.value}`);
                        }
                    }
                }}>
                    <option value={"seller_listings"}>I'm a Buyer
                    </option>
                    <option value={"buyer_listings"}>I'm a Crafter
                    </option>
                </Form.Control>
            </Form.Group>
        </Col>
    </Row>
}