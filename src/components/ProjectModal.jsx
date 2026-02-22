import React, { useEffect, useMemo } from 'react'
import { Github, Download } from 'lucide-react'
import SlideCarousel from './SlideCarousel'

const ProjectModal = ({ project, onClose }) => {
    useEffect(() => {
        if (project) {
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [project])

    if (!project) return null

    const handleOverlayClick = (e) => {
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
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                pointerEvents: 'auto',
                animation: 'fadeIn 0.25s ease-out',
            }}
        >
            <div
                className="modal-content"
                onClick={e => e.stopPropagation()}
                style={{
                    position: 'relative',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                    borderRadius: '16px',
                    width: '90%',
                    maxWidth: '940px',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    boxShadow: '0 25px 80px rgba(0, 0, 0, 0.2), 0 10px 30px rgba(0, 0, 0, 0.1)',
                    pointerEvents: 'auto',
                    animation: 'slideUp 0.35s ease-out',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                }}
            >
                {/* 닫기 버튼 */}
                <button
                    className="modal-close"
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'rgba(0, 0, 0, 0.05)',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#64748b',
                        zIndex: 10000,
                        width: '44px',
                        height: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '10px',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
                        e.currentTarget.style.color = '#1e293b'
                        e.currentTarget.style.transform = 'scale(1.05)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'
                        e.currentTarget.style.color = '#64748b'
                        e.currentTarget.style.transform = 'scale(1)'
                    }}
                >
                    ✕
                </button>

                <div style={{ padding: '44px 52px 40px 52px' }}>
                    {/* 메인 제목 (긴 프로젝트명) */}
                    <h2 style={{
                        marginTop: 0,
                        marginBottom: '12px',
                        fontSize: '2.25rem',
                        fontWeight: '700',
                        color: '#111827',
                        fontFamily: "'Nanum Pen Script', cursive",
                        lineHeight: '1.4',
                        letterSpacing: '-0.3px',
                    }}>
                        {project.title}
                    </h2>

                    {/* 메타 정보 (주최측 / 날짜 / 수상) */}
                    <div style={{
                        fontSize: '1.4rem',
                        color: '#94a3b8',
                        marginBottom: '24px',
                        paddingBottom: '20px',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                        fontFamily: "'Nanum Pen Script', cursive",
                        fontWeight: '400',
                        lineHeight: '1.5',
                    }}>
                        {project.affiliation && (
                            <span>{project.affiliation}</span>
                        )}
                        {project.affiliation && project.period && (
                            <span style={{ margin: '0 8px', color: '#cbd5e1' }}>/</span>
                        )}
                        {project.period && (
                            <span>{project.period}</span>
                        )}
                        {project.role && (
                            <>
                                <span style={{ margin: '0 8px', color: '#cbd5e1' }}>/</span>
                                <span>{project.role}</span>
                            </>
                        )}
                        {project.subtitle && (
                            <>
                                <br />
                                <span style={{ color: '#b0b8c4', fontSize: '1.3rem' }}>{project.subtitle}</span>
                                {project.tech && project.tech.length > 0 && (
                                    <span style={{ marginLeft: '12px' }}>
                                        {project.tech.map((t, i) => (
                                            <span
                                                key={i}
                                                style={{
                                                    fontSize: '1.1rem',
                                                    color: '#94a3b8',
                                                    fontFamily: "'Nanum Pen Script', cursive",
                                                    fontWeight: '400',
                                                    marginRight: '8px',
                                                }}
                                            >
                                                #{t}
                                            </span>
                                        ))}
                                    </span>
                                )}
                            </>
                        )}
                    </div>

                    {/* 설명 */}
                    {project.description && (
                        <p style={{
                            lineHeight: '1.8',
                            color: '#475569',
                            marginBottom: '28px',
                            paddingBottom: '28px',
                            borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                            fontSize: '1.25rem',
                            fontFamily: "'Nanum Pen Script', cursive",
                            whiteSpace: 'pre-wrap',
                        }}>
                            {project.description}
                        </p>
                    )}

                    {/* 기술 스택 - 인라인 태그 (박스 없이) */}


                    {/* 발표자료 슬라이드 또는 프로젝트 이미지 캐러셀 */}
                    {project.slides ? (
                        <div style={{
                            marginRight: '0px',
                            marginBottom: '20px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}>
                            <SlideCarousel
                                slides={Array.from({ length: project.slides.count }, (_, i) => `${project.slides.folder}slide-${i + 1}.png`)}
                                title={project.title}
                            />
                        </div>
                    ) : project.images ? (
                        <div style={{
                            marginRight: '0px',
                            marginBottom: '20px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            border: '1px solid rgba(0,0,0,0.05)'
                        }}>
                            <SlideCarousel slides={project.images} title={project.title} />
                        </div>
                    ) : null}

                    {/* 다운로드 링크 */}
                    {project.download && (
                        <div style={{ marginBottom: '16px' }}>
                            <a
                                href={project.download.url}
                                download
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    textDecoration: 'none',
                                    color: '#64748b',
                                    fontSize: '1.1rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'color 0.2s ease',
                                    fontFamily: "'Nanum Pen Script', cursive",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#334155'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#64748b'
                                }}
                            >
                                <Download size={18} /> {project.download.name}
                            </a>
                        </div>
                    )}

                    {/* 링크 (materials 제외, links만 표시) */}
                    {project.links?.length > 0 && (
                        <div style={{
                            display: 'flex',
                            gap: '16px',
                            flexWrap: 'wrap',
                            paddingTop: '20px',
                            borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                        }}>
                            {project.links.map((l, i) => {
                                const isGithub = l.name.toLowerCase().includes('github') || l.name.toLowerCase().includes('homepage') || l.url.includes('github')
                                return (
                                    <a
                                        key={`link-${i}`}
                                        href={l.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            textDecoration: 'none',
                                            color: '#64748b',
                                            fontSize: '1.4rem',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'color 0.2s ease',
                                            fontFamily: "'Nanum Pen Script', cursive",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = '#334155'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = '#64748b'
                                        }}
                                    >
                                        {isGithub ? <Github size={18} /> : '🔗'} {l.name}
                                    </a>
                                )
                            })}
                        </div>
                    )}
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
                        transform: translateY(30px) scale(0.97);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0) scale(1);
                        opacity: 1;
                    }
                }
                
                .modal-content::-webkit-scrollbar {
                    width: 8px;
                }
                
                .modal-content::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 4px;
                }
                
                .modal-content::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                }
                
                .modal-content::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div >
    )
}

export default ProjectModal
