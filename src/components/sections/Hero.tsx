'use client';

import { motion } from 'framer-motion';
import { ChevronDown, Github, Linkedin, Mail } from 'lucide-react';
import Computer from '../3d/Computer';

export default function Hero() {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      data-guide="hero"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Computer />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-8 text-white leading-none tracking-tight">
            {/* Hi, I&apos;m{' '} */}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              DM Kant
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
          className="mb-16"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light mb-8 text-gray-300 tracking-wide">
            个人网站
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed font-light">
            {/* I create exceptional digital experiences that combine cutting-edge
            technology with stunning design */}
            致力于打造卓越的数字体验，将尖端科技与惊艳设计完美融合。
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
        >
          {/* <a
            href="#contact"
            className="px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 text-lg"
          >
            Get In Touch
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 border-2 border-gray-600 text-gray-300 font-bold rounded-full hover:border-gray-500 hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center gap-3 text-lg"
          >
            <Download size={20} />
            Download CV
          </a> */}
        </motion.div>

        {/* <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.9, ease: 'easeOut' }}
          className="flex justify-center gap-8 mb-20"
        >
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm border border-white/20"
          >
            <Github size={32} className="text-gray-300 hover:text-white" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm border border-white/20"
          >
            <Linkedin size={32} className="text-gray-300 hover:text-white" />
          </a>
          <a
            href="mailto:contact@mjhesari.com"
            className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm border border-white/20"
          >
            <Mail size={32} className="text-gray-300 hover:text-white" />
          </a>
        </motion.div> */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.2 }}
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        >
          <button
            onClick={scrollToAbout}
            className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 animate-bounce"
          >
            <ChevronDown size={28} className="text-gray-300" />
          </button>
        </motion.div>
      </div>

      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-5"></div>
    </section>
  );
}
