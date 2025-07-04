import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">InterviewAce</h3>
            <p className="text-neutral-300 mb-4">
              Master your next interview with AI-powered practice and real MAANG company questions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Practice</h4>
            <ul className="space-y-2 text-neutral-300">
              <li><a href="#" className="hover:text-white transition-colors">Mock Interviews</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-white transition-colors">MAANG Questions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Custom Topics</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-neutral-300">
              <li><a href="#" className="hover:text-white transition-colors">Interview Tips</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Career Guides</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Company Insights</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-neutral-300">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-700 mt-12 pt-8 text-center text-neutral-400">
          <p>&copy; 2024 InterviewAce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
