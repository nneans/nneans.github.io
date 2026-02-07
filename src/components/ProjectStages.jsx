import React, { useState } from 'react'

// 스테이지 색상 (레벨별로 다름)
const STAGE_COLORS = [
    { bg: '#6366f1', glow: 'rgba(99,102,241,0.4)' },   // 인디고
    { bg: '#8b5cf6', glow: 'rgba(139,92,246,0.4)' },   // 바이올렛
    { bg: '#ec4899', glow: 'rgba(236,72,153,0.4)' },   // 핑크
    { bg: '#f59e0b', glow: 'rgba(245,158,11,0.4)' },   // 앰버
    { bg: '#10b981', glow: 'rgba(16,185,129,0.4)' },   // 에메랄드
    { bg: '#3b82f6', glow: 'rgba(59,130,246,0.4)' },   // 블루
    { bg: '#ef4444', glow: 'rgba(239,68,68,0.4)' },    // 레드
]

const StageNode = ({ project, index, total, onClick, isHovered, onHover }) => {
    const colors = STAGE_COLORS[index % STAGE_COLORS.length]
    const stageNum = index + 1

    // 지그재그 배치 계산
    const row = Math.floor(index / 3)
    const col = index % 3
    const isEvenRow = row % 2 === 0
    const adjustedCol = isEvenRow ? col : (2 - col)

    const xPos = 80 + adjustedCol * 180
    const yPos = 60 + row * 120

    return (
        <g
            style={{ cursor: 'pointer' }}
            onClick={() => onClick?.(project)}
            onMouseEnter={() => onHover(index)}
            onMouseLeave={() => onHover(null)}
        >
            {/* 글로우 효과 */}
            <circle
                cx={xPos}
                cy={yPos}
                r={isHovered ? 48 : 40}
                fill={colors.glow}
                style={{
                    transition: 'all 0.3s ease',
                    filter: 'blur(8px)',
                }}
            />

            {/* 메인 원 */}
            <circle
                cx={xPos}
                cy={yPos}
                r={isHovered ? 38 : 32}
                fill={colors.bg}
                stroke="#fff"
                strokeWidth="3"
                style={{
                    transition: 'all 0.3s ease',
                    filter: isHovered ? 'brightness(1.1)' : 'none',
                }}
            />

            {/* 스테이지 번호 */}
            <text
                x={xPos}
                y={yPos + 6}
                textAnchor="middle"
                fill="#fff"
                fontSize={isHovered ? "20" : "16"}
                fontWeight="700"
                fontFamily="'Segoe UI', -apple-system, sans-serif"
                style={{ transition: 'font-size 0.3s ease' }}
            >
                {stageNum}
            </text>

            {/* 호버 시 제목 표시 */}
            {isHovered && (
                <g>
                    <rect
                        x={xPos - 100}
                        y={yPos + 50}
                        width="200"
                        height="auto"
                        rx="8"
                        fill="rgba(0,0,0,0.85)"
                    />
                    <text
                        x={xPos}
                        y={yPos + 68}
                        textAnchor="middle"
                        fill="#fff"
                        fontSize="11"
                        fontWeight="600"
                        fontFamily="'Segoe UI', -apple-system, sans-serif"
                    >
                        {project.title.length > 25
                            ? project.title.slice(0, 25) + '...'
                            : project.title}
                    </text>
                </g>
            )}
        </g>
    )
}

// 스테이지 연결 경로 생성
const StagePath = ({ total }) => {
    let pathD = ''

    for (let i = 0; i < total; i++) {
        const row = Math.floor(i / 3)
        const col = i % 3
        const isEvenRow = row % 2 === 0
        const adjustedCol = isEvenRow ? col : (2 - col)

        const x = 80 + adjustedCol * 180
        const y = 60 + row * 120

        if (i === 0) {
            pathD += `M ${x} ${y}`
        } else {
            const prevRow = Math.floor((i - 1) / 3)
            const prevCol = (i - 1) % 3
            const isPrevEvenRow = prevRow % 2 === 0
            const prevAdjustedCol = isPrevEvenRow ? prevCol : (2 - prevCol)

            const prevX = 80 + prevAdjustedCol * 180
            const prevY = 60 + prevRow * 120

            // 곡선으로 연결
            const midX = (prevX + x) / 2
            const midY = (prevY + y) / 2
            pathD += ` Q ${midX} ${prevY} ${x} ${y}`
        }
    }

    return (
        <path
            d={pathD}
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="8 8"
        />
    )
}

const ProjectStages = ({ profiles, onNodeClick }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null)

    const allProjects = [
        ...(profiles.researchExperience || []),
        ...(profiles.personalProjects || []),
        ...(profiles.competitions || [])
    ]

    const total = allProjects.length
    const rows = Math.ceil(total / 3)
    const svgHeight = rows * 120 + 80

    return (
        <div style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            position: 'relative',
        }}>
            {/* 배경 별 효과 */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.03) 0%, transparent 50%)',
                pointerEvents: 'none',
            }} />

            <svg
                width="100%"
                height={svgHeight}
                viewBox={`0 0 600 ${svgHeight}`}
                style={{ display: 'block', position: 'relative', zIndex: 1 }}
            >
                {/* 연결 경로 */}
                <StagePath total={total} />

                {/* 스테이지 노드들 */}
                {allProjects.map((project, i) => (
                    <StageNode
                        key={i}
                        project={project}
                        index={i}
                        total={total}
                        onClick={onNodeClick}
                        isHovered={hoveredIndex === i}
                        onHover={setHoveredIndex}
                    />
                ))}
            </svg>

            {/* 하단 안내 */}
            <p style={{
                textAlign: 'center',
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.85rem',
                marginTop: '12px',
                fontFamily: '"Segoe UI", -apple-system, sans-serif',
                position: 'relative',
                zIndex: 1,
            }}>
                🎮 Click a stage to view project details
            </p>
        </div>
    )
}

export default ProjectStages
