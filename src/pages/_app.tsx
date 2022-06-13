import "@styles/globals.css";
import { LayoutProvider } from "src/context/layout.context";

function MyApp({ Component, pageProps }) {
  return (
    <LayoutProvider>
      <Component {...pageProps} />
    </LayoutProvider>
  );
}

export default MyApp;
