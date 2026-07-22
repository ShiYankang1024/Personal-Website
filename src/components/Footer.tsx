'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';

export default function Footer() {
//   const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black border-t border-white/10 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-16 items-start">
          {/* Logo and Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-8">
              DM Kant
            </h3>
            <p className="text-gray-400 text-xl leading-relaxed mb-8 font-light">
              软件开发工程师，致力于通过AI与可视化技术，创造直观、智能的人机交互体验。
            </p>
            <div className="flex gap-6">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                href="https://github.com/DongMenKant"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-white/20"
              >
                <Github size={28} className="text-gray-300 hover:text-white" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                href="https://blog.csdn.net/qq_43665890?spm=1000.2115.3001.5343"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-white/20"
              >
                <Linkedin
                  size={28}
                  className="text-gray-300 hover:text-white"
                />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                href="mailto:15684199363@163.com"
                className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-white/20"
              >
                <Mail size={28} className="text-gray-300 hover:text-white" />
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={scrollToTop}
                className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-white/20"
              >
                <ArrowUp size={28} className="text-gray-300 hover:text-white" />
              </motion.button>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h4 className="text-white font-black text-2xl mb-8">快速链接</h4>
            <div className="space-y-6">
              {['主页', '关于', '项目'].map((link) => (
                <button
                  key={link}
                  onClick={() => {
                    const element = document.getElementById(link.toLowerCase());
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="block text-gray-400 hover:text-white transition-all duration-300 text-xl hover:translate-x-2 font-bold"
                >
                  {link}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h4 className="text-white font-black text-2xl mb-8">
              联系方式
            </h4>
            <div className="space-y-6 text-gray-400">
              <p className="text-xl">15684199363@163.com</p>
              <p className="text-xl">15684199363</p>
              <p className="text-xl">广东 广州</p>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="border-t border-white/10 mt-16 pt-12 text-center"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-xl flex items-center justify-center gap-3 font-light">
              © {currentYear} MJ Hesari. Made with{' '}
              <Heart size={24} className="text-red-500 animate-pulse" /> using
              Next.js & Three.js
            </p>
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-white/20"
            >
              <ArrowUp size={28} className="text-gray-300 hover:text-white" />
            </motion.button>
          </div>
        </motion.div> */}
      </div>
    </footer>
  );
}
