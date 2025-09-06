import "@/styles/minimal.scss";

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