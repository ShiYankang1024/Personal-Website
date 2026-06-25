import Navigation from '@/components/Navigation';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
// import Contact from '@/components/sections/Contact';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';
import GuideTour from '@/components/GuideTour';

const guideSteps = [
  {
    selector: '[data-guide="hero"]',
    title: '沉浸式首页',
    description: '网站首页，可以向下进入技能与项目内容。',
    placement: 'bottom' as const,
  },
  {
    selector: '[data-guide="navigation"]',
    title: '快速导航',
    description: '顶部导航可以快速跳转首页、关于和项目区域，适合快速浏览作品集。',
    placement: 'bottom' as const,
  },
  {
    selector: '[data-guide="skill-title"]',
    title: '互动技能演示',
    description: '点击“技能介绍”会打开技能演示面板，里面支持按钮和语音控制。',
    placement: 'bottom' as const,
  },
  {
    selector: '[data-guide="skill-cards"]',
    title: '技能分类',
    description: '这些卡片代表不同能力方向，点击任意卡片可以直接进入对应的演示内容。',
    placement: 'left' as const,
  },
  {
    selector: '[data-guide="project-featured"]',
    title: '项目作品',
    description: '这里展示重点项目，支持图片预览、在线演示和项目详情入口。',
    placement: 'top' as const,
  },
  {
    selector: '[data-guide="project-more"]',
    title: '更多作品',
    description: '这里展示业余时间创作的项目，设计游戏开发，APP开发等多方向。',
    placement: 'top' as const,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <LoadingScreen />
      <Navigation />
      <div id="home">
        <Hero />
      </div>
      <About />
      <Projects />
      {/* <Contact /> */}
      <Footer />
      <GuideTour steps={guideSteps} />
    </main>
  );
}
