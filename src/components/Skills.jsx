function Skills() {
    const skillCategories = [
        {
            icon: '💻',
            title: 'Programming Languages',
            skills: ['Python', 'JavaScript', 'TypeScript', 'SQL'],
        },
        {
            icon: '🌐',
            title: 'Web Development',
            skills: ['React', 'HTML/CSS', 'Node.js', 'Flask', 'REST API'],
        },
        {
            icon: '🤖',
            title: 'AI & Data Science',
            skills: ['TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn'],
        },
        {
            icon: '🛠️',
            title: 'Tools & Platforms',
            skills: ['Git', 'Docker', 'Linux', 'VS Code', 'Jupyter'],
        },
    ]

    return (
        <section id="skills" className="skills section">
            <div className="container">
                <h2 className="section-title">Skills</h2>

                <div className="skills-grid">
                    {skillCategories.map(category => (
                        <div key={category.title} className="skill-category">
                            <div className="skill-category-icon">{category.icon}</div>
                            <h3 className="skill-category-title">{category.title}</h3>
                            <div className="skill-list">
                                {category.skills.map(skill => (
                                    <span key={skill} className="tag">{skill}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Skills
