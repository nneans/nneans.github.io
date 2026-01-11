function Experience() {
    const experiences = [
        {
            date: '2026.03 - Present',
            title: '석사과정',
            organization: '대학교 연구실',
            description: '석사 과정 입학 예정. 연구 분야 및 상세 내용은 추후 업데이트 예정.',
        },
        {
            date: '2022.03 - 2026.02',
            title: '학사과정',
            organization: '대학교 컴퓨터공학과',
            description: '컴퓨터공학 전공. 자료구조, 알고리즘, 인공지능, 데이터베이스 등 수강.',
        },
        // 경력/인턴 추가
        // {
        //   date: '2024.06 - 2024.08',
        //   title: '소프트웨어 엔지니어 인턴',
        //   organization: '회사명',
        //   description: '담당 업무 설명...',
        // },
    ]

    return (
        <section id="experience" className="experience section">
            <div className="container">
                <h2 className="section-title">Experience</h2>

                <div className="timeline">
                    {experiences.map((exp, index) => (
                        <div key={index} className="timeline-item">
                            <div className="timeline-dot" />
                            <div className="timeline-content">
                                <span className="timeline-date">{exp.date}</span>
                                <h3 className="timeline-title">{exp.title}</h3>
                                <p className="timeline-organization">{exp.organization}</p>
                                <p className="timeline-description">{exp.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Experience
