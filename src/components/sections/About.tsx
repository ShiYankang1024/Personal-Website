'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Blend,
  ChevronLeft,
  ChevronRight,
  Code,
  Globe,
  Mic,
  MicOff,
  Palette,
  Puzzle,
  Smartphone,
  Sparkles,
  X,
} from 'lucide-react';
// import SkillGraph from '@/components/g6/SkillGraph';

type SpeechRecognitionResultLike = {
  readonly transcript: string;
};

type SpeechRecognitionEventLike = Event & {
  readonly results: {
    readonly length: number;
    item(index: number): {
      readonly length: number;
      item(index: number): SpeechRecognitionResultLike;
      [index: number]: SpeechRecognitionResultLike;
    };
    [index: number]: {
      readonly length: number;
      item(index: number): SpeechRecognitionResultLike;
      [index: number]: SpeechRecognitionResultLike;
    };
  };
};

type SpeechRecognitionLike = EventTarget & {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const skills = [
  {
    name: 'Web开发',
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
    description: 'Vue3, React, Next.js, TypeScript',
    demo: '响应式页面、组件状态和动画协同',
    exampleImage: '/imgs/AI0.jpg',
    exampleTitle: '现代 Web 应用界面',
    exampleText:
      '熟练使用Vue3、React框架构建Web应用，围绕页面结构、状态管理、接口联动和动效体验构建完整前端应用。',
    examplePoints: ['组件化页面', '响应式布局', '良好交互反馈'],
    commands: ['打开 Web开发', '下一个', '增强'],
  },
  {
    name: '组件库',
    icon: Puzzle,
    color: 'from-green-500 to-emerald-500',
    description: 'Elementplus, WotUI, DataV',
    demo: '组件拆分、表单控件和业务模块复用',
    exampleImage: '/imgs/AI5.jpg',
    exampleTitle: '业务组件与可复用模块',
    exampleText:
      '熟悉单例和观察者等设计模式，将常用业务交互沉淀成稳定组件，提升后台、表单和数据页面的开发效率。',
    examplePoints: ['高复用组件', '统一交互状态', '业务模块复用'],
    commands: ['打开 组件库', '上一个', '减弱'],
  },
  {
    name: '数据可视化',
    icon: Palette,
    color: 'from-pink-500 to-purple-500',
    description: 'Canvas, Echarts, Three.js',
    demo: '动态图表、三维场景和数据叙事',
    exampleImage: '/imgs/XJ3.jpg',
    exampleTitle: '图表与可视化表达',
    exampleText:
      '熟悉使用Echarts、Canvas 和 Three.js构建可视化内容，把复杂数据转化为更容易理解的视觉信息。',
    examplePoints: ['动态图表呈现', 'Canvas 自定义绘制', '三维数据场景'],
    commands: ['打开 数据可视化', '演示', '增强'],
  },
  {
    name: '游戏开发',
    icon: Blend,
    color: 'from-purple-500 to-pink-500',
    description: 'Blender, Unity, UE',
    demo: '实时渲染、角色控制和交互反馈',
    exampleImage: '/imgs/ShootGame4.png',
    exampleTitle: '游戏场景与实时交互',
    exampleText:
      '熟悉Unity游戏开发和Lua热更新，结合建模、场景搭建和交互逻辑，完成可操作、可反馈的实时体验。',
    examplePoints: ['角色动作控制', '实时渲染反馈', '场景资源整合'],
    commands: ['打开 游戏开发', '演示', '减弱'],
  },
  {
    name: '移动端',
    icon: Smartphone,
    color: 'from-orange-500 to-red-500',
    description: 'Uni-app',
    demo: '跨端布局、触控交互和轻量应用',
    exampleImage: '/imgs/JS2.jpg',
    exampleTitle: '移动端页面与跨端适配',
    exampleText:
      '熟悉使用Uniapp开发移动端应用，面向移动端触控场景组织页面结构，兼顾不同屏幕尺寸和跨端发布。',
    examplePoints: ['页面布局适配', '触控交互设计', '多端页面复用'],
    commands: ['打开 移动端', '下一个', '关闭'],
  },
  {
    name: 'Webgis',
    icon: Globe,
    color: 'from-yellow-500 to-orange-500',
    description: 'Leaflet, QGIS',
    demo: '地图标注、空间数据和路径分析',
    exampleImage: '/imgs/SZ5.png',
    exampleTitle: '地图应用与空间信息',
    exampleText:
      '熟悉使用Leaflet、QGIS等工具处理地理空间数据，围绕地图底图、点线面数据和业务图层，构建空间信息展示与分析能力。',
    examplePoints: ['地图图层管理', '空间点位展示', '渲染性能优化'],
    commands: ['打开 Webgis', '上一个', '关闭'],
  },
];

export default function About() {
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);
  const [demoIntensity, setDemoIntensity] = useState(64);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [transcript, setTranscript] = useState('等待语音指令');
  const [commandLog, setCommandLog] = useState('点击技能卡片，或说“打开数据可视化”。');
  const activeSkillIndexRef = useRef(0);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const activeSkill = skills[activeSkillIndex];
  const voiceCommands = useMemo(
    () => ['打开技能介绍', '关闭', '下一个', '上一个', '增强', '减弱', '演示'],
    []
  );
  const visibleVoiceCommands = useMemo(
    () => Array.from(new Set([...voiceCommands, ...activeSkill.commands])),
    [activeSkill.commands, voiceCommands]
  );

  const closeModal = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    setShowSkillModal(false);
  };

  const openSkillModal = (index = activeSkillIndex) => {
    setActiveSkillIndex(index);
    setShowSkillModal(true);
  };

  const selectSkill = (index: number, source = '点击') => {
    activeSkillIndexRef.current = index;
    setActiveSkillIndex(index);
    setCommandLog(`${source}切换到：${skills[index].name}`);
  };

  const runDemoPulse = () => {
    const currentSkill = skills[activeSkillIndexRef.current];
    setDemoIntensity((value) => (value > 78 ? 42 : Math.min(value + 18, 96)));
    setCommandLog(`正在展示：${currentSkill.name} 的技能例图`);
  };

  const processVoiceCommand = (command: string) => {
    const normalizedCommand = command.replace(/\s/g, '').toLowerCase();
    const matchedSkillIndex = skills.findIndex((skill) =>
      normalizedCommand.includes(skill.name.toLowerCase())
    );

    if (normalizedCommand.includes('打开技能介绍')) {
      setShowSkillModal(true);
      setCommandLog('语音打开技能介绍面板');
      return;
    }

    if (normalizedCommand.includes('关闭')) {
      closeModal();
      setCommandLog('语音关闭技能介绍面板');
      return;
    }

    if (matchedSkillIndex >= 0) {
      setShowSkillModal(true);
      selectSkill(matchedSkillIndex, '语音');
      return;
    }

    if (normalizedCommand.includes('下一个')) {
      setActiveSkillIndex((index) => {
        const nextIndex = (index + 1) % skills.length;
        activeSkillIndexRef.current = nextIndex;
        setCommandLog(`语音切换到：${skills[nextIndex].name}`);
        return nextIndex;
      });
      return;
    }

    if (normalizedCommand.includes('上一个')) {
      setActiveSkillIndex((index) => {
        const nextIndex = (index - 1 + skills.length) % skills.length;
        activeSkillIndexRef.current = nextIndex;
        setCommandLog(`语音切换到：${skills[nextIndex].name}`);
        return nextIndex;
      });
      return;
    }

    if (normalizedCommand.includes('增强')) {
      setDemoIntensity((value) => Math.min(value + 12, 100));
      setCommandLog('语音增强演示强度');
      return;
    }

    if (normalizedCommand.includes('减弱')) {
      setDemoIntensity((value) => Math.max(value - 12, 20));
      setCommandLog('语音减弱演示强度');
      return;
    }

    if (normalizedCommand.includes('演示')) {
      runDemoPulse();
      return;
    }

    setCommandLog('没有匹配到指令，可以试试“下一个”或“增强”。');
  };

  const toggleVoiceControl = () => {
    const recognition = recognitionRef.current;

    if (!recognition) {
      setCommandLog('当前浏览器不支持语音控制。');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      setCommandLog('语音控制已暂停');
      return;
    }

    try {
      recognition.start();
      setIsListening(true);
      setCommandLog('正在监听语音指令');
    } catch {
      setCommandLog('语音识别正在初始化，请稍后再试。');
    }
  };

  useEffect(() => {
    activeSkillIndexRef.current = activeSkillIndex;
  }, [activeSkillIndex]);

  useEffect(() => {
    const Recognition =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!Recognition) {
      setIsVoiceSupported(false);
      return;
    }

    const recognition = new Recognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1][0];
      const spokenText = result.transcript.trim();
      setTranscript(spokenText);
      processVoiceCommand(spokenText);
    };
    recognition.onerror = () => {
      setIsListening(false);
      setCommandLog('语音识别中断，请重新点击麦克风。');
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    setIsVoiceSupported(true);

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, []);

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
              data-guide="skill-title"
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
              transition={{
                duration: 1.6,
                repeat: Infinity,
                repeatDelay: 0.4,
                ease: 'easeInOut',
              }}
              onClick={() => openSkillModal()}
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
            data-guide="skill-cards"
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
                onClick={() => openSkillModal(index)}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 cursor-pointer"
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
          className="relative max-h-[90vh] max-w-6xl w-full overflow-y-auto rounded-3xl bg-slate-950/95 backdrop-blur-xl border border-white/15 p-6 sm:p-8 lg:p-10 text-white shadow-2xl"
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
          <div className="mb-8 flex flex-col gap-4 pr-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-cyan-200">
                <Sparkles size={16} />
                互动技能演示
              </p>
              <h4 className="text-3xl font-black sm:text-4xl">
                语音控制能力面板
              </h4>
            </div>
            <button
              type="button"
              onClick={toggleVoiceControl}
              className={`inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors ${
                isListening
                  ? 'bg-red-500 text-white hover:bg-red-400'
                  : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
              } disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-gray-500`}
              disabled={!isVoiceSupported}
              aria-pressed={isListening}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              {isListening ? '停止语音' : '启动语音'}
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-baseline gap-3">
                  <p className="text-sm text-gray-400">当前演示</p>
                  <h5 className="text-2xl font-bold">
                    {activeSkill.name}
                  </h5>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      selectSkill(
                        (activeSkillIndex - 1 + skills.length) % skills.length
                      )
                    }
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 hover:bg-white/20"
                    aria-label="上一个技能"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      selectSkill((activeSkillIndex + 1) % skills.length)
                    }
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 hover:bg-white/20"
                    aria-label="下一个技能"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                <motion.div
                  key={activeSkill.name}
                  className="flex min-h-[360px] flex-col"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.35,
                    ease: 'easeOut',
                  }}
                >
                  <div className="relative h-52 overflow-hidden bg-slate-900 sm:h-64">
                    <Image
                      src={activeSkill.exampleImage}
                      alt={`${activeSkill.name} 例图`}
                      fill
                      sizes="(min-width: 1024px) 55vw, 100vw"
                      className="object-contain p-4"
                      style={{
                        filter: `saturate(${0.85 + demoIntensity / 100}) contrast(${0.9 + demoIntensity / 240})`,
                      }}
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-tr ${activeSkill.color} opacity-25 mix-blend-overlay`}
                    />
                    <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/55 px-3 py-2 text-sm font-semibold text-white backdrop-blur-md">
                      <activeSkill.icon size={16} />
                      {activeSkill.description}
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    <h6 className="text-2xl font-black leading-tight text-white">
                      {activeSkill.exampleTitle}
                    </h6>
                   <p className="mt-4 indent-[2em] text-base leading-7 text-gray-300">
                    {activeSkill.exampleText}
                    </p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                      {activeSkill.examplePoints.map((point) => (
                        <div
                          key={point}
                          className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-gray-200"
                        >
                          <span
                            className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${activeSkill.color}`}
                          />
                          {point}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-sm text-gray-400">语音识别</p>
                <p className="mt-3 min-h-8 text-lg font-semibold">
                  {isVoiceSupported ? transcript : '当前浏览器不支持语音控制'}
                </p>
                <p className="mt-3 text-sm text-cyan-200">{commandLog}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="mb-4 text-sm text-gray-400">可用指令</p>
                <div className="flex flex-wrap gap-2">
                  {visibleVoiceCommands.map((command) => (
                    <button
                      key={command}
                      type="button"
                      onClick={() => processVoiceCommand(command)}
                      className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-gray-200 hover:bg-white/20"
                    >
                      {command}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {skills.map((skill, index) => (
                  <button
                    key={skill.name}
                    type="button"
                    onClick={() => selectSkill(index)}
                    className={`rounded-2xl border p-4 text-left transition-colors ${
                      activeSkillIndex === index
                        ? 'border-cyan-300 bg-cyan-300/15'
                        : 'border-white/10 bg-white/[0.04] hover:bg-white/10'
                    }`}
                  >
                    <skill.icon size={20} className="mb-3" />
                    <span className="block text-sm font-semibold">
                      {skill.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
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
