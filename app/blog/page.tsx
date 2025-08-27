import Blog from "../components/Blog"
import { NavBar } from "../components/NavBar"
import Footer from "../components/Footer"

export default function BlogPage() {
  return (
    <div className="bg-dark min-h-screen">
      <NavBar />
      <div className="pt-16">
        <Blog />
      </div>
      <Footer />
    </div>
  )
}
