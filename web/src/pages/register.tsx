import {
  Link,
  Text,
  useColorModeValue,
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
} from "@chakra-ui/react";
import { Container } from "../components/Container";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import React from "react";
import { Form, Formik } from "formik";
import { useRouter } from "next/dist/client/router";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import InputFeild from "../components/inputFeild";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Register = () => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Container height="100vh">
      <DarkModeSwitch />
      <Formik
        initialValues={{ email: "", username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({ options: values });
          if (response.data?.addUser.errors) {
            setErrors(toErrorMap(response.data.addUser.errors));
          } else if (response.data?.addUser.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Flex
            minH={"100vh"}
            align={"center"}
            justify={"center"}
            bg={useColorModeValue("gray.50", "gray.1000")}
          >
            <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
              <Stack align={"center"}>
                <Heading fontSize={"4xl"}>Register your account</Heading>
              </Stack>
              <Box
                rounded={"lg"}
                bg={useColorModeValue("white", "gray.700")}
                boxShadow={"lg"}
                p={8}
              >
                <Form>
                  <Stack spacing={4}>
                    <InputFeild
                      name="email"
                      label="Email"
                      autoComplete="email"
                    />
                    <InputFeild
                      name="username"
                      label="Username"
                      autoComplete="username"
                    />
                    <InputFeild
                      name="password"
                      label="Password"
                      type="password"
                      autoComplete="current-password"
                    />
                    <Stack spacing={10}>
                      <Button
                        my={2}
                        bg={"blue.400"}
                        color={"white"}
                        _hover={{
                          bg: "blue.500",
                        }}
                        type="submit"
                        isLoading={isSubmitting}
                      >
                        Create my Account
                      </Button>
                    </Stack>
                  </Stack>
                </Form>
              </Box>
              <Text align="center">
                Already have an account?
                <Link ml="auto" mx={2} href="./login" color={"blue.400"}>
                  Log in
                </Link>
              </Text>
            </Stack>
          </Flex>
        )}
      </Formik>
    </Container>
  );
};
export default withUrqlClient(createUrqlClient)(Register);
