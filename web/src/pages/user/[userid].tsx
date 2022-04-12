import { Form, Formik } from "formik";
import { NextPage } from "next";
import React, { FunctionComponent, PropsWithChildren } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  useUpdateUserMutation,
  useGetUserQuery,
} from "../../generated/graphql";
import { withUrqlClient, WithUrqlProps } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { Container } from "../../components/Container";
import { DarkModeSwitch } from "../../components/DarkModeSwitch";
import { toErrorMap } from "../../utils/toErrorMap";
import router from "next/router";
import InputFeild from "../../components/inputFeild";
const UserProfile: NextPage<{ userid: string }> = ({ userid }) => {
  const [{ data, fetching }] = useGetUserQuery({
    variables: {
      id: parseInt(userid),
    },
  });
  const [, update] = useUpdateUserMutation();

  let body;
  if (fetching) {
  }
  //user not logged in
  else if (!data?.getUser) {
    body = (
      <Stack>
        <Box> Please log in</Box>
        <Button
          as={"a"}
          fontSize={"m"}
          fontWeight={400}
          variant={"link"}
          href={"/login"}
        >
          Log In
        </Button>
      </Stack>
    );
  } else {
    body = (
      <Stack>
        <Formik
          initialValues={{
            mobile_no: data.getUser.mobileno
              ? data.getUser.mobileno.toString()
              : "",
            vehicles: data.getUser.vehicles ? data.getUser.vehicles : "",
          }}
          onSubmit={async (values, { setErrors }) => {
            const response = await update({
              vehicles: values.vehicles,
              mobileno: parseInt(values.mobile_no),
            });
            console.log(parseInt(values.mobile_no));
            if (response.data?.updateUser.errors) {
              setErrors(toErrorMap(response.data.updateUser.errors));
            } else if (response.data?.updateUser.user) {
              router.reload();
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
                <Box
                  rounded={"lg"}
                  bg={useColorModeValue("rgb(250,250,250)", "gray.700")}
                  boxShadow={"dark-lg"}
                  p={8}
                >
                  <Form>
                    <Stack spacing={4}>
                      <Heading>Profile</Heading>
                      <Text>Username</Text>
                      <Input placeholder={data.getUser?.username} isReadOnly />
                      <Text>Email</Text>
                      <Input placeholder={data.getUser?.email} isReadOnly />
                      <InputFeild
                        name="vehicles"
                        label="Vehicle No"
                        type={"text"}
                        autoComplete="vehicles"
                      />
                      <InputFeild
                        name="mobile_no"
                        label="Mobile No"
                        type={"tel"}
                        autoComplete="mobile_no"
                      />
                      <Button
                        bg={"blue.400"}
                        color={"white"}
                        _hover={{
                          bg: "blue.500",
                        }}
                        type="submit"
                        isLoading={isSubmitting}
                      >
                        Update
                      </Button>
                      <Button onClick={() => router.push("/")}>Back</Button>
                    </Stack>
                  </Form>
                </Box>
              </Stack>
            </Flex>
          )}
        </Formik>
      </Stack>
    );
  }

  return (
    <Container height="100vh" width="100vw">
      <DarkModeSwitch />
      {body}
    </Container>
  );
};
UserProfile.getInitialProps = ({ query }) => {
  return { userid: query.userid as string };
};
export default withUrqlClient(createUrqlClient)(
  UserProfile as FunctionComponent<
    PropsWithChildren<WithUrqlProps | { userid: string }>
  >
);
