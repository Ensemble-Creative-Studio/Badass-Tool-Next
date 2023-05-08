import "../styles/globals.scss";
import type { AppProps } from "next/app";
import Header from "../components/header";
import AOS from "aos";

import Head from "next/head";


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <title>Badass Presentation</title>
      </Head>
  
        <Component {...pageProps} />
    </div>
  );
}

export default MyApp;

