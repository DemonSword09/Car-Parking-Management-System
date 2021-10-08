import { tokenToCSSVar } from "@chakra-ui/react";
import { query } from "@urql/exchange-graphcache";
import { NextPage } from "next";
const changePassword: NextPage<{ token: string }> = ({ token }) => {
  return <div>token is {token}</div>;
};
changePassword.getInitialProps = ({ query }) => {
  return { token: query.token as string };
};
export default changePassword;
