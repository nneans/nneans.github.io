import React, { useState, useMemo } from 'react'

const ProjectCards = ({ profiles, onNodeClick }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null)

    // 연구 프로젝트 위주
    const allProjects = useMemo(() => {
        const research = (profiles.researchExperience || []).map(p => ({ ...p, type: 'Research' }))
        const competitions = (profiles.competitions || []).map(p => ({ ...p, type: 'Project' }))
        return [...research, ...competitions]
    }, [profiles])

    return (
        <div style={{
            fontFamily: "'Segoe UI', -apple-system, sans-serif",
        }}>
            {/* 카드 그리드 */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px',
            }}>
                {allProjects.map((project, i) => {
                    const isHovered = hoveredIndex === i

                    return (
                        <div
                            key={i}
                            onClick={() => onNodeClick?.(project)}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            style={{
                                background: '#fff',
                                borderRadius: '12px',
                                padding: '20px',
                                cursor: 'pointer',
                                border: `1px solid ${isHovered ? '#475569' : '#e2e8f0'}`,
                                boxShadow: isHovered
                                    ? '0 8px 24px rgba(0,0,0,0.12)'
                                    : '0 2px 8px rgba(0,0,0,0.04)',
                                transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                                transition: 'all 0.25s ease',
                            }}
                        >
                            {/* 상단: 타입 + 기간 */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '12px',
                            }}>
                                <span style={{
                                    fontSize: '0.7rem',
                                    fontWeight: '700',
                                    color: '#64748b',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    background: '#f1f5f9',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                }}>
                                    {project.type}
                                </span>
                                <span style={{
                                    fontSize: '0.8rem',
                                    color: '#94a3b8',
                                }}>
                                    {project.period}
                                </span>
                            </div>

                            {/* 제목 */}
                            <h3 style={{
                                fontSize: '1.4rem',
                                fontWeight: '600',
                                color: '#1e293b',
                                margin: '0 0 8px 0',
                                lineHeight: '1.35',
                            }}>
                                {project.title}
                            </h3>

                            {/* 소속/기관 */}
                            {project.affiliation && (
                                <p style={{
                                    fontSize: '1.05rem',
                                    color: '#64748b',
                                    margin: '0 0 12px 0',
                                    lineHeight: '1.4',
                                }}>
                                    {project.affiliation}
                                </p>
                            )}

                            {/* 하단 구분선 + 안내 */}
                            <div style={{
                                borderTop: '1px solid #e2e8f0',
                                paddingTop: '12px',
                                marginTop: 'auto',
                            }}>
                                <span style={{
                                    fontSize: '0.85rem',
                                    color: isHovered ? '#475569' : '#94a3b8',
                                    transition: 'color 0.2s ease',
                                }}>
                                    {isHovered ? 'Click to view details →' : 'View details'}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ProjectCards
