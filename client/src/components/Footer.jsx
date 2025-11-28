import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Facebook, Twitter, Instagram, Linkedin, Send, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="container mx-auto px-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">EduPlatform</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Empowering learners worldwide with quality education. Join our community to master new skills and advance your career.
            </p>
            <div className="flex space-x-4 pt-2">
              <SocialIcon icon={Facebook} href="#" />
              <SocialIcon icon={Twitter} href="#" />
              <SocialIcon icon={Instagram} href="#" />
              <SocialIcon icon={Linkedin} href="#" />
            </div>
          </motion.div>

          {/* Links Section 1 */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-6">Learning Paths</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <FooterLink to="/courses?category=web-dev">Web Development</FooterLink>
              <FooterLink to="/courses?category=data-science">Data Science</FooterLink>
              <FooterLink to="/courses?category=marketing">Digital Marketing</FooterLink>
              <FooterLink to="/courses?category=mobile">Mobile Development</FooterLink>
              <FooterLink to="/courses?category=design">UI/UX Design</FooterLink>
            </ul>
          </motion.div>

          {/* Links Section 2 */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-6">Company & Support</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/careers">Careers</FooterLink>
              <FooterLink to="/blog">Blog</FooterLink>
              <FooterLink to="/contact">Contact Support</FooterLink>
              <FooterLink to="/privacy">Privacy Policy</FooterLink>
              <FooterLink to="/terms">Terms of Service</FooterLink>
            </ul>
          </motion.div>

          {/* Newsletter Section */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-6">Stay Updated</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
              Subscribe to our newsletter for the latest courses and updates.
            </p>
            <div className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500"
                />
              </div>
              <Button className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200">
                Subscribe <Send className="ml-2 h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} EduPlatform, Inc. All rights reserved.
          </p>
        </div>
      </motion.div>
    </footer>
  );
}

function FooterLink({ to, children }) {
  return (
    <li>
      <Link 
        to={to} 
        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-1 group"
      >
        <span className="w-0 group-hover:w-2 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 mr-0 group-hover:mr-1"></span>
        {children}
      </Link>
    </li>
  );
}

function SocialIcon({ icon: Icon, href }) {
  return (
    <a 
      href={href} 
      className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors"
    >
      <Icon className="h-4 w-4" />
    </a>
  );
}