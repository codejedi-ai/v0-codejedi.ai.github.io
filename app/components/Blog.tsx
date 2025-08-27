import Link from "next/link"
import { ExternalLink, BookOpen, PenTool } from "lucide-react"

export default function Blog() {

  return (
    <section id="blog" className="py-20 bg-dark-lighter text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-center mb-4 text-white">BLOG</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Sharing insights, experiences, and learnings from my journey in AI, cloud computing, and software
            development on Medium.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Medium Blog Section */}
          <div className="gradient-card rounded-2xl p-8 border-gradient shadow-glow">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <PenTool className="h-12 w-12 text-primary-cyan" />
                <h3 className="text-3xl font-bold text-gradient">Medium Blog</h3>
              </div>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                I share my thoughts, tutorials, and experiences in AI, machine learning, cloud computing, and software development on Medium. 
                Join me on my journey as I explore cutting-edge technologies and share practical insights.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-dark/50 rounded-lg p-6 border border-primary-cyan/20">
                <BookOpen className="h-8 w-8 text-primary-cyan mb-4" />
                <h4 className="text-xl font-semibold text-white mb-3">Technical Articles</h4>
                <p className="text-gray-300 mb-4">
                  Deep dives into AI agents, cloud architectures, DevOps practices, and emerging technologies.
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• AI & Machine Learning</li>
                  <li>• Cloud Computing & AWS</li>
                  <li>• DevOps & Infrastructure</li>
                  <li>• Software Development</li>
                </ul>
              </div>

              <div className="bg-dark/50 rounded-lg p-6 border border-primary-purple/20">
                <PenTool className="h-8 w-8 text-primary-purple mb-4" />
                <h4 className="text-xl font-semibold text-white mb-3">Learning Journey</h4>
                <p className="text-gray-300 mb-4">
                  Documenting my continuous learning journey through certifications, courses, and hands-on projects.
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Hugging Face AI Agents</li>
                  <li>• AWS Certifications</li>
                  <li>• Technology Reviews</li>
                  <li>• Project Tutorials</li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="https://medium.com/@darcy.ldx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gradient-primary text-white px-8 py-4 rounded-lg hover:opacity-90 transition-all duration-300 shadow-glow text-lg font-semibold"
              >
                <ExternalLink className="h-5 w-5" />
                Visit My Medium Blog
              </Link>
              <p className="text-gray-400 text-sm mt-4">
                Follow me on Medium for the latest articles and insights
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <div className="bg-dark/30 rounded-lg p-6 border border-gray-700">
              <h4 className="text-xl font-semibold text-white mb-3">Stay Updated</h4>
              <p className="text-gray-300 mb-4">
                Get notified when I publish new articles about AI, cloud computing, and software development.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="https://medium.com/@darcy.ldx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary-cyan text-dark px-6 py-3 rounded-md hover:bg-primary-cyan/90 transition-colors font-semibold"
                >
                  Follow on Medium
                </Link>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 border border-primary-cyan text-primary-cyan px-6 py-3 rounded-md hover:bg-primary-cyan/10 transition-colors"
                >
                  Subscribe to Updates
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
