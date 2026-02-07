import React, { useState, useMemo } from 'react'

// 프로젝트 카테고리별 색상
const CATEGORY_STYLES = {
    research: { fill: '#dbeafe', stroke: '#3b82f6', accent: '🔬' },
    personal: { fill: '#dcfce7', stroke: '#22c55e', accent: '💡' },
    competition: { fill: '#fef3c7', stroke: '#f59e0b', accent: '🏆' },
}

const ProjectRoadmap = ({ profiles, onNodeClick }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null)

    // 카테고리별로 프로젝트 분류
    const allProjects = useMemo(() => {
        const research = (profiles.researchExperience || []).map(p => ({ ...p, category: 'research' }))
        const personal = (profiles.personalProjects || []).map(p => ({ ...p, category: 'personal' }))
        const competition = (profiles.competitions || []).map(p => ({ ...p, category: 'competition' }))
        return [...research, ...personal, ...competition]
    }, [profiles])

    const total = allProjects.length
    const svgWidth = 750
    const svgHeight = 300

    // 노드 위치 계산
    const getNodePos = (index) => {
        const spacing = (svgWidth - 120) / (total - 1 || 1)
        const x = 60 + index * spacing
        const y = 150 + Math.sin(index * 0.7) * 55
        return { x, y }
    }

    // 연결선 경로
    const generatePath = () => {
        if (total === 0) return ''
        let path = ''
        for (let i = 0; i < total; i++) {
            const { x, y } = getNodePos(i)
            if (i === 0) {
                path = `M ${x} ${y}`
            } else {
                const prev = getNodePos(i - 1)
                const cpX = (prev.x + x) / 2
                path += ` C ${cpX} ${prev.y}, ${cpX} ${y}, ${x} ${y}`
            }
        }
        return path
    }

    return (
        <div style={{
            fontFamily: "'Segoe UI', -apple-system, sans-serif",
            position: 'relative',
        }}>
            {/* 외곽 박스 */}
            <div style={{
                border: '2px dashed rgba(100, 116, 139, 0.4)',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(241,245,249,0.5) 100%)',
                padding: '20px 15px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* 배경 장식 */}
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '20px',
                    fontSize: '2rem',
                    opacity: 0.15,
                }}>
                    ✦ ✧ ✦
                </div>
                <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '20px',
                    fontSize: '1.5rem',
                    opacity: 0.15,
                }}>
                    ~ ~ ~
                </div>

                <svg
                    width="100%"
                    height={svgHeight}
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    preserveAspectRatio="xMidYMid meet"
                    style={{ display: 'block', overflow: 'visible' }}
                >
                    <defs>
                        {/* 스케치 필터 */}
                        <filter id="sketchy" x="-5%" y="-5%" width="110%" height="110%">
                            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="noise" />
                            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" xChannelSelector="R" yChannelSelector="G" />
                        </filter>

                        {/* 노드 그림자 */}
                        <filter id="nodeShadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.15" />
                        </filter>
                    </defs>

                    {/* 배경 연결선 (그림자) */}
                    <path
                        d={generatePath()}
                        fill="none"
                        stroke="rgba(100,116,139,0.15)"
                        strokeWidth="8"
                        strokeLinecap="round"
                    />

                    {/* 메인 연결선 - 애니메이션 점선 */}
                    <path
                        d={generatePath()}
                        fill="none"
                        stroke="#64748b"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray="8 6"
                        style={{
                            filter: 'url(#sketchy)',
                            animation: 'dashMove 15s linear infinite',
                        }}
                    />

                    {/* 프로젝트 노드들 */}
                    {allProjects.map((project, i) => {
                        const { x, y } = getNodePos(i)
                        const isHovered = hoveredIndex === i
                        const style = CATEGORY_STYLES[project.category] || CATEGORY_STYLES.personal

                        return (
                            <g
                                key={i}
                                style={{ cursor: 'pointer' }}
                                onClick={() => onNodeClick?.(project)}
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                {/* 호버 시 글로우 */}
                                {isHovered && (
                                    <circle
                                        cx={x}
                                        cy={y}
                                        r="22"
                                        fill={style.stroke}
                                        opacity="0.15"
                                    />
                                )}

                                {/* 메인 노드 */}
                                <circle
                                    cx={x}
                                    cy={y}
                                    r={isHovered ? 15 : 12}
                                    fill={style.fill}
                                    stroke={style.stroke}
                                    strokeWidth="2.5"
                                    style={{
                                        filter: 'url(#nodeShadow)',
                                        transition: 'all 0.25s ease',
                                    }}
                                />

                                {/* 노드 위 카테고리 아이콘 */}
                                <text
                                    x={x}
                                    y={y - 22}
                                    textAnchor="middle"
                                    fontSize="12"
                                    style={{ opacity: isHovered ? 1 : 0.6 }}
                                >
                                    {style.accent}
                                </text>

                                {/* 노드 번호 */}
                                <text
                                    x={x}
                                    y={y + 4}
                                    textAnchor="middle"
                                    fill={style.stroke}
                                    fontSize="11"
                                    fontWeight="700"
                                    fontFamily="'Segoe UI', -apple-system, sans-serif"
                                >
                                    {i + 1}
                                </text>

                                {/* 호버 시 정보 박스 */}
                                {isHovered && (
                                    <g>
                                        <rect
                                            x={x - 115}
                                            y={y + 28}
                                            width="230"
                                            height="55"
                                            rx="8"
                                            fill="rgba(255,255,255,0.97)"
                                            stroke={style.stroke}
                                            strokeWidth="1.5"
                                        />
                                        <text
                                            x={x}
                                            y={y + 50}
                                            textAnchor="middle"
                                            fill="#374151"
                                            fontSize="14"
                                            fontWeight="600"
                                            fontFamily="'Segoe UI', -apple-system, sans-serif"
                                        >
                                            {project.title.length > 24
                                                ? project.title.slice(0, 24) + '...'
                                                : project.title}
                                        </text>
                                        <text
                                            x={x}
                                            y={y + 70}
                                            textAnchor="middle"
                                            fill="#9ca3af"
                                            fontSize="11"
                                            fontFamily="'Segoe UI', -apple-system, sans-serif"
                                        >
                                            {project.period} · Click to explore
                                        </text>
                                    </g>
                                )}
                            </g>
                        )
                    })}
                </svg>

                {/* 범례 */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '24px',
                    marginTop: '12px',
                    fontSize: '1.1rem',
                    color: '#64748b',
                }}>
                    <span>🔬 Research</span>
                    <span>💡 Personal</span>
                    <span>🏆 Competition</span>
                </div>
            </div>

            <style>{`
                @keyframes dashMove {
                    0% { stroke-dashoffset: 0; }
                    100% { stroke-dashoffset: -100; }
                }
            `}</style>
        </div>
    )
}

export default ProjectRoadmap
