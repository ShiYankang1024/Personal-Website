'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Code, Puzzle, Globe, Smartphone, Palette, X, Blend } from 'lucide-react';
// import SkillGraph from '@/components/g6/SkillGraph';

const skills = [
  {
    name: 'Web开发',
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
    description: 'Vue3, React, Next.js, TypeScript',
  },
  {
    name: '组件库',
    icon: Puzzle,
    color: 'from-green-500 to-emerald-500',
    description: 'Elementplus, WotUI, DataV',
  },
  {
    name: '数据可视化',
    icon: Palette,
    color: 'from-pink-500 to-purple-500',
    description: 'Canvas, Echarts, Three.js',
  },
  {
    name: '游戏开发',
    icon: Blend,
    color: 'from-purple-500 to-pink-500',
    description: 'Blender, Unity, UE',
  },
  {
    name: '移动端',
    icon: Smartphone,
    color: 'from-orange-500 to-red-500',
    description: 'Uni-app',
  },
  {
    name: 'Webgis',
    icon: Globe,
    color: 'from-yellow-500 to-orange-500',
    description: 'Leaflet, QGIS',
  },
];

export default function About() {
  const [showSkillModal, setShowSkillModal] = useState(false);
  const closeModal = () => setShowSkillModal(false);

  return (
    <section
      id="about"
      className="min-h-screen py-24 px-4 bg-gradient-to-b from-black via-gray-900 to-black"
    >
      <div className="max-w-7xl mx-auto">
        {/* <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8 text-white">
            About{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Me
            </span>
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
            Passionate developer crafting digital experiences with modern
            technologies
          </p>
        </motion.div> */}

        <div className="grid lg:grid-cols-2 gap-20 items-center mt-6 mb-14">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <motion.h3
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              animate={{
              y: [0, -6, 0],
              boxShadow: [
              '0 0 0px rgba(99,102,241,0.0)',
              '0 10px 30px rgba(99,102,241,0.35)',
              '0 0 0px rgba(99,102,241,0.0)',
              ],
              }}
              transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.4, ease: 'easeInOut' }}
              onClick={() => setShowSkillModal(true)}
              className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 text-white cursor-pointer select-none inline-flex items-center gap-3 justify-center"
              >
              <span className="relative bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                <span className="absolute inset-0 -z-10 blur-2xl bg-gradient-to-r from-blue-500/25 via-purple-500/20 to-pink-500/25 animate-pulse" />
                技能介绍
              </span>
            </motion.h3>
            <div className="space-y-8 text-gray-300 text-lg leading-relaxed font-light">
              <p>
                我是一名软件开发工程师，热衷于助力企业数字化、智能化转型，打造沉浸式数字体验。目前，我具备2年的软件开发工作经验，凭借 Vue3、React、Next.js、Uni-app、Three.js 和现代 Web 技术方面的专业知识，我能够通过简洁的代码和创新的解决方案，将创意变为现实。
              </p>
              <p>
                我对 3D 视觉呈现与交互充满热情，具备 WebGL 基础，并自学了 Blender 建模与 Unity 游戏编程，了解建模流程及着色器等核心概念，能够参与三维场景的构建与实现。
              </p>
              <p>
                在日常工作中，我积极拥抱 AI 工具，如 CodeX、Trea、Framer AI 等，持续探索人机协作的开发模式以提升效率。工作之外，我乐于参与开源项目、钻研新兴技术，并与开发者社区积极交流、分享心得，共同成长。
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-8"
          >
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20"
              >
                <div
                  className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${skill.color} flex items-center justify-center shadow-2xl`}
                >
                  <skill.icon size={36} className="text-white" />
                </div>
                <h4 className="text-white font-bold text-xl mb-3">
                  {skill.name}
                </h4>
                <p className="text-gray-400 text-sm font-light">
                  {skill.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black mb-16 text-white">
            专业技能
          </h3>
          <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
            {[
              'Vue3',
              'React',
              'Next.js',
              'TypeScript',
              'Node.js',
              'Three.js',
              'Tailwind CSS',
              'Git',
              'Uni-app',
              'Unity',
              'Echarts',
              'Blender',
            ].map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-full text-gray-300 hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-white/20 font-medium text-lg"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 transition-opacity duration-200 ${
          showSkillModal ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="技能介绍弹窗"
        aria-hidden={!showSkillModal}
        onClick={closeModal}
      >
        <motion.div
          initial={false}
          animate={
            showSkillModal
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 0, scale: 0.95, y: 20 }
          }
          transition={{ duration: 0.2 }}
          className="relative max-w-6xl w-full rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 p-10 text-white shadow-2xl min-h-[70vh]"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={closeModal}
            className="absolute right-4 top-4 text-sm px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="关闭技能介绍弹窗"
          >
            <X size={20} />
          </button>
          <h4 className="text-2xl font-bold mb-4">技能介绍</h4>
          {/* <SkillGraph /> */}
        </motion.div>
      </div>

      {/* {showSkillModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
          role="dialog"
          aria-modal="true"
          aria-label="技能介绍弹窗"
          onClick={closeModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-6xl w-full rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 p-10 text-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 text-sm px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="关闭技能介绍弹窗"
            >
              <X size={20} />
            </button>
            <h4 className="text-2xl font-bold mb-4">技能介绍</h4>
            <SkillGraph />
          </motion.div>
        </div>
      )}修改一下，只加载一次根据showSkillModal的值控制是否隐藏 */}
    </section>
  );
}
