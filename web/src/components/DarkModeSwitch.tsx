import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useColorMode,useColorModeValue, Box, Tooltip, IconButton } from "@chakra-ui/react";
import React from "react";

export const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return (
    <Box position="fixed" bottom="1rem" right="1rem">
      <Tooltip label="Toggle Light/Dark mode">
        <IconButton
          isRound
          borderWidth={1}
          borderColor={useColorModeValue("black", "white")}
          onClick={toggleColorMode}
          icon={!isDark ? <MoonIcon /> : <SunIcon />}
          aria-label={"Toggle Theme"}
        />
      </Tooltip>
    </Box>
  );
};
