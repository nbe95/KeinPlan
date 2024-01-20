import 'bootstrap/dist/css/bootstrap.min.css';

import Navigation from "../components/navigation"
import Head from 'next/head';

export default function Page() {
  return <>
    <Head>
      <title>My page title</title>
    </Head>
    <Navigation></Navigation>
    <h1>Hello, Next.js!</h1>
  </>
}
