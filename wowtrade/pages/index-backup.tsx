import { Button, ButtonGroup, Col, Row } from "react-bootstrap";

export default function Home() {
    return <div>
        <main className={"mt-3"}>
            {/*<ul>*/}
            {/*    <li><b>Buyers:</b> Stay on this page. Specify your Region, Realm, and the Item ID (you can find it*/}
            {/*        in*/}
            {/*        the Wowhead*/}
            {/*        URL) below, and you'll be shown everyone with that item listed on your realm.*/}
            {/*    </li>*/}
            {/*    <li><b>Sellers:</b> Hit the "Sell" button in the navbar to create a listing. The site currently*/}
            {/*        only allows you to create listings. I'm actively working on Battle.net login, which*/}
            {/*        will allow you to edit or delete listings, alongside a whole bunch of other things.*/}
            {/*    </li>*/}
            {/*</ul>*/}
            <Row>
                <Col md={6}>
                    <ButtonGroup className={"w-100"}>
                        <Button href={"/"}>Buy</Button>
                    </ButtonGroup>
                </Col>
                <Col md={6}>
                    <ButtonGroup className={"w-100"}>
                        <Button href={"/sell"}>Sell</Button>
                    </ButtonGroup>
                </Col>
            </Row>
        </main>
    </div>
}