function Hero() {
    return (
        <section id="hero" className="hero-section">
            <div className="hero-container">
                <div className="hero-content">
                    <div className="hero-badge">Available for projects</div>
                    <h1 className="hero-title">
                        DESIGNING <span className="text-accent">FINANCIAL</span> <br />
                        FREEDOM WITH <span className="text-secondary">AI</span>
                    </h1>
                    <p className="hero-description">
                        안녕하세요, 데이터와 인공지능으로 복잡한 금융 데이터를
                        명확하고 아름다운 통찰로 바꾸는 개발자 강명균입니다.
                    </p>
                    <div className="hero-actions">
                        <a href="#projects" className="btn btn-primary btn-large">
                            VIEW PROJECTS
                        </a>
                        <a href="#contact" className="btn btn-outline btn-large">
                            CONTACT ME
                        </a>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="visual-card">
                        <div className="visual-inner">
                            <div className="illustration-placeholder">
                                <div className="shape shape-1"></div>
                                <div className="shape shape-2"></div>
                                <div className="shape shape-3"></div>
                            </div>
                        </div>
                        <div className="visual-tag">Mino AI v4.0</div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
