import { FaClipboardQuestion } from "react-icons/fa6";
import Container from "./container";

export const Header = () => {
  return (
    <Container>
      <header className="d-flex align-items-center pb-3 mb-1 border-bottom">
        <a href="/" className="d-flex align-items-center text-body-emphasis text-decoration-none">
          <FaClipboardQuestion size="2.5em" className="me-3" />
          <span className="fs-4">
            Kein<b>Plan</b>
          </span>
        </a>
      </header>
    </Container>
  );
};

export default Header;
