import { Mail } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <svg width="24" height="24" viewBox="0 0 32 32" className="drop-shadow-sm">
                <defs>
                  <linearGradient id="footerBookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
                <rect x="6" y="4" width="20" height="24" rx="2" fill="url(#footerBookGradient)" />
                <rect x="8" y="6" width="16" height="2" rx="1" fill="white" opacity="0.9" />
                <rect x="8" y="10" width="12" height="1.5" rx="0.75" fill="white" opacity="0.7" />
                <rect x="8" y="13" width="14" height="1.5" rx="0.75" fill="white" opacity="0.7" />
                <rect x="8" y="16" width="10" height="1.5" rx="0.75" fill="white" opacity="0.7" />
                <circle cx="23" cy="10" r="5" fill="#FCD34D" opacity="0.9" />
                <circle cx="23" cy="10" r="3" fill="#F59E0B" />
                <path d="M21.5 12.5 L24.5 12.5" stroke="white" strokeWidth="0.8" strokeLinecap="round" />
              </svg>
              <h3 className="text-xl font-bold">AutoDiDact</h3>
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
          <p>&copy; 2024 AutoDiDact. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
