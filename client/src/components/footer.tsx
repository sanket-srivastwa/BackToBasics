import { Mail } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h3 className="text-xl font-bold">Auto The Dact</h3>
            </div>
            <p className="text-neutral-300 mb-4">
              Empowering IT professionals in Bangalore and beyond with AI-powered interview preparation and skill development.
            </p>
            <div className="flex space-x-4">
              <a href="mailto:learnlabsolution@gmail.com" className="text-neutral-400 hover:text-white transition-colors" title="Email us">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Practice</h4>
            <ul className="space-y-2 text-neutral-300">
              <li><Link href="/practice" className="hover:text-white transition-colors">Practice Questions</Link></li>
              <li><Link href="/enhanced-case-study" className="hover:text-white transition-colors">AI Case Studies</Link></li>
              <li><Link href="/custom-case-study" className="hover:text-white transition-colors">Custom Case Studies</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Learn</h4>
            <ul className="space-y-2 text-neutral-300">
              <li><Link href="/learning" className="hover:text-white transition-colors">Learning Materials</Link></li>
              <li><Link href="/feedback" className="hover:text-white transition-colors">AI Learning Assistant</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-neutral-300">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-700 mt-12 pt-8 text-center text-neutral-400">
          <p>&copy; 2024 Auto The Dact. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
