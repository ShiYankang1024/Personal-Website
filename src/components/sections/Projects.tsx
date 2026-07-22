'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Route, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import projectsData from '@/data/projects.json';
// import ProjectGraph from '@/components/g6/ProjectGraph';

type Project = {
  title: string;
  description: string;
  technologies: string[];
  image: string;
  github: string;
  live: string;
  featured: boolean;
  model: string | null;
  screenshots: string[];
  detail?: {
    overview: string;
    role: string;
    highlights: string[];
  };
};

const projects: Project[] = projectsData as Project[];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[number] | null>(null);
  const [selectedDetailProject, setSelectedDetailProject] = useState<(typeof projects)[number] | null>(null);
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0);

  const modalScreenshots =
    selectedProject?.screenshots?.length
      ? selectedProject.screenshots
      : selectedProject?.image
        ? [selectedProject.image]
        : [];

  useEffect(() => {
    if (!selectedProject) {
      return;
    }

    const total = modalScreenshots.length;

    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;

      if (key === 'Escape') {
        setSelectedProject(null);
        return;
      }

      if (total > 1 && (key === 'ArrowLeft' || key === 'ArrowRight')) {
        event.preventDefault();
        setCurrentScreenshotIndex((prev) => {
          if (total <= 0) {
            return prev;
          }
          return key === 'ArrowLeft'
            ? (prev - 1 + total) % total
            : (prev + 1) % total;
        });
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedProject, modalScreenshots.length]);

  useEffect(() => {
    if (selectedProject) {
      setCurrentScreenshotIndex(0);
    }
  }, [selectedProject]);

  const handleOpenPreview = (project: (typeof projects)[number]) => {
    setSelectedProject(project);
    setCurrentScreenshotIndex(0);
  };

  const handleClosePreview = () => {
    setSelectedProject(null);
    setCurrentScreenshotIndex(0);
  };

  const handlePrevScreenshot = () => {
    if (modalScreenshots.length <= 1) {
      return;
    }
    setCurrentScreenshotIndex(
      (prev) => (prev - 1 + modalScreenshots.length) % modalScreenshots.length,
    );
  };

  const handleNextScreenshot = () => {
    if (modalScreenshots.length <= 1) {
      return;
    }
    setCurrentScreenshotIndex(
      (prev) => (prev + 1) % modalScreenshots.length,
    );
  };

  const hasScreenshots = modalScreenshots.length > 0;
  const currentScreenshotSrc = hasScreenshots
    ? modalScreenshots[currentScreenshotIndex % modalScreenshots.length]
    : null;

  const [showProjectModal, setShowProjectModal] = useState(false);
  const closeModal = () => {
    setShowProjectModal(false);
    setSelectedDetailProject(null);
  };

  const handleOpenProjectDetail = (project: (typeof projects)[number]) => {
    setSelectedDetailProject(project);
    setShowProjectModal(true);
  };

  return (
    <section
      id="projects"
      className="min-h-screen py-24 px-4 bg-gradient-to-b from-gray-900 via-black to-gray-900"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mt-5"
        >
          <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center mt-5 mb-10"
        >
          <h3 className="text-4xl sm:text-5xl md:text-6xl font-black mb-8 text-white">
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              项目经历
            </span>
          </h3>
          </motion.div>
        </motion.div>

        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-10"
            onClick={handleClosePreview}
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedProject.title} preview gallery`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-7xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-white"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleClosePreview}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="关闭预览"
              >
                <X size={20} />
              </button>

              <h4 className="text-2xl font-bold mb-6">{selectedProject.title}</h4>
              <p className="text-gray-200 mb-8 leading-relaxed">
                {selectedProject.description}
              </p>

              <div className="relative flex flex-col items-center">
                {hasScreenshots ? (
                  <div className="relative mx-auto aspect-video w-full max-w-[1150px] max-h-[62vh] overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                    <div className="absolute inset-1">
                      <Image
                        src={currentScreenshotSrc ?? ''}
                        alt={`DMKant ${selectedProject.title} 预览图`}
                        fill
                        sizes="(min-width: 1280px) 1150px, calc(100vw - 64px)"
                        className="object-contain transition-transform duration-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex h-[300px] w-[400px] items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black/40 p-12 text-center text-gray-300">
                    No preview image available
                  </div>
                )}
                {modalScreenshots.length > 1 && (
                  <div className="mt-4 flex items-center gap-4">
                    <button
                      type="button"
                      onClick={handlePrevScreenshot}
                      className="rounded-full bg-white/15 p-3 text-white transition hover:bg-white/25"
                          aria-label="Previous preview image"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <p className="text-sm text-gray-300">
                      {currentScreenshotIndex + 1} / {modalScreenshots.length}
                    </p>
                    <button
                      type="button"
                      onClick={handleNextScreenshot}
                      className="rounded-full bg-white/15 p-3 text-white transition hover:bg-white/25"
                          aria-label="Next preview image"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        <div
          data-guide="project-featured"
          className="grid lg:grid-cols-3 gap-12 mb-20"
        >
          {projects
            .filter((p) => p.featured)
            .map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group relative bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-500 border border-white/10 hover:border-white/20"
              >
                <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 relative overflow-hidden mb-4">
                  <Image
                    src={project.screenshots?.[0] ?? project.image}
                    alt={`DMKant ${project.title} 预览图`}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 mix-blend-overlay opacity-60"></div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
                    <button
                      type="button"
                      onClick={() => handleOpenPreview(project)}
                      className="p-4 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
                      aria-label={`Preview ${project.title} gallery`}
                    >
                      <Eye size={28} className="text-white" />
                    </button>
                    {/* <button
                      type="button"
                      onClick={() => handleOpenProjectDetail(project)}
                      className="p-4 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
                      aria-label={`查看 ${project.title} 项目详情`}
                    >
                      <Route size={28} className="text-white" />
                    </button> */}
                  </div>
                </div>

                <div className="p-10">
                  <h3 className="text-3xl font-black text-white mb-6">
                    {project.title}
                  </h3>
                  <p className="text-gray-300 mb-8 leading-relaxed text-lg font-light">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-3 mb-10">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-sm text-gray-300 border border-white/10 font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* <div className="flex gap-6">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-white/20 font-bold"
                    >
                      <Github size={20} />
                      <span>Code</span>
                    </a>
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-bold"
                    >
                      <ExternalLink size={20} />
                      <span>Live Demo</span>
                    </a>
                  </div> */}
                </div>
              </motion.div>
            ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black mb-12 text-white">
            更多作品
          </h3>
            <div data-guide="project-more"
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects
              .filter((p) => !p.featured)
              .map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20"
                >
                  {/* <ProjectModelCanvas modelUrl={project.model} /> */}
                  <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 relative overflow-hidden">
                    <Image
                      src={project.screenshots?.[0] ?? project.image}
                      alt={`DMKant ${project.title} 预览图`}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 mix-blend-overlay opacity-60"></div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
                      <button
                        type="button"
                        onClick={() => handleOpenPreview(project)}
                        className="p-4 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
                        aria-label={`Preview ${project.title} gallery`}
                      >
                        <Eye size={28} className="text-white" />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-2xl font-black text-white mt-4 mb-4">
                    {project.title}
                  </h4>
                  <p className="text-gray-300 text-base mb-6 leading-relaxed font-light">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-xs text-gray-300 border border-white/10 font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    {project.github&&(<a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-white/20"
                    >
                      <Github
                        size={18}
                        className="text-gray-300 hover:text-white"
                      />
                    </a>)}
                    <button
                      type="button"
                      onClick={() => handleOpenProjectDetail(project)}
                      className="p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-white/20"
                      aria-label={`查看 ${project.title} 项目详情`}
                    >
                      <Route
                        size={18}
                        className="text-gray-300 hover:text-white"
                      />
                    </button>
                    {project.live&&(<a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/10 hover:border-white/20"
                    >
                      <ExternalLink
                        size={18}
                        className="text-gray-300 hover:text-white"
                      />
                    </a>)}
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>
      </div>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 transition-opacity duration-200 ${
          showProjectModal ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="项目详情弹窗"
        aria-hidden={!showProjectModal}
        onClick={closeModal}
      >
        <motion.div
          initial={false}
          animate={
            showProjectModal
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 0, scale: 0.95, y: 20 }
          }
          transition={{ duration: 0.2 }}
          className="relative max-h-[88vh] max-w-6xl w-full overflow-y-auto rounded-3xl bg-slate-950/95 backdrop-blur-xl border border-white/15 p-6 text-white shadow-2xl sm:p-8 lg:p-10"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={closeModal}
            className="absolute right-4 top-4 text-sm px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="关闭项目详情弹窗"
          >
            <X size={20} />
          </button>
          <div className="mb-8 pr-10">
            <p className="mb-2 text-sm font-semibold text-cyan-200">
              项目详情
            </p>
            <h4 className="text-3xl font-black leading-tight">
              {selectedDetailProject?.title ?? '项目详情'}
            </h4>
          </div>

          {selectedDetailProject?.detail ? (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
                <h5 className="mb-4 text-xl font-bold text-white">
                  项目概述
                </h5>
                <p className="indent-[2em] text-base leading-8 text-gray-300">
                  {selectedDetailProject.detail.overview}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
                <h5 className="mb-4 text-xl font-bold text-white">
                  项目角色
                </h5>
                <p className="indent-[2em] text-base leading-8 text-gray-300">
                  {selectedDetailProject.detail.role}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
                <h5 className="mb-5 text-xl font-bold text-white">
                  核心工作
                </h5>
                <div className="space-y-4">
                  {selectedDetailProject.detail.highlights.map((highlight, index) => (
                    <div
                      key={highlight}
                      className="rounded-2xl border border-white/10 bg-black/20 p-5"
                    >
                      <span className="mb-3 text-sm font-semibold text-cyan-200">
                        （{index + 1}）
                      </span>
                      <span className="text-base leading-8 text-gray-300">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-base leading-8 text-gray-300">
                暂未配置该项目的详细说明。
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}








