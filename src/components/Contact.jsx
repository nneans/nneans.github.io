function Contact() {
    const email = 'your.email@example.com'

    const socialLinks = [
        {
            name: 'GitHub',
            icon: '🐙',
            url: 'https://github.com/yourusername',
        },
        {
            name: 'LinkedIn',
            icon: '💼',
            url: 'https://linkedin.com/in/yourusername',
        },
        {
            name: 'Blog',
            icon: '📝',
            url: 'https://yourblog.com',
        },
    ]

    return (
        <section id="contact" className="contact section">
            <div className="container">
                <h2 className="section-title" style={{ justifyContent: 'center' }}>
                    Get In Touch
                </h2>

                <p className="contact-intro">
                    새로운 기회나 협업에 대해 언제든지 이야기 나눌 준비가 되어 있습니다.
                    연구, 프로젝트, 또는 그냥 인사를 하고 싶으시다면 편하게 연락주세요!
                </p>

                <div className="contact-email">
                    <a href={`mailto:${email}`}>{email}</a>
                </div>

                <div className="contact-social">
                    {socialLinks.map(social => (
                        <a
                            key={social.name}
                            href={social.url}
                            className="social-link"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.name}
                        >
                            {social.icon}
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Contact
