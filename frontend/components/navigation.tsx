import { Navbar, Nav, Container } from "react-bootstrap";
import { NextPage } from "next";

const Navigation: NextPage = () => {
  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">KeinPlan</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Stundenlisten</Nav.Link>
            <Nav.Link href="/auto-mailer">AutoMailer</Nav.Link>
            <Nav.Link href="/privacy">Datenschutz</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
