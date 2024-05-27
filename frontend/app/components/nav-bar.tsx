"use client";

import { faChurch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname } from "next/navigation";
import { Container, Nav, NavLink, Navbar, NavbarBrand, NavbarCollapse, NavbarToggle } from "react-bootstrap";

const NavBar = () => {
  const pathname = usePathname();

  const pages: Record<string, string> = {
    "/time-sheet": "Stundenliste",
    "/privacy": "Datenschutz",
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="md">
      <Container>
        <NavbarBrand href="/">
          <FontAwesomeIcon icon={faChurch} className="me-2 text-warning" />
          KeinPlan
        </NavbarBrand>
        <NavbarToggle aria-controls="basic-navbar-nav" />
        <NavbarCollapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {Object.entries(pages).map((page) => (
              <NavLink active={pathname == page[0]} key={page[0]} href={page[0]}>
                {page[1]}
              </NavLink>
            ))}
          </Nav>
        </NavbarCollapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
