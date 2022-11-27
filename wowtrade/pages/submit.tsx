import { Col, Form, Row } from "react-bootstrap";

export default function Submit() {
    return <Form>
        <Row>
            <Col md={6}><Form.Group>
                <Form.Label>Region</Form.Label>
                <Form.Control as="select">
                    <option>en</option>
                    <option>eu</option>
                </Form.Control>
            </Form.Group></Col>
            <Col md={6}><Form.Group>
                <Form.Label>Server</Form.Label>
                <Form.Control as="select">
                    <option>en</option>
                    <option>eu</option>
                </Form.Control>
            </Form.Group></Col>
        </Row>
    </Form>
}