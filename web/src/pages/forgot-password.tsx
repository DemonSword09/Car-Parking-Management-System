import {
  Button,
  FormControl,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  Container,
  Box,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import router from "next/dist/client/router";
import React, { useState } from "react";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import InputFeild from "../components/inputFeild";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";

function ForgotPassword(): JSX.Element {
  const [complete, setcomplete] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation();
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <DarkModeSwitch />
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values,{setErrors}) => {
          const val = await forgotPassword(values);
          if (!val.data?.forgotPassword) {
            setErrors(toErrorMap([
              {
                field: "email",
                message: "email must be valid",
              },
            ],
            ));
          } else {
            setcomplete(true);
          }
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box color={useColorModeValue("black", "white")}>
              Email has been sent!
            </Box>
          ) : (
            <Stack
              spacing={4}
              w={"full"}
              maxW={"md"}
              bg={useColorModeValue("white", "gray.700")}
              rounded={"xl"}
              boxShadow={"lg"}
              p={6}
              my={12}
            >
              <Heading
                lineHeight={1.1}
                color={useColorModeValue("black", "white")}
                fontSize={{ base: "2xl", md: "3xl" }}
              >
                Forgot your password?
              </Heading>
              <Text
                fontSize={{ base: "sm", sm: "md" }}
                color={useColorModeValue("gray.800", "gray.400")}
              >
                You&apos;ll get an email with a reset link
              </Text>
              <Form>
                <InputFeild
                  name="email"
                  label="Email"
                  autoComplete="email"
                  type="email"
                />
                <Stack spacing={6}>
                  <Button
                    my={4}
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Request Reset
                  </Button>
                </Stack>
              </Form>
            </Stack>
          )
        }
      </Formik>
    </Flex>
  );
}
export default withUrqlClient(createUrqlClient)(ForgotPassword);
