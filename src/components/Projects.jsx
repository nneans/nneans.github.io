import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, X, Download, Play, ExternalLink } from 'lucide-react'
import MinoWorkflow from './MinoWorkflow'
import { projects } from '../data/projects'
import './BentoGrid.css'

function Projects() {
    const [selectedProject, setSelectedProject] = useState(null)

    const openModal = (project) => {
        setSelectedProject(project)
        document.body.style.overflow = 'hidden'
    }

    const closeModal = () => {
        setSelectedProject(null)
        document.body.style.overflow = 'auto'
    }

    return (
        <section id="projects" className="section">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">
                        Selected <span className="text-accent">Works</span>
                    </h2>
                    <p className="section-subtitle">
                        데이터와 AI로 문제를 해결한 주요 프로젝트들입니다.
                    </p>
                </motion.div>

                <div className="bento-grid">
                    {projects.map((project, index) => (
                        <motion.article
                            key={project.id}
                            className={`bento-card ${project.bentoSize || 'small'}`}
                            onClick={() => openModal(project)}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="bento-image-wrapper">
                                {project.image ? (
                                    <img src={project.image} alt={project.title} />
                                ) : (
                                    <div className="bento-emoji-wrapper">
                                        {project.emoji}
                                    </div>
                                )}
                            </div>

                            <div className="bento-content">
                                <span className="bento-type">{project.type}</span>
                                <h3 className="bento-title">{project.title}</h3>
                                <p className="bento-desc">{project.shortDesc}</p>

                                <div className="bento-tech-stack">
                                    {project.tech.slice(0, 3).map((t) => (
                                        <span key={t} className="tech-pill">{t}</span>
                                    ))}
                                    {project.tech.length > 3 && (
                                        <span className="tech-pill">+{project.tech.length - 3}</span>
                                    )}
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        className="modal-overlay"
                        onClick={closeModal}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        >
                            <button className="modal-close" onClick={closeModal}>
                                <X size={24} />
                            </button>

                            <div className="modal-header">
                                <div className="modal-image-container">
                                    {selectedProject.image ? (
                                        <img src={selectedProject.image} alt={selectedProject.title} className="modal-image" />
                                    ) : (
                                        <span className="modal-emoji-large">{selectedProject.emoji}</span>
                                    )}
                                </div>
                                <div className="modal-header-content">
                                    <span className="project-label highlight">{selectedProject.type}</span>
                                    <h2 className="modal-title">{selectedProject.title}</h2>
                                    {selectedProject.subtitle && (
                                        <p className="modal-subtitle">{selectedProject.subtitle}</p>
                                    )}
                                    <div className="modal-meta">
                                        {selectedProject.period && (
                                            <span className="modal-period">{selectedProject.period}</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="modal-body">
                                <div className="modal-section">
                                    <h3>Project Overview</h3>
                                    <p className="modal-description">{selectedProject.fullDesc}</p>
                                </div>

                                <div className="modal-section">
                                    <h3>Tech Stack</h3>
                                    <div className="project-tech">
                                        {selectedProject.tech.map((t) => (
                                            <span key={t} className="tech-tag">{t}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="modal-links">
                                    {selectedProject.github && (
                                        <a
                                            href={selectedProject.github}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-outline"
                                        >
                                            <Github size={18} style={{ marginRight: '8px' }} /> GitHub
                                        </a>
                                    )}
                                    {selectedProject.pptFile && (
                                        <a
                                            href={selectedProject.pptFile}
                                            download
                                            className="btn btn-primary"
                                        >
                                            <Download size={18} style={{ marginRight: '8px' }} /> 발표자료
                                        </a>
                                    )}
                                    {selectedProject.appDownload && (
                                        <a
                                            href={selectedProject.appDownload}
                                            download
                                            className="btn btn-primary"
                                        >
                                            <Download size={18} style={{ marginRight: '8px' }} /> 앱 다운로드 (macOS)
                                        </a>
                                    )}
                                    {selectedProject.demoUrl && (
                                        <a
                                            href={selectedProject.demoUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-accent"
                                        >
                                            <ExternalLink size={18} style={{ marginRight: '8px' }} /> Visit Site
                                        </a>
                                    )}
                                </div>

                                {/* Interactive Demo Embed (Mino specific) */}
                                {selectedProject.hasDemo && selectedProject.demoUrl && (
                                    <div className="demo-section-container">
                                        <h4 className="demo-title">
                                            <Play size={20} className="icon-pulse" /> Live Demo
                                        </h4>
                                        <div className="demo-launcher" onClick={() => window.open(selectedProject.demoUrl, 'MinoDemo', 'width=1280,height=800')}>
                                            <div className="demo-preview-overlay">
                                                <Play size={48} fill="currentColor" />
                                                <span>지출 관리 데모 실행하기</span>
                                            </div>
                                            <img src={selectedProject.image} className="demo-bg-preview" alt="demo" />
                                        </div>
                                    </div>
                                )}

                                {/* Mino Workflow Diagram */}
                                {selectedProject.title === 'Mino' && <MinoWorkflow />}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}

export default Projects
