import { withUrqlClient } from "next-urql";
import React from "react";
import NavBar from "../components/NavBar";
import { cerateUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  return (
    <>
      <NavBar />
      <div>hello</div>
      <br />
        <div>Car Parking Management System</div>
    
    </>
  );
};

export default withUrqlClient(cerateUrqlClient, { ssr: true })(Index);
