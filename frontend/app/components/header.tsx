import { faClipboardQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="d-flex align-items-center pb-3 mb-5 border-bottom">
      <Link href="/" className="d-flex align-items-center text-body-emphasis text-decoration-none">
        <FontAwesomeIcon icon={faClipboardQuestion} size="2xl" className="me-2" />
        <span className="fs-4">KeinPlan</span>
      </Link>
    </header>
  );
};

export default Header;
