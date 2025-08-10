import React, { FunctionComponent, PropsWithChildren } from "react";
import { Button, Flex, Heading, useColorModeValue } from "@chakra-ui/react";
import { withUrqlClient, WithUrqlProps } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import router from "next/router";
import { NextPage } from "next";
import { useBookSlotMutation } from "../../generated/graphql";
const SlotBooking: NextPage<{ token: string }> = ({ token }) => {
  const param = { id: parseInt(token[0]) };
  const n = parseInt(token[2]);

  const [, bookslot] = useBookSlotMutation();
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      direction="column"
      color={useColorModeValue("gray.800", "gray.50")}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Heading my={6}>Proceed to Pay</Heading>
      <Flex>
        <Button
          mx={2}
          variant="outline"
          onClick={async () => {
            const val = await bookslot({ ...param, n });
            console.log(val.data);

            if (val.data?.bookSlot) window.location.assign("/book-slot");
          }}
        >
          Pay
        </Button>
        <Button
          mx={2}
          variant="outline"
          onClick={() => router.push("/book-slot")}
        >
          Back
        </Button>
      </Flex>
    </Flex>
  );
};
SlotBooking.getInitialProps = ({ query }) => {
  return { token: query.slotid as string };
};
export default withUrqlClient(createUrqlClient)(
  SlotBooking as FunctionComponent<
    PropsWithChildren<WithUrqlProps | { token: string }>
  >
);
