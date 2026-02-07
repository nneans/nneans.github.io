function About() {
    const interests = [
        'Machine Learning',
        'Natural Language Processing',
        'Data Science',
        'Software Engineering',
        'Process Mining',
    ]

    return (
        <section id="about" className="about section">
            <div className="container">
                <h2 className="section-title">About Me</h2>

                <div className="about-content">
                    <div className="about-image-wrapper">
                        <div className="about-image">
                            👨‍💻
                        </div>
                    </div>

                    <div className="about-text">
                        <h3>개발하는 것을 즐기는 예비 연구자입니다</h3>
                        <p>
                            안녕하세요! 저는 기술을 통해 복잡한 문제를 해결하는 것에 관심이 많은
                            개발자입니다. 석사 진학을 앞두고 있으며, 연구와 개발 모두에 열정을
                            가지고 있습니다.
                        </p>
                        <p>
                            개인 프로젝트로 AI 기반 가계부 앱을 개발하면서, 실생활의 문제를
                            기술로 해결하는 경험을 쌓고 있습니다. 앞으로 랩실에서 진행하는
                            연구 프로젝트와 논문 작업에도 적극적으로 참여할 예정입니다.
                        </p>

                        <div className="about-interests">
                            <h4>Research Interests</h4>
                            <div className="interest-tags">
                                {interests.map(interest => (
                                    <span key={interest} className="tag tag-accent">
                                        {interest}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About
