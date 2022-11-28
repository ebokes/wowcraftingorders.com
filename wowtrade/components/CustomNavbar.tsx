import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "react-bootstrap";

export default function BasicNavbar() {
    const { data: session } = useSession();
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/">WowTrade.xyz</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Buy</Nav.Link>
                        <Nav.Link href="/sell">Sell</Nav.Link>
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
                    {session && session.user && <Navbar.Text className={"me-2"}>{session.user.name}</Navbar.Text>}
                    {!session && <Button onClick={() => signIn("bnet")}>Sign In to Battle.net</Button>}
                    {session && <Button onClick={() => signOut()}>Sign Out</Button>}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}