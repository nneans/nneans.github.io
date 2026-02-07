function Publications() {
    // 논문이 추가되면 이 배열에 추가
    const publications = [
        // {
        //   type: 'Conference Paper',
        //   title: '논문 제목',
        //   authors: '저자1, 저자2, ...',
        //   venue: '학회/저널명, 년도',
        //   links: {
        //     paper: 'https://...',
        //     code: 'https://github.com/...',
        //   }
        // },
    ]

    return (
        <section id="publications" className="section">
            <div className="container">
                <h2 className="section-title">Publications</h2>

                {publications.length > 0 ? (
                    <div className="publications-list">
                        {publications.map((pub, index) => (
                            <article key={index} className="publication-card">
                                <span className="publication-type">{pub.type}</span>
                                <h3 className="publication-title">{pub.title}</h3>
                                <p className="publication-authors">{pub.authors}</p>
                                <p className="publication-venue">{pub.venue}</p>

                                {pub.links && (
                                    <div className="publication-links">
                                        {pub.links.paper && (
                                            <a
                                                href={pub.links.paper}
                                                className="btn btn-secondary"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                📄 Paper
                                            </a>
                                        )}
                                        {pub.links.code && (
                                            <a
                                                href={pub.links.code}
                                                className="btn btn-secondary"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                💻 Code
                                            </a>
                                        )}
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="publications-placeholder">
                        <div className="publications-placeholder-icon">📚</div>
                        <p>석사 과정 입학 후 연구 논문이 이곳에 추가될 예정입니다.</p>
                        <p className="text-secondary" style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                            Coming soon...
                        </p>
                    </div>
                )}
            </div>
        </section>
    )
}

export default Publications
