import React, { useMemo } from 'react';

const ProjectTimeline = ({ profiles, onNodeClick }) => {
    // 모든 프로젝트 데이터 병합 및 정렬
    const allProjects = useMemo(() => {
        const list = [
            ...(profiles.researchExperience || []).map(p => ({ ...p, category: 'Research' })),
            ...(profiles.personalProjects || []).map(p => ({ ...p, category: 'Personal' })),
            ...(profiles.competitions || []).map(p => ({ ...p, category: 'Competition' }))
        ];

        // 날짜순 정렬 (최신순) - period 문자열이 "2025.12" 등이므로 단순 문자열 비교로도 대략 맞음
        // 정확히 하려면 파싱 필요하지만, 일단 포맷이 통일되어 있으므로 내림차순 정렬
        return list.sort((a, b) => {
            const dateA = a.period.split('~')[0].trim();
            const dateB = b.period.split('~')[0].trim();
            return dateB.localeCompare(dateA);
        });
    }, [profiles]);

    return (
        <div style={{ padding: '10px 0' }}>
            {allProjects.map((project, index) => (
                <div
                    key={index}
                    onClick={() => onNodeClick && onNodeClick(project)}
                    style={{
                        display: 'flex',
                        gap: '20px',
                        padding: '16px',
                        marginBottom: '12px',
                        background: 'rgba(255, 255, 255, 0.6)',
                        borderRadius: '12px',
                        border: '1px solid rgba(0,0,0,0.05)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        alignItems: 'baseline'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.04)';
                        e.currentTarget.style.background = 'white';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                    }}
                >
                    {/* 기간 (왼쪽) */}
                    <div style={{
                        minWidth: '120px',
                        fontSize: '0.9rem',
                        color: '#718096',
                        fontWeight: '600',
                        textAlign: 'right',
                        fontFeatureSettings: '"tnum"'
                    }}>
                        {project.period}
                    </div>

                    {/* 내용 (오른쪽) */}
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{
                                fontSize: '0.75rem',
                                padding: '2px 8px',
                                borderRadius: '999px',
                                background: getCategoryColor(project.category),
                                color: 'white',
                                fontWeight: 'bold'
                            }}>
                                {project.category}
                            </span>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#2d3748' }}>
                                {project.title}
                            </h3>
                        </div>

                        <p style={{ margin: '4px 0 8px', fontSize: '0.95rem', color: '#4a5568' }}>
                            {project.subtitle || project.description}
                        </p>

                        {project.tech && (
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {project.tech.map(t => (
                                    <span key={t} style={{
                                        fontSize: '0.8rem',
                                        color: '#718096',
                                        background: '#edf2f7',
                                        padding: '2px 8px',
                                        borderRadius: '4px'
                                    }}>
                                        #{t}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

const getCategoryColor = (category) => {
    switch (category) {
        case 'Research': return '#4299E1'; // Blue
        case 'Personal': return '#9F7AEA'; // Purple
        case 'Competition': return '#ECC94B'; // Yellow
        default: return '#A0AEC0';
    }
};

export default ProjectTimeline;
