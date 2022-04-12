import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Link,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

export default function NavBar() {
  const { isOpen, onToggle } = useDisclosure();
  const [{ data, fetching }] = useMeQuery();
  const [, logout] = useLogoutMutation();

  let body;
  if (fetching) {
  }
  //user not logged in
  else if (!data?.me) {
    body = (
      <Stack
        flex={{ base: 1, md: 0 }}
        justify={"flex-end"}
        direction={"row"}
        spacing={6}
      >
        <Button
          as={"a"}
          fontSize={"m"}
          fontWeight={400}
          variant={"link"}
          href={"/login"}
        >
          Log In
        </Button>
        <Link
          href={"/register"}
          _hover={{
            color: "white",
          }}
        >
          <Button
            size="sm"
            display={{ base: "none", md: "inline-flex" }}
            fontSize={"sm"}
            fontWeight={600}
            colorScheme="teal"
            variant={useColorModeValue("solid", "outline")}
            _hover={{
              bg: "teal",
            }}
          >
            Register
          </Button>
        </Link>
      </Stack>
    );
  }
  //user logged in
  else {
    body = (
      <Stack
        flex={{ base: 1, md: 0 }}
        justify={"flex-end"}
        direction={"row"}
        spacing={6}
      >
        <Button
          as={"a"}
          fontSize={"m"}
          fontWeight={400}
          variant={"link"}
          href={`/user/${data.me.id}`}
        >
          {data.me.username}
        </Button>
        <Button
          size="sm"
          display={{ base: "none", md: "inline-flex" }}
          fontSize={"sm"}
          fontWeight={600}
          colorScheme="teal"
          variant={useColorModeValue("solid", "outline")}
          _hover={{
            bg: "teal",
          }}
          onClick={() => {
            logout();
          }}
        >
          Logout
        </Button>
      </Stack>
    );
  }
  return (
    <Box w="100%">
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex
          flex={{ base: 1 }}
          pt={1}
          justify={{ base: "center", md: "start" }}
        >
          <Text
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontFamily={"heading"}
            ml={{ base: "auto", md: "initial" }}
            mr={{ base: "auto", md: "initial" }}
            color={useColorModeValue("gray.800", "white")}
          >
            Parkify
          </Text>
          <Flex
            display={{ base: "none", md: "flex" }}
            w={"100%"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <DesktopNav />
          </Flex>
          {body}
        </Flex>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  return (
    <Stack direction={"row"} spacing={10}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Link
            p={2}
            href={navItem.href}
            fontSize={"sm"}
            fontWeight={500}
            color={linkColor}
            _hover={{
              textDecoration: "none",
              color: linkHoverColor,
            }}
          >
            {navItem.label}
          </Link>
        </Box>
      ))}
    </Stack>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
          _hover={{
            borderWidth: "2",
          }}
        >
          {label}
        </Text>
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        ></Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Book Slot",
    href: "/book-slot",
  },
];
