import "@/styles/minimal.scss";
import "@/styles/modern.scss";
import "@/styles/thundr.scss";

import { useEffect } from "react";

import '@smastrom/react-rating/style.css'

function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default App;