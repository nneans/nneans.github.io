import { profile } from '../data/profile'
import { Mail, Github, BookOpen, Award } from 'lucide-react'

function ProfileSidebar() {
    return (
        <aside className="sidebar">
            <div className="profile-photo-container">
                {/* Placeholder for Face/Photo */}
                <div className="profile-photo-placeholder">
                    <span className="emoji-avatar">👨‍💻</span>
                </div>
            </div>

            <div className="profile-info">
                <h1 className="name">{profile.name}</h1>
                <p className="role">{profile.role}</p>
                <p className="bio">{profile.bio || "Data & AI Enthusiast"}</p>

                <div className="separator"></div>

                <div className="info-group">
                    <h3><BookOpen size={16} /> Education</h3>
                    {profile.education.map((edu, index) => (
                        <div key={index} className="info-item">
                            <span className="school">{edu.school}</span>
                            <span className="major">{edu.major}</span>
                            <span className="period">{edu.period}</span>
                        </div>
                    ))}
                </div>

                <div className="info-group">
                    <h3><Award size={16} /> Awards</h3>
                    {/* Show only top 2 or so to save space, or all if it fits */}
                    {profile.awards.slice(0, 3).map((award, index) => (
                        <div key={index} className="info-item">
                            <span className="award-title">{award.title}</span>
                            <span className="award-name">{award.award}</span>
                        </div>
                    ))}
                </div>

                <div className="separator"></div>

                <div className="contact-links">
                    <a href={`mailto:${profile.email}`} className="contact-btn">
                        <Mail size={18} /> Email Me
                    </a>
                    <a href={profile.github} target="_blank" rel="noreferrer" className="contact-btn">
                        <Github size={18} /> GitHub
                    </a>
                </div>
            </div>
        </aside>
    )
}

export default ProfileSidebar
