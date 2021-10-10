import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import InputFeild from "../components/inputFeild";
import Wrapper from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
const ForgotPassword: React.FC<{}> = ({}) => {
    const [complete,setcomplete] = useState(false)
  const [, forgotPassword] = useForgotPasswordMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: ""}}
        onSubmit={async (values) => {
          await forgotPassword(values);
          setcomplete(true)
        }}
      >
        {({ isSubmitting }) => complete? <Box>Email has been sent!</Box>: (
          <Form>
            <InputFeild
              name="email"
              label="Email"
              autoComplete="email"
              type="email"
            />
            <Button
              mt={4}
              colorScheme="blue"
              type="submit"
              isLoading={isSubmitting}
            >
              Send
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};
export default withUrqlClient(createUrqlClient)(ForgotPassword);
