import { Container } from "../components/Container";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import React from "react";
import NavBar from "../components/NavBar";
import styles from "../styles/index.module.css"
import BookSlotCard from "../components/BookSlotCard";
import Footer from "../components/Footer";
const bg = require("../img/bg.jpg")
const Index = () => (
  <Container h="120vh" bg={bg} className={styles.bg}>
    <NavBar/>
    <BookSlotCard/>
    <Footer/>
    <DarkModeSwitch />
  </Container>
);

export default Index;
