import { Col, Form, Row } from "react-bootstrap";
import { REALM_LIST } from "../data/realms";
import { useContext } from "react";
import { RegionRealmContext } from "../pages/_app";
import { REGIONS } from "../data/regions";

export function SetRegionRealmView() {
    const context = useContext(RegionRealmContext);
    return <Row>
        <Col>
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
        <Col>
            <Form.Label>Realm</Form.Label>
            <Form.Control as="select"
                          value={context.realm} onChange={(e) => {
                context.setRealm(e.target.value)
            }}
                          placeholder={REALM_LIST[0]}>
                {REALM_LIST.sort().map((realm) => (
                    <option key={realm} value={realm}>{realm}</option>
                ))}
            </Form.Control>
        </Col>
    </Row>
}