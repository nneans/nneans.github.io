import React, { useState, useMemo } from 'react'

const ProjectTimeline = ({ profiles, onNodeClick }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null)

    // 연구 프로젝트 위주로 정리 (연도별 정렬)
    const allProjects = useMemo(() => {
        const research = (profiles.researchExperience || []).map(p => ({ ...p, type: 'Research' }))
        const competitions = (profiles.competitions || []).map(p => ({ ...p, type: 'Project' }))
        return [...research, ...competitions]
    }, [profiles])

    // 연도 추출 함수
    const getYear = (period) => {
        if (!period) return ''
        const match = period.match(/\d{4}/)
        return match ? match[0] : ''
    }

    return (
        <div style={{
            fontFamily: "'Segoe UI', -apple-system, sans-serif",
            position: 'relative',
            padding: '10px 0',
        }}>
            {/* 타임라인 컨테이너 */}
            <div style={{
                position: 'relative',
                paddingLeft: '40px',
            }}>
                {/* 세로 라인 */}
                <div style={{
                    position: 'absolute',
                    left: '12px',
                    top: '0',
                    bottom: '0',
                    width: '2px',
                    background: 'linear-gradient(to bottom, #cbd5e1 0%, #94a3b8 50%, #cbd5e1 100%)',
                }} />

                {/* 프로젝트 아이템들 */}
                {allProjects.map((project, i) => {
                    const isHovered = hoveredIndex === i
                    const year = getYear(project.period)

                    return (
                        <div
                            key={i}
                            onClick={() => onNodeClick?.(project)}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            style={{
                                position: 'relative',
                                marginBottom: '24px',
                                cursor: 'pointer',
                            }}
                        >
                            {/* 타임라인 노드 (원) */}
                            <div style={{
                                position: 'absolute',
                                left: '-34px',
                                top: '4px',
                                width: isHovered ? '16px' : '12px',
                                height: isHovered ? '16px' : '12px',
                                borderRadius: '50%',
                                background: isHovered ? '#475569' : '#fff',
                                border: `2px solid ${isHovered ? '#475569' : '#94a3b8'}`,
                                transition: 'all 0.2s ease',
                            }} />

                            {/* 연도 라벨 */}
                            <div style={{
                                position: 'absolute',
                                left: '-80px',
                                top: '2px',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                color: '#64748b',
                                width: '40px',
                                textAlign: 'right',
                            }}>
                                {year}
                            </div>

                            {/* 프로젝트 내용 */}
                            <div style={{
                                background: isHovered ? 'rgba(255,255,255,0.9)' : 'transparent',
                                borderRadius: '8px',
                                padding: isHovered ? '12px 16px' : '4px 0',
                                marginLeft: '8px',
                                transition: 'all 0.2s ease',
                                borderLeft: isHovered ? '3px solid #475569' : '3px solid transparent',
                            }}>
                                {/* 타입 라벨 */}
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: '#94a3b8',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                }}>
                                    {project.type}
                                </span>

                                {/* 제목 */}
                                <h3 style={{
                                    fontSize: '1.35rem',
                                    fontWeight: '600',
                                    color: '#1e293b',
                                    margin: '4px 0 6px 0',
                                    lineHeight: '1.3',
                                }}>
                                    {project.title}
                                </h3>

                                {/* 부제목/기관 */}
                                {project.affiliation && (
                                    <p style={{
                                        fontSize: '1.1rem',
                                        color: '#64748b',
                                        margin: '0 0 4px 0',
                                    }}>
                                        {project.affiliation}
                                    </p>
                                )}

                                {/* 기간 */}
                                <p style={{
                                    fontSize: '0.95rem',
                                    color: '#94a3b8',
                                    margin: '0',
                                }}>
                                    {project.period}
                                </p>

                                {/* 호버 시 힌트 */}
                                {isHovered && (
                                    <p style={{
                                        fontSize: '0.85rem',
                                        color: '#475569',
                                        marginTop: '8px',
                                        fontStyle: 'italic',
                                    }}>
                                        Click for details →
                                    </p>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ProjectTimeline
