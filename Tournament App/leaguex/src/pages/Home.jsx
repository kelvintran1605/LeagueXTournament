import Hero from "../components/Hero";
import HomeAbout from "../components/HomeAbout";
import Slider from "../components/Slider";
import Footer from "../components/Footer";
import FAQs from "../components/FAQS";
import { useEffect, useState } from "react";
import axios from 'axios';
import HomeBanner from "../components/HomeBanner";
import HomeIntro from "../components/HomeIntro";
const Home = () => {
    return (
        <main>
            <HomeBanner />
            <Hero />
            <HomeIntro />
            <Slider />
            <HomeAbout />
            <FAQs />
            <Footer />
        </main >
    );
}

export default Home;