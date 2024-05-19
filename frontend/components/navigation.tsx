import { faChurch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Container, Nav, Navbar } from "react-bootstrap";

const Navigation: NextPage = () => {
  const router = useRouter();

  const pages: Record<string, string> = {
    "/time-sheet": "Stundenliste",
    "/privacy": "Datenschutz",
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="md">
      <Container>
        <Navbar.Brand href="/">
          <FontAwesomeIcon icon={faChurch} className="me-2 text-warning" />
          KeinPlan
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {Object.entries(pages).map((page) => (
              <Nav.Link active={router.pathname == page[0]} href={page[0]}>
                {page[1]}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
