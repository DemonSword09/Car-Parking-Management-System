import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import theme from "../theme";

function MyApp({ Component, pageProps }: any) {
  return (
    <div style={{height:"100vh",width:"100vw"}}>
    <ChakraProvider  theme={theme}>
      <ColorModeProvider
        options={{
          useSystemColorMode: true,
        }}
      >
        <Component {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
    </div>
  );
}

export default MyApp;
