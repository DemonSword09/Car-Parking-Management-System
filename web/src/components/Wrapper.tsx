import { Box } from "@chakra-ui/react";
import React from "react";
type Wrapperprops = {
  variant?: "small" | "normal";
};
const Wrapper: React.FC<Wrapperprops> = ({ children, variant = "normal" }) => {
  return (
    <Box maxW={variant === "normal" ? "60%" : "40%"} w="100%" mt={4} mx="auto">
      {children}
    </Box>
  );
};
export default Wrapper;
