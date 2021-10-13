import { Formik, Form } from "formik";
import { NextPage } from "next";
import router from "next/router";
import React, { FunctionComponent, PropsWithChildren, useState } from "react";
import { toErrorMap } from "../../utils/toErrorMap";
import { Box, Button, Flex, Heading, Link, Stack, useColorModeValue } from "@chakra-ui/react";
import InputFeild from "../../components/inputFeild";
import { useChangePasswordMutation } from "../../generated/graphql";
import NextLink from "next/link";
import { withUrqlClient, WithUrqlProps } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, settokenError] = useState("");
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token,
          });
          // console.log(user)
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ("token" in errorMap) {
              settokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Stack
            color={useColorModeValue("black", "white")}
            spacing={4}
            w={"full"}
            maxW={"md"}
            bg={useColorModeValue("white", "gray.700")}
            rounded={"xl"}
            boxShadow={"lg"}
            p={6}
            my={12}
          >
            <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
              Enter new password
            </Heading>
            <Form>
              <InputFeild
                name="newPassword"
                label="Enter new password"
                autoComplete="newPassword"
                type="password"
              />
              {tokenError ? (
                <Box>
                  <Box mr={2} style={{ color: "red" }}>
                    {tokenError}
                  </Box>
                  <NextLink href="/forgot-password">
                    <Link>
                      <Button mt={4} colorScheme="red" type="submit">
                        Forgot Password
                      </Button>
                    </Link>
                  </NextLink>
                </Box>
              ) : null}
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
                  Submit
                </Button>
              </Stack>
            </Form>
          </Stack>
        )}
      </Formik>
    </Flex>
  );
};
ChangePassword.getInitialProps = ({ query }) => {
  return { token: query.token as string };
};
export default withUrqlClient(createUrqlClient)(
  ChangePassword as FunctionComponent<
    PropsWithChildren<WithUrqlProps | { token: string }>
  >
);
