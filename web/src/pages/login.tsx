import React from "react";
import { Formik, Form } from "formik";
import Wrapper from "../components/Wrapper";
import InputFeild from "../components/inputFeild";
import { Button, Flex, Link } from "@chakra-ui/react";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ emailOrUsername: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({ options: values });
          // console.log(user)
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
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
            <Flex mt={2}>
              <NextLink href="/forgot-password">
                <Link ml="auto" color="red">
                  forgot password?
                </Link>
              </NextLink>
            </Flex>
            <Button
              mt={4}
              colorScheme="teal"
              type="submit"
              isLoading={isSubmitting}
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};
export default withUrqlClient(createUrqlClient)(Login);
