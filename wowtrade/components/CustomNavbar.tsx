import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "react-bootstrap";
import { useContext } from "react";
import { RegionRealmContext } from "../pages/_app";
import Link from "next/link";

export const RED_COLOR = "#e15b64";

export default function BasicNavbar() {
    const { data: session } = useSession();
    const context = useContext(RegionRealmContext);

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="/">WoWCraftingOrders.com</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link href="/" className={"navbar-text me-3"}
                              style={{ textDecoration: "none" }}>Buy</Link>
                        <Link href="/sell" className={"navbar-text me-3"}
                              style={{ textDecoration: "none" }}>Sell</Link>
                        <Link href="/my-listings" className={"navbar-text me-3"}
                              style={{ textDecoration: "none" }}>My
                            Listings</Link>
                        {/*<Nav.Link href="#link">Link</Nav.Link>*/}
                        {/*<NavDropdown title="Dropdown" id="basic-nav-dropdown">*/}
                        {/*    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>*/}
                        {/*    <NavDropdown.Item href="#action/3.2">*/}
                        {/*        Another action*/}
                        {/*    </NavDropdown.Item>*/}
                        {/*    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>*/}
                        {/*    <NavDropdown.Divider/>*/}
                        {/*    <NavDropdown.Item href="#action/3.4">*/}
                        {/*        Separated link*/}
                        {/*    </NavDropdown.Item>*/}
                        {/*</NavDropdown>*/}
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Collapse className="justify-content-end">
                    {context.region && <Navbar.Text className={"me-3"}>Region: {context.region}</Navbar.Text>}
                    {context.realm && <Navbar.Text className={"me-3"}>Realm: {context.realm}</Navbar.Text>}
                    {session && session.user && <Navbar.Text className={"me-2"}>{session.user.name}</Navbar.Text>}
                    {!session && <Button onClick={() => signIn("battlenet")}>Sign In to Battle.net</Button>}
                    {session && <Button onClick={() => signOut()}>Sign Out</Button>}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}