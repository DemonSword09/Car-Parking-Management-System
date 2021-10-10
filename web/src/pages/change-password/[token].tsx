import { Formik, Form } from "formik";
import Wrapper from "../../components/Wrapper";
import { NextPage } from "next";
import router from "next/router";
import { FunctionComponent, PropsWithChildren, useState } from "react";
import { toErrorMap } from "../../utils/toErrorMap";
import { Box, Button,Link } from "@chakra-ui/react";
import InputFeild from "../../components/inputFeild";
import { useChangePasswordMutation } from "../../generated/graphql";
import NextLink from "next/link"
import { withUrqlClient, WithUrqlProps } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const [, changePassword] = useChangePasswordMutation();
  const [tokenError, settokenError] = useState("");
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token,
          });
          // console.log(user)
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors)
            if ('token' in errorMap){
              settokenError(errorMap.token)
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputFeild
              name="newPassword"
              label="Enter new password"
              autoComplete="newPassword"
              type="password"
            />
            {tokenError ? (
              <Box>
                <Box mr={2} style={{ color: "red" }}>{tokenError}</Box>
                <NextLink href="/forgot-password">
                  <Link>
                    <Button mt={4} colorScheme="red" type="submit">
                      Forgot Password
                    </Button>
                  </Link>
                </NextLink>
              </Box>
            ) : null}
            <Button
              mt={4}
              colorScheme="teal"
              type="submit"
              isLoading={isSubmitting}
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
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