import { withUrqlClient } from "next-urql";
import React from "react";
import NavBar from "../components/NavBar";
import { createUrqlClient } from "../utils/createUrqlClient";
import styles from "../styles/index.module.css"
const Index = () => {
  return (
    <div className={styles.bg}>
      <NavBar />
      <h2 style={{color:"white"}}>Car Parking Management System</h2>
    </div>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
