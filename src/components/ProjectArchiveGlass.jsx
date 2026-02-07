import React, { useMemo, useState, useCallback } from 'react'

const CATEGORIES = [
    { key: 'all', label: 'All' },
    { key: 'research', label: 'Research' },
    { key: 'competition', label: 'Competitions' },
]

const ProjectArchiveGlass = ({ profiles, onNodeClick, selectedProject }) => {
    const [activeFilter, setActiveFilter] = useState('all')
    const [hoveredIndex, setHoveredIndex] = useState(null)

    // 모든 프로젝트 + 타입 태깅
    const allProjects = useMemo(() => {
        const research = (profiles.researchExperience || []).map(p => ({ ...p, category: 'research' }))
        const competitions = (profiles.competitions || []).map(p => ({ ...p, category: 'competition' }))
        return [...research, ...competitions]
    }, [profiles])

    // 필터링된 프로젝트
    const filteredProjects = useMemo(() => {
        if (activeFilter === 'all') return allProjects
        return allProjects.filter(p => p.category === activeFilter)
    }, [allProjects, activeFilter])

    const handleCardClick = useCallback((project) => {
        onNodeClick?.(project)
    }, [onNodeClick])

    const getCategoryLabel = (category) => {
        return category === 'research' ? 'Research' : 'Competition'
    }

    const getCategoryColor = (category) => {
        return category === 'research'
            ? { bg: 'rgba(59, 130, 246, 0.15)', text: '#2563eb', border: 'rgba(59, 130, 246, 0.3)' }
            : { bg: 'rgba(168, 85, 247, 0.15)', text: '#7c3aed', border: 'rgba(168, 85, 247, 0.3)' }
    }

    return (
        <div style={{
            fontFamily: '"Segoe UI", -apple-system, sans-serif',
            position: 'relative',
        }}>
            {/* 배경 그라데이션 */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, #f0f4ff 0%, #fdf4ff 50%, #f0fdfa 100%)',
                borderRadius: '16px',
                zIndex: 0,
            }} />

            <div style={{
                position: 'relative',
                zIndex: 1,
                padding: '24px',
            }}>
                {/* 필터 버튼 */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '24px',
                    flexWrap: 'wrap',
                }}>
                    {CATEGORIES.map(cat => {
                        const isActive = activeFilter === cat.key
                        return (
                            <button
                                key={cat.key}
                                onClick={() => setActiveFilter(cat.key)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    border: 'none',
                                    fontSize: '0.85rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    background: isActive
                                        ? 'rgba(0, 0, 0, 0.8)'
                                        : 'rgba(255, 255, 255, 0.6)',
                                    color: isActive ? '#fff' : '#64748b',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                }}
                            >
                                {cat.label}
                                {cat.key !== 'all' && (
                                    <span style={{
                                        marginLeft: '6px',
                                        fontSize: '0.75rem',
                                        opacity: 0.7,
                                    }}>
                                        {allProjects.filter(p => p.category === cat.key).length}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* 카드 그리드 */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '16px',
                }}>
                    {filteredProjects.map((project, i) => {
                        const isHovered = hoveredIndex === i
                        const catColor = getCategoryColor(project.category)

                        return (
                            <div
                                key={i}
                                onClick={() => handleCardClick(project)}
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                style={{
                                    background: isHovered
                                        ? 'rgba(255, 255, 255, 0.85)'
                                        : 'rgba(255, 255, 255, 0.5)',
                                    backdropFilter: 'blur(20px)',
                                    WebkitBackdropFilter: 'blur(20px)',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                                    boxShadow: isHovered
                                        ? '0 20px 40px rgba(0, 0, 0, 0.1)'
                                        : '0 4px 16px rgba(0, 0, 0, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.6)',
                                }}
                            >
                                {/* 상단: 카테고리 + 기간 */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '12px',
                                }}>
                                    <span style={{
                                        fontSize: '0.7rem',
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        padding: '4px 10px',
                                        borderRadius: '12px',
                                        background: catColor.bg,
                                        color: catColor.text,
                                        border: `1px solid ${catColor.border}`,
                                    }}>
                                        {getCategoryLabel(project.category)}
                                    </span>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        color: '#94a3b8',
                                    }}>
                                        {project.period?.match(/\d{4}/)?.[0] || ''}
                                    </span>
                                </div>

                                {/* 제목 */}
                                <h3 style={{
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    color: '#1e293b',
                                    margin: '0 0 8px 0',
                                    lineHeight: '1.4',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                }}>
                                    {project.title}
                                </h3>

                                {/* 부제목/소속 */}
                                {(project.subtitle || project.affiliation) && (
                                    <p style={{
                                        fontSize: '0.85rem',
                                        color: '#64748b',
                                        margin: '0 0 12px 0',
                                        lineHeight: '1.4',
                                    }}>
                                        {project.subtitle || project.affiliation}
                                    </p>
                                )}

                                {/* 기술 스택 (최대 3개) */}
                                {project.tech && project.tech.length > 0 && (
                                    <div style={{
                                        display: 'flex',
                                        gap: '6px',
                                        flexWrap: 'wrap',
                                        marginTop: 'auto',
                                    }}>
                                        {project.tech.slice(0, 3).map((t, j) => (
                                            <span
                                                key={j}
                                                style={{
                                                    fontSize: '0.7rem',
                                                    padding: '3px 8px',
                                                    borderRadius: '6px',
                                                    background: 'rgba(0, 0, 0, 0.05)',
                                                    color: '#64748b',
                                                }}
                                            >
                                                {t}
                                            </span>
                                        ))}
                                        {project.tech.length > 3 && (
                                            <span style={{
                                                fontSize: '0.7rem',
                                                padding: '3px 8px',
                                                color: '#94a3b8',
                                            }}>
                                                +{project.tech.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* 호버 시 화살표 */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '16px',
                                    right: '16px',
                                    opacity: isHovered ? 1 : 0,
                                    transform: isHovered ? 'translateX(0)' : 'translateX(-8px)',
                                    transition: 'all 0.2s ease',
                                    fontSize: '1.2rem',
                                    color: '#94a3b8',
                                }}>
                                    →
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* 빈 상태 */}
                {filteredProjects.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        color: '#94a3b8',
                    }}>
                        <p style={{ fontSize: '1rem', margin: 0 }}>
                            No projects in this category
                        </p>
                    </div>
                )}

                {/* 하단 안내 */}
                <p style={{
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    color: '#94a3b8',
                    marginTop: '24px',
                    marginBottom: 0,
                }}>
                    Click a card to view details
                </p>
            </div>
        </div>
    )
}

export default ProjectArchiveGlass
