import Navigation from '@/components/Navigation';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
// import Contact from '@/components/sections/Contact';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <LoadingScreen />
      <Navigation />
      <div id="home">
        <Hero />
      </div>
      <About />
      <Projects />
      {/* <Contact /> */}
      <Footer />
    </main>
  );
}
