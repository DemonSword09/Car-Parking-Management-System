import { Container } from "../components/Container";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import React, { useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Flex, Heading, Stack } from "@chakra-ui/layout";
import { useColorModeValue } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import router from "next/router";
import { useGetSlotsQuery } from "../generated/graphql";
const BookSlot = () => {
  const [{ data }] = useGetSlotsQuery();
  let y = 1;
  let body;
  if (data?.getSlots) {
    y = data.getSlots.length / 4;
    body = (
      <Stack direction="row">
        {data.getSlots.map((slot) => (
          <Flex
            key={slot.id}
            as={!slot.booked ? "button" : "div"}
            h={40}
            w={20}
            justify="center"
            align="center"
            borderWidth={2}
            bg={slot.booked ? "red" : "green"}
            borderColor={useColorModeValue("gray", "white")}
            onClick={
              !slot.booked
                ? () => {
                    /*bookslot(val, j, slot, ind)*/ router.push(
                      `/book/${slot.id}`
                    );
                  }
                : undefined
            }
          >
            {slot.id}
          </Flex>
        ))}
      </Stack>
    );
  }
  // let i = 0;
  // const [slots, setSlots] = useState(
  //   Array.from(Array(y), () =>
  //     Array.from(Array(4), () => ({ id: i++, booked: false }))
  //   )
  // );
  // function bookslot(
  //   val: Slot["slot"][],
  //   j: number,
  //   slot: Slot["slot"],
  //   ind: number
  // ) {
  //   val[ind] = { ...slot, booked: !slot.booked };
  //   slots[j] = val;
  //   setSlots(slots);
  //   // router.push("/book-slot");
  //   router.push(`/book/${slot.id}`);
  // }
  // body = (
  //   <Stack>
  //     {slots.map((val, j) => (
  //       <Stack direction="row">
  //         {val.map((slot, ind) => (
  //           <Flex
  //             as={!slot.booked ? "button" : "div"}
  //             h={40}
  //             w={20}
  //             justify="center"
  //             align="center"
  //             borderWidth={2}
  //             bg={slot.booked ? "red" : "green"}
  //             borderColor={useColorModeValue("gray", "white")}
  //             onClick={
  //               !slot.booked
  //                 ? () => {
  //                     /*bookslot(val, j, slot, ind)*/ router.push(
  //                       `/book/${slot.id}`
  //                     );
  //                   }
  //                 : undefined
  //             }
  //           >
  //             {slot.id}
  //           </Flex>
  //         ))}
  //       </Stack>
  //     ))}
  //   </Stack>
  // );
  return (
    <Container h="100vh" w="100vw">
      <NavBar />
      <Stack>
        <Heading textAlign="center" my={6}>
          Book a Slot
        </Heading>
        {body}
      </Stack>
      <Footer />
      <DarkModeSwitch />
    </Container>
  );
};
interface Slot {
  slot: { id: number; booked: boolean };
}
export default withUrqlClient(createUrqlClient)(BookSlot);
