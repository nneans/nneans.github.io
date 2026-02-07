import React, { useState, useMemo } from 'react'

const ProjectTable = ({ profiles, onNodeClick }) => {
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
            fontSize: '0.9rem',
            overflowX: 'auto',
        }}>
            {/* 테이블 */}
            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '500px',
            }}>
                <thead>
                    <tr style={{
                        borderBottom: '2px solid #374151',
                        background: '#f9fafb',
                    }}>
                        <th style={{
                            textAlign: 'left',
                            padding: '10px 12px',
                            fontWeight: '600',
                            color: '#374151',
                            width: '100px',
                        }}>
                            Period
                        </th>
                        <th style={{
                            textAlign: 'left',
                            padding: '10px 12px',
                            fontWeight: '600',
                            color: '#374151',
                        }}>
                            Project
                        </th>
                        <th style={{
                            textAlign: 'left',
                            padding: '10px 12px',
                            fontWeight: '600',
                            color: '#374151',
                            width: '180px',
                        }}>
                            Affiliation
                        </th>
                        <th style={{
                            textAlign: 'center',
                            padding: '10px 12px',
                            fontWeight: '600',
                            color: '#374151',
                            width: '80px',
                        }}>
                            Type
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {allProjects.map((project, i) => {
                        const isHovered = hoveredIndex === i

                        return (
                            <tr
                                key={i}
                                onClick={() => onNodeClick?.(project)}
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                style={{
                                    borderBottom: '1px solid #e5e7eb',
                                    background: isHovered ? '#f8fafc' : 'transparent',
                                    cursor: 'pointer',
                                    transition: 'background 0.15s ease',
                                }}
                            >
                                {/* 기간 */}
                                <td style={{
                                    padding: '14px 12px',
                                    color: '#6b7280',
                                    fontSize: '0.85rem',
                                    whiteSpace: 'nowrap',
                                }}>
                                    {project.period}
                                </td>

                                {/* 프로젝트명 */}
                                <td style={{
                                    padding: '14px 12px',
                                }}>
                                    <span style={{
                                        color: isHovered ? '#1d4ed8' : '#1f2937',
                                        fontWeight: '500',
                                        transition: 'color 0.15s ease',
                                    }}>
                                        {project.title}
                                    </span>
                                    {project.subtitle && (
                                        <span style={{
                                            display: 'block',
                                            color: '#9ca3af',
                                            fontSize: '0.8rem',
                                            marginTop: '2px',
                                        }}>
                                            {project.subtitle.length > 60
                                                ? project.subtitle.slice(0, 60) + '...'
                                                : project.subtitle}
                                        </span>
                                    )}
                                </td>

                                {/* 소속 */}
                                <td style={{
                                    padding: '14px 12px',
                                    color: '#6b7280',
                                    fontSize: '0.85rem',
                                }}>
                                    {project.affiliation || '-'}
                                </td>

                                {/* 타입 */}
                                <td style={{
                                    padding: '14px 12px',
                                    textAlign: 'center',
                                }}>
                                    <span style={{
                                        fontSize: '0.7rem',
                                        fontWeight: '600',
                                        color: project.type === 'Research' ? '#1d4ed8' : '#059669',
                                        background: project.type === 'Research' ? '#dbeafe' : '#d1fae5',
                                        padding: '3px 8px',
                                        borderRadius: '4px',
                                        textTransform: 'uppercase',
                                        display: 'inline-block',
                                    }}>
                                        {project.type}
                                    </span>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            {/* 하단 안내 */}
            <p style={{
                marginTop: '12px',
                fontSize: '0.8rem',
                color: '#9ca3af',
                textAlign: 'right',
            }}>
                Click any row for details
            </p>
        </div>
    )
}

export default ProjectTable
