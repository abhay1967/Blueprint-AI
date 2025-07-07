import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building, ArrowRight, Github, Twitter, Linkedin, MessageCircle, Mail, Shield, ScrollText, MapPin, Calendar } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header with Login/Signup - Responsive */}
      <div className="absolute top-0 right-0 p-4 sm:p-6 z-10">
        <div className="flex gap-2 sm:gap-3">
          <Button 
            variant="ghost"
            onClick={() => navigate('/auth')}
            className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm sm:text-base px-3 sm:px-4"
          >
            Sign In
          </Button>
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-black hover:bg-gray-800 text-white px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base"
          >
            Get Started
          </Button>
        </div>
      </div>

      {/* Logo on the left side */}
      <div className="absolute top-0 left-0 p-4 sm:p-6 z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 sm:gap-3"
        >
          <div className="bg-black dark:bg-white p-2 sm:p-3 rounded-xl shadow-lg">
            <Building className="w-5 h-5 sm:w-6 sm:h-6 text-white dark:text-black" />
          </div>
          <span className="font-serif font-bold text-lg sm:text-xl text-slate-900 dark:text-white hidden sm:block">
            Blueprint AI
          </span>
        </motion.div>
      </div>

      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="flex justify-center mb-6 sm:mb-8"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-black dark:bg-white p-3 sm:p-4 rounded-2xl shadow-lg">
              <Building className="w-8 h-8 sm:w-12 sm:h-12 text-white dark:text-black" />
            </div>
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Introducing Blueprint AI
          </motion.h1>

          <motion.p 
            className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-6 sm:mb-8 font-light px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            An AI Architect that builds scalable system designs for your product ideas.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-black hover:bg-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-full inline-flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Try Blueprint AI Free
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </motion.div>

          <motion.div 
            className="mt-12 sm:mt-16 max-w-3xl mx-auto px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              Blueprint AI is a revolutionary tool that transforms your product ideas into comprehensive system architectures. 
              Using advanced AI, we generate detailed technical blueprints, feature breakdowns, tech stack recommendations, 
              and infrastructure suggestions — all optimized for modern scalability and best practices.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer - Responsive */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {/* About */}
            <div className="text-center md:text-left">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 sm:mb-6 text-lg">About</h3>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li>
                  <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2">
                    <MapPin className="w-4 h-4" />
                    Roadmap
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2">
                    <Calendar className="w-4 h-4" />
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            {/* Community */}
            <div className="text-center md:text-left">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 sm:mb-6 text-lg">Community</h3>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li>
                  <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2">
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2">
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Discord
                  </a>
                </li>
              </ul>
            </div>

            {/* Support & Legal */}
            <div className="text-center md:text-left">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 sm:mb-6 text-lg">Support & Legal</h3>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li>
                  <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="mailto:feedback@blueprintai.dev" className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2">
                    <Mail className="w-4 h-4" />
                    feedback@blueprintai.dev
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2">
                    <Shield className="w-4 h-4" />
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2">
                    <ScrollText className="w-4 h-4" />
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-700 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-500">
              © 2024 Blueprint AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
