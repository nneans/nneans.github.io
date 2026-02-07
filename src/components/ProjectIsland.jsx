import React, { useState, useMemo } from 'react'

const ProjectIsland = ({ profiles, onNodeClick }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null)

    const allProjects = useMemo(() => [
        ...(profiles.researchExperience || []),
        ...(profiles.personalProjects || []),
        ...(profiles.competitions || [])
    ], [profiles])

    const total = allProjects.length

    // 섬 위에 프로젝트 배치
    const getProjectPos = (index) => {
        const cols = Math.ceil(Math.sqrt(total))
        const row = Math.floor(index / cols)
        const col = index % cols

        const baseX = 180 + col * 100 + (row % 2 === 0 ? 0 : 50)
        const baseY = 150 + row * 65

        const offsetX = Math.sin(index * 1.5) * 15
        const offsetY = Math.cos(index * 2.3) * 10

        return {
            x: baseX + offsetX,
            y: baseY + offsetY
        }
    }

    return (
        <div style={{
            fontFamily: "'Segoe UI', -apple-system, sans-serif",
            position: 'relative',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '2px solid rgba(100, 116, 139, 0.3)',
            background: 'rgba(255, 255, 255, 0.3)',
        }}>
            <svg
                width="100%"
                height="360"
                viewBox="0 0 700 360"
                preserveAspectRatio="xMidYMid meet"
                style={{ display: 'block' }}
            >
                {/* 스케치 필터 */}
                <defs>
                    <filter id="sketchy" x="-5%" y="-5%" width="110%" height="110%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
                    </filter>

                    {/* 부드러운 파도 패턴 */}
                    <pattern id="softWaves" x="0" y="0" width="80" height="15" patternUnits="userSpaceOnUse">
                        <path
                            d="M0 8 Q20 3 40 8 Q60 13 80 8"
                            fill="none"
                            stroke="rgba(148, 163, 184, 0.3)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                    </pattern>
                </defs>

                {/* 바다 - 연한 회청색 */}
                <rect
                    x="0" y="0" width="700" height="360"
                    fill="#e2e8f0"
                />
                <rect x="0" y="0" width="700" height="360" fill="url(#softWaves)" />

                {/* 섬 그림자 */}
                <ellipse
                    cx="355" cy="210" rx="250" ry="95"
                    fill="rgba(148, 163, 184, 0.25)"
                    style={{ filter: 'url(#sketchy)' }}
                />

                {/* 섬 본체 - 크림/베이지 톤 */}
                <ellipse
                    cx="350" cy="200" rx="250" ry="95"
                    fill="#fef9e7"
                    stroke="#94a3b8"
                    strokeWidth="2"
                    strokeDasharray="8 4"
                    style={{ filter: 'url(#sketchy)' }}
                />

                {/* 섬 내부 - 연한 민트 */}
                <ellipse
                    cx="350" cy="195" rx="200" ry="70"
                    fill="#ecfdf5"
                    stroke="#94a3b8"
                    strokeWidth="1"
                    strokeDasharray="4 3"
                    style={{ filter: 'url(#sketchy)' }}
                />

                {/* 나무 장식 */}
                <text
                    x="140" y="175"
                    fontSize="24"
                    fill="#94a3b8"
                    style={{ opacity: 0.6 }}
                >
                    ◆
                </text>
                <text
                    x="530" y="190"
                    fontSize="22"
                    fill="#94a3b8"
                    style={{ opacity: 0.6 }}
                >
                    ✿
                </text>

                {/* 프로젝트 노드들 */}
                {allProjects.map((project, i) => {
                    const { x, y } = getProjectPos(i)
                    const isHovered = hoveredIndex === i

                    return (
                        <g
                            key={i}
                            style={{ cursor: 'pointer' }}
                            onClick={() => onNodeClick?.(project)}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {/* 깃발 기둥 - 회색 */}
                            <line
                                x1={x}
                                y1={y - 6}
                                x2={x}
                                y2={y - 30}
                                stroke="#64748b"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />

                            {/* 깃발 - 부드러운 코랄/살구색 */}
                            <path
                                d={`M ${x} ${y - 30} L ${x + 14} ${y - 24} L ${x} ${y - 17} Z`}
                                fill="#fca5a5"
                                stroke="#94a3b8"
                                strokeWidth="1"
                                style={{
                                    transformOrigin: `${x}px ${y - 30}px`,
                                    animation: `flutter ${0.5 + (i % 3) * 0.15}s ease-in-out infinite alternate`,
                                }}
                            />

                            {/* 프로젝트 동그라미 */}
                            <circle
                                cx={x}
                                cy={y}
                                r={isHovered ? 10 : 7}
                                fill="#fff"
                                stroke="#64748b"
                                strokeWidth="1.5"
                                style={{
                                    filter: 'url(#sketchy)',
                                    transition: 'all 0.2s ease'
                                }}
                            />

                            {/* 호버 시 프로젝트 정보 */}
                            {isHovered && (
                                <g>
                                    <rect
                                        x={x - 105}
                                        y={y + 16}
                                        width="210"
                                        height="50"
                                        rx="6"
                                        fill="rgba(255,255,255,0.95)"
                                        stroke="#94a3b8"
                                        strokeWidth="1.5"
                                        strokeDasharray="4 2"
                                    />
                                    <text
                                        x={x}
                                        y={y + 38}
                                        textAnchor="middle"
                                        fill="#475569"
                                        fontSize="13"
                                        fontWeight="600"
                                        fontFamily="'Segoe UI', -apple-system, sans-serif"
                                    >
                                        {project.title.length > 26
                                            ? project.title.slice(0, 26) + '...'
                                            : project.title}
                                    </text>
                                    <text
                                        x={x}
                                        y={y + 56}
                                        textAnchor="middle"
                                        fill="#94a3b8"
                                        fontSize="11"
                                        fontFamily="'Segoe UI', -apple-system, sans-serif"
                                    >
                                        {project.period} · Click!
                                    </text>
                                </g>
                            )}
                        </g>
                    )
                })}

                {/* 하단 안내 */}
                <text
                    x="350"
                    y="340"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="14"
                    fontFamily="'Segoe UI', -apple-system, sans-serif"
                >
                    각 깃발을 클릭해서 프로젝트를 탐색하세요 ~
                </text>
            </svg>

            <style>{`
                @keyframes flutter {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(5deg); }
                }
            `}</style>
        </div>
    )
}

export default ProjectIsland
