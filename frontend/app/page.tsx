import Link from "next/link";
import { Col, Row } from "react-bootstrap";

export const Page = () => {
  return (
    <>
      <h1 className="text-body-emphasis">Get started with Bootstrap</h1>
      <p className="fs-5 col-md-8">Quickly and easily get started with Bootstrap's compiled, production-ready files with this barebones example featuring some basic HTML and helpful links. Download all our examples to get started.</p>

      <div className="mb-5">
        <Link href="/docs/5.3/examples/" className="btn btn-primary btn-lg px-4">Download examples</Link>
      </div>

      <hr className="col-3 col-md-2 mb-5" />

      <Row gap={5}>
        <Col md={6}>
          <h2 className="text-body-emphasis">Starter projects</h2>
          <p>Ready to go beyond the starter template? Check out these open source projects that you can quickly duplicate to a new GitHub repository.</p>
          <ul className="list-unstyled ps-0">
            <li>
              <Link className="icon-link mb-1" href="https://github.com/twbs/examples/tree/main/icons-font" rel="noopener" target="_blank">
                Bootstrap npm starter
              </Link>
            </li>
            <li>
              <Link className="icon-link mb-1" href="https://github.com/twbs/examples/tree/main/parcel" rel="noopener" target="_blank">
                Bootstrap Parcel starter
              </Link>
            </li>
            <li>
              <Link className="icon-link mb-1" href="https://github.com/twbs/examples/tree/main/vite" rel="noopener" target="_blank">
                Bootstrap Vite starter
              </Link>
            </li>
            <li>
              <Link className="icon-link mb-1" href="https://github.com/twbs/examples/tree/main/webpack" rel="noopener" target="_blank">
                Bootstrap Webpack starter
              </Link>
            </li>
          </ul>
        </Col>

        <Col md={6}>
          <h2 className="text-body-emphasis">Guides</h2>
          <p>Read more detailed instructions and documentation on using or contributing to Bootstrap.</p>
          <ul className="list-unstyled ps-0">
            <li>
              <Link className="icon-link mb-1" href="/docs/5.3/getting-started/introduction/">
                Bootstrap quick start guide
              </Link>
            </li>
            <li>
              <Link className="icon-link mb-1" href="/docs/5.3/getting-started/webpack/">
                Bootstrap Webpack guide
              </Link>
            </li>
            <li>
              <Link className="icon-link mb-1" href="/docs/5.3/getting-started/parcel/">
                Bootstrap Parcel guide
              </Link>
            </li>
            <li>
              <Link className="icon-link mb-1" href="/docs/5.3/getting-started/vite/">
                Bootstrap Vite guide
              </Link>
            </li>
            <li>
              <Link className="icon-link mb-1" href="/docs/5.3/getting-started/contribute/">
                Contributing to Bootstrap
              </Link>
            </li>
          </ul>
        </Col>
      </Row>
    </>
  );
}

export default Page;
