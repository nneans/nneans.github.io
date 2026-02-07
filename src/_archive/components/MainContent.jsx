import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { projects } from '../data/projects'
import { X, Github, ExternalLink, Download } from 'lucide-react'
import MinoWorkflow from './MinoWorkflow'

function MainContent() {
    const [activeTab, setActiveTab] = useState('All')
    const [selectedProject, setSelectedProject] = useState(null)

    const tabs = ['All', 'Projects', 'Research', 'Competitions']

    const filteredProjects = useMemo(() => {
        if (activeTab === 'All') return projects
        if (activeTab === 'Projects') return projects.filter(p => p.type === 'Personal Project')
        if (activeTab === 'Research') return projects.filter(p => p.type === 'Research')
        if (activeTab === 'Competitions') return projects.filter(p => p.type === 'Competition')
        return projects
    }, [activeTab])

    const openModal = (project) => {
        setSelectedProject(project)
        document.body.style.overflow = 'hidden'
    }

    const closeModal = () => {
        setSelectedProject(null)
        document.body.style.overflow = 'auto'
    }

    return (
        <main className="main-content">
            <header className="content-header">
                <nav className="tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </header>

            <motion.div
                layout
                className="projects-list"
            >
                <AnimatePresence mode='popLayout'>
                    {filteredProjects.map((project) => (
                        <motion.div
                            layout
                            key={project.id}
                            className="project-row"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => openModal(project)}
                        >
                            <div className="row-image">
                                {project.image ? (
                                    <img src={project.image} alt={project.title} />
                                ) : (
                                    <div className="placeholder">{project.emoji}</div>
                                )}
                            </div>
                            <div className="row-content">
                                <span className="project-type">{project.type}</span>
                                <div className="project-title">
                                    <h3>{project.title}</h3>
                                </div>
                                <p className="project-desc">{project.shortDesc}</p>
                                <div className="row-tags">
                                    {project.tech.map(t => <span key={t}>{t}</span>)}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <div className="modal-backdrop" onClick={closeModal}>
                        <motion.div
                            className="modal-panel"
                            onClick={(e) => e.stopPropagation()}
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        >
                            <button className="close-btn" onClick={closeModal}><X /></button>

                            <div className="modal-content-scroller">
                                <div className="modal-hero">
                                    {selectedProject.image ? (
                                        <img src={selectedProject.image} alt={selectedProject.title} />
                                    ) : (
                                        <div className="emoji-hero">{selectedProject.emoji}</div>
                                    )}
                                </div>

                                <div className="modal-details">
                                    <span className="type-badge">{selectedProject.type}</span>
                                    <h1>{selectedProject.title}</h1>
                                    <p className="subtitle">{selectedProject.subtitle}</p>

                                    <div className="project-links">
                                        {selectedProject.github && (
                                            <a href={selectedProject.github} target="_blank" rel="noreferrer">
                                                <Github size={16} /> Source
                                            </a>
                                        )}
                                        {selectedProject.demoUrl && (
                                            <a href={selectedProject.demoUrl} target="_blank" rel="noreferrer" className="highlight">
                                                <ExternalLink size={16} /> Live Demo
                                            </a>
                                        )}
                                        {selectedProject.pptFile && (
                                            <a href={selectedProject.pptFile} download>
                                                <Download size={16} /> Review Paper/PPT
                                            </a>
                                        )}
                                    </div>

                                    <div className="desc-section">
                                        <h3>Overview</h3>
                                        <p>{selectedProject.fullDesc}</p>
                                    </div>

                                    <div className="desc-section">
                                        <h3>Tech Stack</h3>
                                        <div className="tags-list">
                                            {selectedProject.tech.map(t => <span key={t} className="tag">{t}</span>)}
                                        </div>
                                    </div>

                                    {selectedProject.title === 'Mino' && (
                                        <div className="desc-section">
                                            <h3>Workflow</h3>
                                            <MinoWorkflow />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    )
}

export default MainContent
