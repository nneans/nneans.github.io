import React, { useEffect } from 'react'

const ProjectModal = ({ project, onClose }) => {
    useEffect(() => {
        if (project) {
            // body에 overflow hidden 추가 (스크롤 방지)
            document.body.style.overflow = 'hidden'
        }

        // 클린업: 모달이 닫힐 때
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [project])

    if (!project) return null

    const handleOverlayClick = (e) => {
        // overlay를 직접 클릭했을 때만 닫기
        if (e.target === e.currentTarget) {
            onClose?.()
        }
    }

    return (
        <div
            className="modal-overlay"
            onClick={handleOverlayClick}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                pointerEvents: 'auto',
                animation: 'fadeIn 0.2s ease-out',
            }}
        >
            <div
                className="modal-content"
                onClick={e => e.stopPropagation()}
                style={{
                    position: 'relative',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    maxWidth: '600px',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    pointerEvents: 'auto',
                    animation: 'slideUp 0.3s ease-out',
                }}
            >
                <button
                    className="modal-close"
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'none',
                        border: 'none',
                        fontSize: '28px',
                        cursor: 'pointer',
                        color: '#999',
                        zIndex: 10000,
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '6px',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f0f0f0'
                        e.currentTarget.style.color = '#333'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = '#999'
                    }}
                >
                    ✕
                </button>

                <div style={{ padding: '32px 32px 24px 32px' }}>
                    {/* 제목 */}
                    <h2 style={{
                        marginTop: 0,
                        marginBottom: '8px',
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        color: '#1f2937',
                        fontFamily: '"Segoe UI", -apple-system, sans-serif',
                    }}>
                        {project.title}
                    </h2>

                    {/* 부제목 */}
                    {project.subtitle && (
                        <p style={{
                            fontSize: '1rem',
                            color: '#6b7280',
                            margin: '0 0 16px 0',
                            fontFamily: '"Segoe UI", -apple-system, sans-serif',
                        }}>
                            {project.subtitle}
                        </p>
                    )}

                    {/* 메타 정보 */}
                    <div style={{
                        fontSize: '0.95rem',
                        color: '#6b7280',
                        marginBottom: '20px',
                        paddingBottom: '16px',
                        borderBottom: '1px solid #e5e7eb',
                        fontFamily: '"Segoe UI", -apple-system, sans-serif',
                    }}>
                        {project.affiliation && (
                            <>
                                <span style={{ fontWeight: '500' }}>{project.affiliation}</span>
                                <span style={{ margin: '0 8px' }}>·</span>
                            </>
                        )}
                        <span>{project.period}</span>
                    </div>

                    {/* 설명 */}
                    {project.description && (
                        <p style={{
                            lineHeight: '1.7',
                            color: '#4b5563',
                            marginBottom: '20px',
                            fontSize: '0.95rem',
                            fontFamily: '"Segoe UI", -apple-system, sans-serif',
                        }}>
                            {project.description}
                        </p>
                    )}

                    {/* 기술 스택 */}
                    {project.tech && project.tech.length > 0 && (
                        <div style={{
                            marginBottom: '20px',
                        }}>
                            <p style={{
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                color: '#6b7280',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                            }}>
                                Technologies
                            </p>
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                flexWrap: 'wrap',
                            }}>
                                {project.tech.map((t, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            backgroundColor: '#f3f4f6',
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            fontSize: '0.85rem',
                                            color: '#4b5563',
                                            border: '1px solid #e5e7eb',
                                        }}
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 링크 및 자료 */}
                    <div style={{
                        display: 'flex',
                        gap: '10px',
                        flexWrap: 'wrap',
                        paddingTop: '16px',
                        borderTop: '1px solid #e5e7eb',
                    }}>
                        {project.materials?.map((m, i) => (
                            <a
                                key={`material-${i}`}
                                href={m.url}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 14px',
                                    backgroundColor: '#f3f4f6',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    textDecoration: 'none',
                                    color: '#4b5563',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontFamily: '"Segoe UI", -apple-system, sans-serif',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#e5e7eb'
                                    e.currentTarget.style.borderColor = '#9ca3af'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#f3f4f6'
                                    e.currentTarget.style.borderColor = '#d1d5db'
                                }}
                            >
                                📄 {m.name}
                            </a>
                        ))}
                        {project.links?.map((l, i) => (
                            <a
                                key={`link-${i}`}
                                href={l.url}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 14px',
                                    backgroundColor: '#dbeafe',
                                    border: '1px solid #93c5fd',
                                    borderRadius: '6px',
                                    textDecoration: 'none',
                                    color: '#1e40af',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontFamily: '"Segoe UI", -apple-system, sans-serif',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#bfdbfe'
                                    e.currentTarget.style.borderColor = '#60a5fa'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#dbeafe'
                                    e.currentTarget.style.borderColor = '#93c5fd'
                                }}
                            >
                                🔗 {l.name}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                
                @keyframes slideUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                
                .modal-content::-webkit-scrollbar {
                    width: 6px;
                }
                
                .modal-content::-webkit-scrollbar-track {
                    background: #f1f5f9;
                }
                
                .modal-content::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 3px;
                }
                
                .modal-content::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div>
    )
}

export default ProjectModal
