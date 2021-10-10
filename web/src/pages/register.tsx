import React from "react";
import { Formik, Form } from "formik";
import Wrapper from "../components/Wrapper";
import InputFeild from "../components/inputFeild";
import { Button } from "@chakra-ui/react";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
type registerprops = {};

const Register: React.FC<registerprops> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email:"",username: "", password: "" }}
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
          <Form>
            <InputFeild name="email" label="Email" autoComplete="email" />
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

            <Button
              mt={4}
              colorScheme="teal"
              type="submit"
              isLoading={isSubmitting}
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};
export default withUrqlClient(createUrqlClient)(Register);
