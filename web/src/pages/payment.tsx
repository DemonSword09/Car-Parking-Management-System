import { Container } from "../components/Container";
import React from "react";
import styles from "../styles/index.module.css";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import bg from "../img/bg.jpg";
const Index = () => <Container bg={bg} className={styles.bg}></Container>;

export default withUrqlClient(createUrqlClient)(Index);
