import { useState } from 'react'
import './App.css'
import { profile } from './data/profile'
import ProjectGraph from './components/ProjectGraph'
import ProjectModal from './components/ProjectModal'
import LikeButton from './components/LikeButton'
import { Github, Mail, MapPin } from 'lucide-react';

const ProjectCard = ({ project, isAward, simple }) => (
  <div className="project-item">
    <h4 className="project-title">
      {isAward && <span className="trophy-badge">🏆</span>}
      {project.title}
    </h4>
    <p className="project-subtitle">{project.subtitle}</p>
    <p className="project-meta">
      {project.role && <span className="project-role">{project.role} · </span>}
      {project.affiliation} · {project.period}
    </p>

    <p className="project-description">{project.description}</p>

    {!simple && (
      <>
        {project.tech && project.tech.length > 0 && (
          <div className="project-tech">
            {project.tech.map((t, i) => (
              <span key={i} className="tech-tag">#{t}</span>
            ))}
          </div>
        )}

        {(project.materials?.length > 0 || project.links?.length > 0) && (
          <div className="project-actions">
            {project.materials?.map((m, i) => (
              <a key={`mat-${i}`} href={m.url} className="action-btn material-btn">📄 {m.name}</a>
            ))}
            {project.links?.map((l, i) => (
              <a key={`link-${i}`} href={l.url} className="action-btn link-btn" target="_blank" rel="noreferrer">🔗 {l.name}</a>
            ))}
          </div>
        )}
      </>
    )}
  </div>
);

function App() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="page-wrapper">
      {/* Top Navigation */}
      <nav className="top-nav" aria-label="Main navigation">
        <a href="#about" aria-label="Go to homepage section">Homepage</a>
        <a href="#awards" aria-label="Go to awards section">Awards</a>
        {profile.publications && profile.publications.length > 0 && (
          <a href="#publications" aria-label="Go to publications section">Publications</a>
        )}
        <a href="#archive" aria-label="Go to project archive section">Archive</a>
      </nav>

      <div className="main-layout">
        <aside className="sidebar">
          <div className="relative inline-block w-[160px] mb-4">
            <div className="profile-image" style={{ marginBottom: 0 }}>
              <img
                src="/profile.png"
                alt={`${profile.name} profile`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
            </div>
            {/* Attached Like Button */}
            <LikeButton />
          </div>

          <h3 className="sidebar-name">{profile.name}</h3>
          <p className="sidebar-university">{profile.university}</p>



          <div className="sidebar-education">
            {profile.education.map((edu, i) => (
              <div key={i} className="sidebar-edu-item">
                <span className="edu-degree">{edu.degree}</span> in {edu.field}
                {edu.advisorUrl && (
                  <>
                    {' '}
                    <a href={edu.advisorUrl} target="_blank" rel="noreferrer" className="edu-lab-link" style={{ color: '#2C5282', fontWeight: 600 }}>
                      (BAE LAB)
                    </a>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Research Interests in Sidebar */}
          <div className="sidebar-interests">
            <h4 className="sidebar-section-title">Research Interests</h4>
            <ul className="sidebar-interest-list">
              {profile.researchInterests.map((interest, i) => (
                <li key={i}>{interest}</li>
              ))}
            </ul>
          </div>

          <ul className="sidebar-links">
            {profile.socialLinks.map((link, i) => {
              let IconComponent = null;
              if (link.label === 'GitHub') IconComponent = <Github size={20} />;
              else if (link.label === 'Email') IconComponent = <Mail size={20} />;
              else if (link.label.includes('Busan')) IconComponent = <MapPin size={20} />;
              else IconComponent = <span>{link.icon}</span>;

              return (
                <li key={i}>
                  <span className="link-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {IconComponent}
                  </span>
                  {link.url ? (
                    <a href={link.url} target="_blank" rel="noreferrer">{link.label}</a>
                  ) : (
                    <span>{link.label}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="content">
          {/* Intro Section */}
          <section id="about" className="section intro-section">
            <h1 className="intro-title">
              Hi, I'm {profile.name} :)
            </h1>
            {profile.tagline && (
              <h2 className="intro-tagline">{profile.tagline}</h2>
            )}
            {profile.bioLine2 && (
              <p className="intro-bio">{profile.bioLine2}</p>
            )}
            {profile.bioLine1 && (
              <p className="intro-bio">{profile.bioLine1}</p>
            )}
            {profile.internships && profile.internships.map((intern, i) => (
              <p key={i} className="intro-bio">{intern.company}, {intern.location} ({intern.period})</p>
            ))}
          </section>



          {/* 1. Honors & Awards */}
          {profile.competitions && profile.competitions.length > 0 && (
            <section id="awards" className="section">
              <h2 className="section-title">Awards</h2>
              <div className="awards-list-simple">
                {profile.competitions.filter(p => !p.hideInList).map((project, i) => (
                  <div key={i} className="award-simple-item">
                    <span className="award-date">{project.period}</span>
                    <span className="award-content">
                      {project.affiliation} · {project.title} · <strong>{project.role}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 3. Project Archive */}
          <section id="archive" className="section">
            <h2 className="section-title">Archive</h2>
            <ProjectGraph
              profiles={profile}
              onNodeClick={setSelectedProject}
              selectedProject={selectedProject}
            />
          </section>

          {/* 2. Publications (논문 나오면 표시) */}
          {profile.publications && profile.publications.length > 0 && (
            <section id="publications" className="section">
              <h2 className="section-title">Publications</h2>
              <div className="publications-list">
                {profile.publications.map((pub, i) => (
                  <div key={i} className="publication-item">
                    {pub.image && (
                      <div className="pub-image">
                        <img src={pub.image} alt={pub.title} loading="lazy" />
                      </div>
                    )}
                    <div className="pub-content">
                      <h4 className="pub-title">
                        {pub.link ? <a href={pub.link} target="_blank" rel="noreferrer">{pub.title}</a> : pub.title}
                      </h4>
                      <p className="pub-authors">{pub.authors}</p>
                      <p className="pub-venue">
                        {pub.venue}, {pub.year}
                        {pub.codeLink && <a href={pub.codeLink} target="_blank" rel="noreferrer">[Code]</a>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}


        </main>
      </div>

      {/* Detail Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

    </div>
  )
}

export default App
