"use client"

import { Linkedin, Twitter, MessageSquare } from "lucide-react"

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-b from-dark-lighter to-dark text-white relative overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 z-[-1]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(0,210,255,0.2)_0%,rgba(10,10,24,0)_60%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_70%_70%,rgba(157,78,221,0.2)_0%,rgba(10,10,24,0)_60%)]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-center mb-4 text-white">Let&apos;s Get Connected</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Connect with me on LinkedIn, Twitter, or Discord. I&apos;d love to hear from you!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="gradient-card rounded-2xl p-8 border-gradient shadow-glow">
            <div className="flex flex-col items-center justify-center gap-8">
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/codejediatuw/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 w-full p-6 bg-gray-800/50 rounded-lg border border-gray-600 hover:border-primary-cyan hover:bg-gray-800 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                  <Linkedin className="h-6 w-6 text-blue-400" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-white mb-1">LinkedIn</h3>
                  <p className="text-gray-400 text-sm">Connect with me on LinkedIn</p>
                </div>
              </a>

              {/* Twitter */}
              <a
                href="https://x.com/darsboi_cjd/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 w-full p-6 bg-gray-800/50 rounded-lg border border-gray-600 hover:border-primary-cyan hover:bg-gray-800 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-400/20 rounded-lg flex items-center justify-center group-hover:bg-blue-400/30 transition-colors">
                  <Twitter className="h-6 w-6 text-blue-300" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-white mb-1">Twitter</h3>
                  <p className="text-gray-400 text-sm">Follow me on Twitter/X</p>
                </div>
              </a>

              {/* Discord */}
              <div className="flex items-center gap-4 w-full p-6 bg-gray-800/50 rounded-lg border border-gray-600">
                <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-indigo-400" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-white mb-1">Discord</h3>
                  <p className="text-gray-400 text-sm">d273liu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}