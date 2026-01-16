import WorkExperience from "./components/WorkExperience"
import Certificates from "./components/Certificates"
import AboutMe from "./components/WhoAmI"
import Header from "./components/Header"
import Skills from "./components/Skills"
import Projects from "./components/Projects"
import Contact from "./components/Contact"
import Footer from "./components/Footer"

export default function Home() {
  return (
    <div className="bg-dark min-h-screen">
      <Header />
      <AboutMe />
      <Skills />
      <WorkExperience />
      <Certificates />
      <Projects />
      <Contact />
      <Footer />
    </div>
  )
}