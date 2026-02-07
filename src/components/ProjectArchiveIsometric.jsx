import React, { useMemo, useState, useCallback } from 'react'

// 카테고리별 색상
const CATEGORY_COLORS = {
    research: { primary: '#6366f1', accent: '#4f46e5', glow: 'rgba(99, 102, 241, 0.3)' },
    competition: { primary: '#8b5cf6', accent: '#7c3aed', glow: 'rgba(139, 92, 246, 0.3)' },
}

const ProjectArchiveIsometric = ({ profiles, onNodeClick, selectedProject }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null)
    const [activeFilter, setActiveFilter] = useState('all')

    // 모든 프로젝트 + 타입 태깅
    const allProjects = useMemo(() => {
        const research = (profiles.researchExperience || []).map(p => ({ ...p, category: 'research' }))
        const competitions = (profiles.competitions || []).map(p => ({ ...p, category: 'competition' }))
        return [...research, ...competitions]
    }, [profiles])

    // 필터링
    const filteredProjects = useMemo(() => {
        if (activeFilter === 'all') return allProjects
        return allProjects.filter(p => p.category === activeFilter)
    }, [allProjects, activeFilter])

    // 그리드 배치 계산 (아이소메트릭 그리드)
    const nodes = useMemo(() => {
        const cols = 4
        return filteredProjects.map((project, i) => {
            const row = Math.floor(i / cols)
            const col = i % cols

            // 아이소메트릭 좌표 변환
            const isoX = (col - row) * 90 + 300
            const isoY = (col + row) * 45 + 80

            return {
                project,
                x: isoX,
                y: isoY,
                index: i,
                colors: CATEGORY_COLORS[project.category],
            }
        })
    }, [filteredProjects])

    const handleNodeClick = useCallback((project) => {
        onNodeClick?.(project)
    }, [onNodeClick])

    const svgHeight = Math.max(400, nodes.length > 0 ? Math.max(...nodes.map(n => n.y)) + 120 : 400)

    return (
        <div style={{
            fontFamily: '"Segoe UI", -apple-system, sans-serif',
            position: 'relative',
        }}>
            {/* 필터 버튼 */}
            <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '16px',
            }}>
                {[
                    { key: 'all', label: 'All' },
                    { key: 'research', label: 'Research' },
                    { key: 'competition', label: 'Competitions' },
                ].map(filter => {
                    const isActive = activeFilter === filter.key
                    const count = filter.key === 'all'
                        ? allProjects.length
                        : allProjects.filter(p => p.category === filter.key).length

                    return (
                        <button
                            key={filter.key}
                            onClick={() => setActiveFilter(filter.key)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: 'none',
                                fontSize: '0.85rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                background: isActive ? '#1e293b' : '#f1f5f9',
                                color: isActive ? '#fff' : '#64748b',
                            }}
                        >
                            {filter.label}
                            <span style={{ marginLeft: '6px', opacity: 0.7, fontSize: '0.75rem' }}>
                                {count}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* 아이소메트릭 그래프 */}
            <div style={{
                background: 'linear-gradient(145deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid rgba(148, 163, 184, 0.2)',
            }}>
                <svg
                    width="100%"
                    height={svgHeight}
                    viewBox={`0 0 650 ${svgHeight}`}
                    style={{ display: 'block' }}
                >
                    {/* 그리드 라인 (아이소메트릭) */}
                    <defs>
                        <pattern id="isoGrid" width="90" height="45" patternUnits="userSpaceOnUse">
                            <path
                                d="M 0 22.5 L 45 0 L 90 22.5 L 45 45 Z"
                                fill="none"
                                stroke="#cbd5e1"
                                strokeWidth="0.5"
                                opacity="0.3"
                            />
                        </pattern>

                        {/* 글로우 필터 */}
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* 배경 그리드 */}
                    <rect width="100%" height="100%" fill="url(#isoGrid)" opacity="0.5" />

                    {/* 연결선 */}
                    {nodes.length > 1 && nodes.map((node, i) => {
                        if (i === 0) return null
                        const prevNode = nodes[i - 1]
                        return (
                            <line
                                key={`line-${i}`}
                                x1={prevNode.x}
                                y1={prevNode.y}
                                x2={node.x}
                                y2={node.y}
                                stroke="#cbd5e1"
                                strokeWidth="1.5"
                                strokeDasharray="4,4"
                                opacity="0.4"
                            />
                        )
                    })}

                    {/* 노드들 */}
                    {nodes.map((node, i) => {
                        const isHovered = hoveredIndex === i
                        const { project, x, y, colors } = node

                        return (
                            <g
                                key={i}
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleNodeClick(project)}
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                {/* 그림자 */}
                                <ellipse
                                    cx={x}
                                    cy={y + 25}
                                    rx={isHovered ? 35 : 30}
                                    ry={isHovered ? 12 : 10}
                                    fill="rgba(0,0,0,0.1)"
                                    style={{ transition: 'all 0.3s ease' }}
                                />

                                {/* 3D 큐브 베이스 (아이소메트릭 다이아몬드) */}
                                <path
                                    d={`
                                        M ${x} ${y - 20}
                                        L ${x + 30} ${y}
                                        L ${x} ${y + 20}
                                        L ${x - 30} ${y}
                                        Z
                                    `}
                                    fill={colors.primary}
                                    stroke={colors.accent}
                                    strokeWidth="2"
                                    filter={isHovered ? 'url(#glow)' : 'none'}
                                    style={{
                                        transition: 'all 0.3s ease',
                                        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
                                        transformOrigin: `${x}px ${y}px`,
                                    }}
                                />

                                {/* 상단 하이라이트 */}
                                <path
                                    d={`
                                        M ${x} ${y - 20}
                                        L ${x + 30} ${y}
                                        L ${x} ${y + 5}
                                        L ${x - 30} ${y}
                                        Z
                                    `}
                                    fill="rgba(255,255,255,0.3)"
                                    style={{ pointerEvents: 'none' }}
                                />

                                {/* 번호 */}
                                <text
                                    x={x}
                                    y={y + 5}
                                    textAnchor="middle"
                                    fill="#fff"
                                    fontSize="14"
                                    fontWeight="700"
                                    style={{ pointerEvents: 'none' }}
                                >
                                    {i + 1}
                                </text>

                                {/* 호버 시 정보 표시 */}
                                {isHovered && (
                                    <g style={{ pointerEvents: 'none' }}>
                                        <rect
                                            x={x - 100}
                                            y={y - 75}
                                            width="200"
                                            height="45"
                                            rx="8"
                                            fill="rgba(255,255,255,0.95)"
                                            stroke={colors.accent}
                                            strokeWidth="1"
                                            filter="url(#glow)"
                                        />
                                        <text
                                            x={x}
                                            y={y - 52}
                                            textAnchor="middle"
                                            fill="#1e293b"
                                            fontSize="12"
                                            fontWeight="600"
                                        >
                                            {project.title.length > 28
                                                ? project.title.slice(0, 28) + '...'
                                                : project.title}
                                        </text>
                                        <text
                                            x={x}
                                            y={y - 38}
                                            textAnchor="middle"
                                            fill="#64748b"
                                            fontSize="10"
                                        >
                                            {project.period} · Click to view
                                        </text>
                                    </g>
                                )}
                            </g>
                        )
                    })}

                    {/* 빈 상태 */}
                    {nodes.length === 0 && (
                        <text
                            x="325"
                            y="200"
                            textAnchor="middle"
                            fill="#94a3b8"
                            fontSize="14"
                        >
                            No projects in this category
                        </text>
                    )}
                </svg>
            </div>

            {/* 하단 안내 */}
            <p style={{
                textAlign: 'center',
                fontSize: '0.85rem',
                color: '#94a3b8',
                marginTop: '12px',
                marginBottom: 0,
            }}>
                Hover to preview · Click to view details
            </p>
        </div>
    )
}

export default ProjectArchiveIsometric
