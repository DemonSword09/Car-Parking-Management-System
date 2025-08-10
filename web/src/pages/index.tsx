import { Container } from "../components/Container";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import React from "react";
import NavBar from "../components/NavBar";
import styles from "../styles/index.module.css";
import BookSlotCard from "../components/BookSlotCard";
import Footer from "../components/Footer";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import bg from "../img/bg.jpg";
const Index = () => (
  <Container h={"100vh"} bg={bg} className={styles.bg}>
    <NavBar />
    <BookSlotCard />
    <Footer />
    <DarkModeSwitch />
  </Container>
);

export default withUrqlClient(createUrqlClient)(Index);
