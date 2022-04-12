import { Container } from "../components/Container";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import React, { useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Box, Flex, Heading, HStack, Stack } from "@chakra-ui/layout";
import {
  Button,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  useColorModeValue,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import router from "next/router";
import { useGetSlotsQuery, useGetUserSlotsQuery } from "../generated/graphql";
import { MdArrowDropDown } from "react-icons/md";
const BookSlot = () => {
  const [body, setbody] = useState(Object);
  const [showSlots, setshowSolts] = useState(false);
  const [value, setValue] = React.useState("0");
  const [{ data: FirstData, fetching }] = useGetUserSlotsQuery();
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value);
  };
  const [{ data }] = useGetSlotsQuery();
  let y = 1;
  const fetchslots = (n: number) => {
    if (data?.getSlots) {
      y = data.getSlots.length / 4;
      // console.log(data.getSlots[0].timings[6].time);

      setbody(
        <Stack direction="row">
          {data.getSlots.map((slot) => (
            <Flex
              key={slot.id}
              as={!slot.timings[n].bookedby ? "button" : "div"}
              h={40}
              w={20}
              justify="center"
              align="center"
              borderWidth={2}
              bg={slot.timings[n].bookedby ? "red" : "green"}
              onClick={
                !slot.timings[n].bookedby
                  ? () => {
                      /*bookslot(val, j, slot, ind)*/ router.push(
                        `/book/${slot.id}.${value}`
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
    } else {
      setbody(<Box>Error Fetching data!</Box>);
    }
  };
  const time = [
    { label: "08:00", value: "08:00" },
    { label: "09:00", value: "09:00" },
    { label: "10:00", value: "10:00" },
    { label: "11:00", value: "11:00" },
    { label: "12:00", value: "12:00" },
    { label: "13:00", value: "13:00" },
    { label: "14:00", value: "14:00" },
    { label: "15:00", value: "15:00" },
    { label: "16:00", value: "16:00" },
    { label: "17:00", value: "17:00" },
    { label: "18:00", value: "18:00" },
    { label: "19:00", value: "19:00" },
    { label: "20:00", value: "20:00" },
  ];

  return (
    <Container minH={"100vh"} minW={"100vw"}>
      <NavBar />
      <Stack>
        <Heading textAlign="center" my={6}>
          Book a Slot
        </Heading>
        {/* {body} */}
        <Heading>{new Date().toDateString()}</Heading>
      </Stack>
      <Stack>
        <p>
          {FirstData?.getUserSlots?.map((val) => (
            <Box>
              You have booked Slot no {val.id} at {val.time}
            </Box>
          ))}
        </p>
      </Stack>
      <Stack my={8} px={4}>
        <HStack spacing={"2em"}>
          <Box w={"100%"}>Select time to book</Box>
          <Select
            value={value}
            onChange={handleChange}
            icon={<MdArrowDropDown />}
          >
            <option value={0}>{time[0].label}</option>
            <option value={1}>{time[1].label}</option>
            <option value={2}>{time[2].label}</option>
            <option value={3}>{time[3].label}</option>
            <option value={4}>{time[4].label}</option>
            <option value={5}>{time[5].label}</option>
            <option value={6}>{time[6].label}</option>
          </Select>
        </HStack>
        <HStack>
          <Box w={"100%"}>No of Hours</Box>
          <NumberInput min={1} max={5} defaultValue={1}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </HStack>
        <Button
          onClick={async () => {
            fetchslots(parseInt(value));
            setshowSolts(true);
          }}
        >
          Check Availability
        </Button>
      </Stack>
      {showSlots ? body : null}
      <Footer />
      <DarkModeSwitch />
    </Container>
  );
};
interface Slot {
  slot: { id: number; booked: boolean };
}
export default withUrqlClient(createUrqlClient)(BookSlot);
