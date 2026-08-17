import { faClipboardQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Container from "./container";

export const Header = () => {
  return (
    <Container>
      <header className="d-flex align-items-center pb-3 mb-1 border-bottom">
        <a href="/" className="d-flex align-items-center text-body-emphasis text-decoration-none">
          <FontAwesomeIcon icon={faClipboardQuestion} size="2xl" className="me-3" />
          <span className="fs-4">
            Kein<b>Plan</b>
          </span>
        </a>
      </header>
    </Container>
  );
};

export default Header;
