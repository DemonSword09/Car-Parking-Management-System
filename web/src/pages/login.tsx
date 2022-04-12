import {
  Link,
  Text,
  useColorModeValue,
  Box,
  Button,
  Flex,
  Heading,
  Stack,
} from "@chakra-ui/react";
import { Container } from "../components/Container";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import React from "react";
import { useRouter } from "next/dist/client/router";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { Form, Formik } from "formik";
import InputFeild from "../components/inputFeild";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
const Login = () => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Container height="100vh" width="100vw">
      <DarkModeSwitch />
      <Formik
        initialValues={{ emailOrUsername: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          console.log(values);

          const response = await login({ options: values });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            console.log(response.data.login);
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
                <Heading fontSize={"4xl"}>Sign in to your account</Heading>
              </Stack>
              <Text align="center">
                Need an account?
                <Link ml="auto" mx={2} href="./register" color={"blue.400"}>
                  Sign up for free
                </Link>
              </Text>
              <Box
                rounded={"lg"}
                bg={useColorModeValue("rgb(250,250,250)", "gray.700")}
                boxShadow={"dark-lg"}
                p={8}
              >
                <Form>
                  <Stack spacing={4}>
                    <InputFeild
                      name="emailOrUsername"
                      label="Email / Username"
                      autoComplete="emailOrUsername"
                    />
                    <InputFeild
                      name="password"
                      label="Password"
                      type="password"
                      autoComplete="current-password"
                    />
                    <Stack spacing={10}>
                      <Stack
                        direction={{ base: "column", sm: "row" }}
                        align={"start"}
                        justify={"space-between"}
                      >
                        <Link
                          ml="auto"
                          href="./forgot-password"
                          color={"blue.400"}
                        >
                          Forgot password?
                        </Link>
                      </Stack>
                      <Button
                        bg={"blue.400"}
                        color={"white"}
                        _hover={{
                          bg: "blue.500",
                        }}
                        type="submit"
                        isLoading={isSubmitting}
                      >
                        Sign in
                      </Button>
                    </Stack>
                  </Stack>
                </Form>
              </Box>
            </Stack>
          </Flex>
        )}
      </Formik>
    </Container>
  );
};
export default withUrqlClient(createUrqlClient)(Login);
