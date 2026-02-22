import { useState, useMemo, useCallback, useRef, useEffect } from 'react'

// 8가지 파스텔 색상 팔레트
const PASTEL_COLORS = [
    '#FFD4E5', // 핑크
    '#D4E5FF', // 블루
    '#D4FFEA', // 민트
    '#FFECD4', // 피치
    '#E5D4FF', // 라벤더
    '#FFFFD4', // 레몬
    '#FFE5D4', // 코랄
    '#D4FFF5', // 아쿠아
]

// 카테고리별 기본 색상 인덱스
const CATEGORY_COLOR_INDEX = {
    research: 4,      // 라벤더
    personal: 1,      // 블루
    industry: 0,      // 핑크
    competition: 2,   // 민트
}

const ProjectArchiveEnhanced = ({ profiles, onNodeClick }) => {
    const [selectedNode, setSelectedNode] = useState(null)
    const [hoveredNode, setHoveredNode] = useState(null)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const containerRef = useRef(null)
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

    // 모든 프로젝트 수집
    const allProjects = useMemo(() => {
        const research = (profiles.researchExperience || []).map(p => ({ ...p, category: 'research' }))
        const personal = (profiles.personalProjects || []).map(p => ({ ...p, category: 'personal' }))
        const industry = (profiles.industryProjects || []).map(p => ({ ...p, category: 'industry' }))
        const competitions = (profiles.competitions || []).map(p => ({ ...p, category: 'competition' }))
        return [...research, ...personal, ...industry, ...competitions]
    }, [profiles])

    // 노드 위치 계산
    const nodes = useMemo(() => {
        const count = allProjects.length
        const centerX = dimensions.width / 2
        const centerY = dimensions.height / 2
        const baseRadius = Math.min(dimensions.width, dimensions.height) * 0.32

        return allProjects.map((project, i) => {
            const angle = (i / count) * Math.PI * 2 - Math.PI / 2
            const radiusOffset = Math.sin(i * 1.5) * 30
            const radius = baseRadius + radiusOffset

            const colorIndex = (CATEGORY_COLOR_INDEX[project.category] + i) % PASTEL_COLORS.length

            return {
                id: i,
                project,
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                color: PASTEL_COLORS[colorIndex],
                angle,
            }
        })
    }, [allProjects, dimensions])

    // 컨테이너 크기 감지
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect()
                setDimensions({ width: rect.width, height: rect.height })
            }
        }
        updateDimensions()
        window.addEventListener('resize', updateDimensions)
        return () => window.removeEventListener('resize', updateDimensions)
    }, [])

    // 마우스 이동 추적
    const handleMouseMove = useCallback((e) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect()
            setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            })
        }
    }, [])

    // 노드 클릭 핸들러
    const handleNodeClick = useCallback((node) => {
        setSelectedNode(node)
        onNodeClick?.(node.project)
    }, [onNodeClick])

    // 패널 닫기
    const handleClosePanel = useCallback(() => {
        setSelectedNode(null)
    }, [])

    // 선택된 프로젝트의 인덱스
    const selectedIndex = selectedNode ? nodes.findIndex(n => n.id === selectedNode.id) + 1 : 0

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            style={{
                position: 'relative',
                width: '100%',
                height: '500px',
                borderRadius: '20px',
                overflow: 'hidden',
                background: 'linear-gradient(145deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
                boxShadow: 'inset 0 2px 20px rgba(0,0,0,0.03)',
            }}
        >
            {/* 도트 패턴 배경 */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                opacity: 0.4,
                pointerEvents: 'none',
            }} />

            {/* 좌측 통계 */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.9)',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                backdropFilter: 'blur(8px)',
                zIndex: 10,
            }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px' }}>
                    Total Projects
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>
                    {allProjects.length}
                </div>
            </div>

            {/* SVG 노드 영역 */}
            <svg
                width={dimensions.width}
                height={dimensions.height}
                style={{ position: 'absolute', top: 0, left: 0 }}
            >
                <defs>
                    {/* 각 노드별 그래디언트 */}
                    {nodes.map(node => (
                        <radialGradient key={`grad-${node.id}`} id={`gradient-${node.id}`}>
                            <stop offset="0%" stopColor={node.color} stopOpacity="1" />
                            <stop offset="100%" stopColor={node.color} stopOpacity="0.7" />
                        </radialGradient>
                    ))}
                    {/* 그림자 필터 */}
                    <filter id="nodeShadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.15" />
                    </filter>
                    <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* 선택된 노드와 중심 연결 대시라인 */}
                {selectedNode && (
                    <line
                        x1={dimensions.width / 2}
                        y1={dimensions.height / 2}
                        x2={selectedNode.x}
                        y2={selectedNode.y}
                        stroke={selectedNode.color}
                        strokeWidth="2"
                        strokeDasharray="8,4"
                        opacity="0.6"
                        style={{
                            animation: 'dashMove 1s linear infinite',
                        }}
                    />
                )}

                {/* 중심점 */}
                <circle
                    cx={dimensions.width / 2}
                    cy={dimensions.height / 2}
                    r={6}
                    fill="#94a3b8"
                    opacity="0.5"
                />

                {/* 노드들 */}
                {nodes.map(node => {
                    const isSelected = selectedNode?.id === node.id
                    const isHovered = hoveredNode?.id === node.id

                    // 마우스 근접 효과
                    const dx = mousePos.x - node.x
                    const dy = mousePos.y - node.y
                    const distance = Math.sqrt(dx * dx + dy * dy)
                    const proximityScale = Math.max(0, 1 - distance / 150) * 0.15

                    const baseRadius = 20
                    const radius = isSelected ? 28 : isHovered ? 26 : baseRadius + proximityScale * 10

                    return (
                        <g
                            key={node.id}
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleNodeClick(node)}
                            onMouseEnter={() => setHoveredNode(node)}
                            onMouseLeave={() => setHoveredNode(null)}
                        >
                            {/* 선택 시 확장 링 */}
                            {isSelected && (
                                <>
                                    <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r={radius + 15}
                                        fill="none"
                                        stroke={node.color}
                                        strokeWidth="2"
                                        opacity="0.3"
                                        style={{
                                            animation: 'pulseRing 2s ease-out infinite',
                                        }}
                                    />
                                    <circle
                                        cx={node.x}
                                        cy={node.y}
                                        r={radius + 8}
                                        fill="none"
                                        stroke={node.color}
                                        strokeWidth="3"
                                        opacity="0.5"
                                    />
                                </>
                            )}

                            {/* 호버 시 글로우 */}
                            {isHovered && !isSelected && (
                                <circle
                                    cx={node.x}
                                    cy={node.y}
                                    r={radius + 6}
                                    fill={node.color}
                                    opacity="0.3"
                                    filter="url(#glowFilter)"
                                />
                            )}

                            {/* 메인 노드 */}
                            <circle
                                cx={node.x}
                                cy={node.y}
                                r={radius}
                                fill={`url(#gradient-${node.id})`}
                                filter="url(#nodeShadow)"
                                style={{
                                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                    transformOrigin: `${node.x}px ${node.y}px`,
                                }}
                            />

                            {/* 호버 라벨 */}
                            {isHovered && !isSelected && (
                                <g>
                                    <rect
                                        x={node.x - 80}
                                        y={node.y - radius - 35}
                                        width="160"
                                        height="24"
                                        rx="12"
                                        fill="rgba(30, 41, 59, 0.9)"
                                    />
                                    <text
                                        x={node.x}
                                        y={node.y - radius - 19}
                                        textAnchor="middle"
                                        fill="white"
                                        fontSize="11"
                                        fontWeight="500"
                                        style={{ pointerEvents: 'none' }}
                                    >
                                        {node.project.title?.slice(0, 20)}{node.project.title?.length > 20 ? '...' : ''}
                                    </text>
                                </g>
                            )}
                        </g>
                    )
                })}
            </svg>

            {/* 우측 사이드 패널 */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '420px',
                    maxWidth: '90%',
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.97)',
                    boxShadow: '-4px 0 30px rgba(0,0,0,0.08)',
                    backdropFilter: 'blur(12px)',
                    transform: selectedNode ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    borderLeft: selectedNode ? `4px solid ${selectedNode.color}` : '4px solid transparent',
                    overflowY: 'auto',
                    zIndex: 20,
                }}
            >
                {selectedNode && (
                    <div style={{ padding: '24px' }}>
                        {/* 닫기 버튼 */}
                        <button
                            onClick={handleClosePanel}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                width: '32px',
                                height: '32px',
                                border: 'none',
                                background: '#f1f5f9',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                fontSize: '18px',
                                color: '#64748b',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.1)'
                                e.target.style.background = '#e2e8f0'
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)'
                                e.target.style.background = '#f1f5f9'
                            }}
                        >
                            ✕
                        </button>

                        {/* 진행도 */}
                        <div style={{
                            fontSize: '0.75rem',
                            color: '#94a3b8',
                            marginBottom: '8px',
                        }}>
                            Project {selectedIndex} of {allProjects.length}
                        </div>

                        {/* 제목 */}
                        <h2 style={{
                            fontSize: '1.4rem',
                            fontWeight: '700',
                            color: '#1e293b',
                            marginBottom: '16px',
                            lineHeight: 1.3,
                            paddingRight: '40px',
                        }}>
                            {selectedNode.project.title}
                        </h2>

                        {/* 메타 정보 */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            marginBottom: '20px',
                            paddingBottom: '16px',
                            borderBottom: '1px solid #e2e8f0',
                        }}>
                            {selectedNode.project.affiliation && (
                                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                    <span style={{ fontWeight: '600', color: '#475569' }}>Organization:</span> {selectedNode.project.affiliation}
                                </div>
                            )}
                            {selectedNode.project.period && (
                                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                    <span style={{ fontWeight: '600', color: '#475569' }}>Period:</span> {selectedNode.project.period}
                                </div>
                            )}
                        </div>

                        {/* 설명 */}
                        {selectedNode.project.description && (
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: '#94a3b8',
                                    marginBottom: '8px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                }}>
                                    Description
                                </div>
                                <p style={{
                                    fontSize: '0.9rem',
                                    color: '#475569',
                                    lineHeight: 1.6,
                                    whiteSpace: 'pre-wrap',
                                }}>
                                    {selectedNode.project.description}
                                </p>
                            </div>
                        )}

                        {/* 인사이트 */}
                        {selectedNode.project.insights && selectedNode.project.insights.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: '#94a3b8',
                                    marginBottom: '8px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                }}>
                                    Insights
                                </div>
                                <ul style={{
                                    margin: 0,
                                    paddingLeft: '16px',
                                    fontSize: '0.85rem',
                                    color: '#475569',
                                    lineHeight: 1.6,
                                }}>
                                    {selectedNode.project.insights.map((insight, i) => (
                                        <li key={i} style={{ marginBottom: '6px' }}>
                                            {insight}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* 기술 스택 */}
                        {selectedNode.project.tech && selectedNode.project.tech.length > 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: '#94a3b8',
                                    marginBottom: '10px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                }}>
                                    Technologies
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {selectedNode.project.tech.map((t, i) => (
                                        <span
                                            key={i}
                                            style={{
                                                padding: '6px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: '500',
                                                background: selectedNode.color,
                                                color: '#1e293b',
                                            }}
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 링크 & 자료 */}
                        {((selectedNode.project.links && selectedNode.project.links.length > 0) ||
                            (selectedNode.project.materials && selectedNode.project.materials.length > 0)) && (
                                <div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        fontWeight: '600',
                                        color: '#94a3b8',
                                        marginBottom: '10px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                    }}>
                                        Resources
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {selectedNode.project.links?.map((link, i) => (
                                            <a
                                                key={`link-${i}`}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    padding: '8px 14px',
                                                    borderRadius: '8px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '500',
                                                    background: '#1e293b',
                                                    color: 'white',
                                                    textDecoration: 'none',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    transition: 'all 0.2s ease',
                                                }}
                                                onMouseEnter={(e) => e.target.style.background = '#334155'}
                                                onMouseLeave={(e) => e.target.style.background = '#1e293b'}
                                            >
                                                🔗 {link.name}
                                            </a>
                                        ))}
                                        {selectedNode.project.materials?.map((mat, i) => (
                                            <a
                                                key={`mat-${i}`}
                                                href={mat.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    padding: '8px 14px',
                                                    borderRadius: '8px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '500',
                                                    background: '#475569',
                                                    color: 'white',
                                                    textDecoration: 'none',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    transition: 'all 0.2s ease',
                                                }}
                                                onMouseEnter={(e) => e.target.style.background = '#64748b'}
                                                onMouseLeave={(e) => e.target.style.background = '#475569'}
                                            >
                                                📄 {mat.name}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                    </div>
                )}
            </div>

            {/* 하단 안내 */}
            <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '0.75rem',
                color: '#94a3b8',
                pointerEvents: 'none',
            }}>
                Click a node to view project details
            </div>

            {/* CSS 애니메이션 */}
            <style>{`
                @keyframes pulseRing {
                    0% { r: ${28 + 8}; opacity: 0.5; }
                    100% { r: ${28 + 25}; opacity: 0; }
                }
                @keyframes dashMove {
                    0% { stroke-dashoffset: 0; }
                    100% { stroke-dashoffset: 24; }
                }
            `}</style>
        </div>
    )
}

export default ProjectArchiveEnhanced
