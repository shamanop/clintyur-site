import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Preloader from "@/components/sections/Preloader";
import Hero from "@/components/sections/Hero";
import FeaturedRecipes from "@/components/sections/FeaturedRecipes";
import About from "@/components/sections/About";
import Catering from "@/components/sections/Catering";
import MerchTeaser from "@/components/sections/MerchTeaser";
import SocialFeed from "@/components/sections/SocialFeed";

export default function Home() {
  return (
    <>
      <Preloader />
      <Navbar />
      <main>
        <Hero />
        <FeaturedRecipes />
        <About />
        <Catering />
        <MerchTeaser />
        <SocialFeed />
      </main>
      <Footer />
    </>
  );
}
