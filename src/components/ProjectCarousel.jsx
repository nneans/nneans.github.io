import React, { useRef, useEffect } from 'react'

const CARD_COLORS = [
    { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: '#fff' },
    { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', text: '#fff' },
    { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', text: '#fff' },
    { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', text: '#1a1a2e' },
    { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', text: '#1a1a2e' },
    { bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', text: '#1a1a2e' },
    { bg: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', text: '#1a1a2e' },
]

const ProjectCard = ({ project, index, onClick, colors }) => {
    return (
        <div
            className="project-scroll-card"
            onClick={() => onClick?.(project)}
            style={{
                background: colors.bg,
                color: colors.text,
                minWidth: '320px',
                maxWidth: '320px',
                height: '220px',
                borderRadius: '16px',
                padding: '24px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                flexShrink: 0,
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.25)'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.15)'
            }}
        >
            {/* Category Badge */}
            <div style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                opacity: 0.8,
                textTransform: 'uppercase',
                letterSpacing: '1px',
            }}>
                {project.affiliation || 'Project'}
            </div>

            {/* Title */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    lineHeight: '1.3',
                    margin: 0,
                    fontFamily: '"Segoe UI", -apple-system, sans-serif',
                }}>
                    {project.title}
                </h3>
                {project.subtitle && (
                    <p style={{
                        fontSize: '0.9rem',
                        opacity: 0.85,
                        marginTop: '8px',
                        lineHeight: '1.4',
                    }}>
                        {project.subtitle.length > 60
                            ? project.subtitle.slice(0, 60) + '...'
                            : project.subtitle}
                    </p>
                )}
            </div>

            {/* Period */}
            <div style={{
                fontSize: '0.8rem',
                opacity: 0.7,
                fontWeight: '500',
            }}>
                {project.period}
            </div>
        </div>
    )
}

const ProjectCarousel = ({ profiles, onNodeClick }) => {
    const scrollRef = useRef(null)

    const allProjects = [
        ...(profiles.researchExperience || []),
        ...(profiles.personalProjects || []),
        ...(profiles.competitions || [])
    ]

    // 마우스 휠로 가로 스크롤
    useEffect(() => {
        const container = scrollRef.current
        if (!container) return

        const handleWheel = (e) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault()
                container.scrollLeft += e.deltaY > 0 ? 100 : -100
            }
        }

        container.addEventListener('wheel', handleWheel, { passive: false })
        return () => container.removeEventListener('wheel', handleWheel)
    }, [])

    return (
        <div style={{ position: 'relative' }}>
            {/* 스크롤 컨테이너 */}
            <div
                ref={scrollRef}
                style={{
                    display: 'flex',
                    gap: '24px',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    padding: '20px 10px 30px 10px',
                    scrollBehavior: 'smooth',
                    scrollbarWidth: 'none', // Firefox
                    msOverflowStyle: 'none', // IE
                }}
                className="hide-scrollbar"
            >
                {allProjects.map((project, i) => (
                    <ProjectCard
                        key={i}
                        project={project}
                        index={i}
                        onClick={onNodeClick}
                        colors={CARD_COLORS[i % CARD_COLORS.length]}
                    />
                ))}
            </div>

            {/* 좌우 그래디언트 페이드 */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '60px',
                height: '100%',
                background: 'linear-gradient(to right, rgba(232,238,245,1) 0%, rgba(232,238,245,0) 100%)',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60px',
                height: '100%',
                background: 'linear-gradient(to left, rgba(232,238,245,1) 0%, rgba(232,238,245,0) 100%)',
                pointerEvents: 'none',
            }} />

            {/* 하단 안내 */}
            <p style={{
                textAlign: 'center',
                fontSize: '0.85rem',
                color: 'rgba(0,0,0,0.4)',
                marginTop: '8px',
                fontFamily: '"Segoe UI", -apple-system, sans-serif',
            }}>
                ← Scroll to explore more →
            </p>

            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    )
}

export default ProjectCarousel
