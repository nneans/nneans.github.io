import { useState } from 'react'
import { Github, X, Download, Play } from 'lucide-react'
import MinoWorkflow from './MinoWorkflow'
import minoLogo from '../assets/mino-logo.png'
import minoDashboard from '../assets/mino-dashboard.png'
import kbForForeigner from '../assets/kb-for-foreigner.png'

function Projects() {
    const [selectedProject, setSelectedProject] = useState(null)

    const projects = [
        // 1. KB AI Challenge
        {
            type: 'Competition',
            title: '뽀뽀 For Foreigner',
            subtitle: 'KB AI Challenge - 외국인 대상 음성인식 금융 챗봇',
            shortDesc: '다국어 음성인식 기반 RAG 금융 상담 챗봇 시스템',
            fullDesc: `외국인 고객을 위한 다국어 금융 상담 챗봇 시스템입니다.

🎯 핵심 기능:
• 음성 입력 → Whisper ASR로 텍스트 변환
• mBART 번역기로 다국어 → 한국어 변환
• RAG 구조를 통한 금융 문서 기반 답변 생성
• 답변을 다시 사용자 언어로 번역하여 출력

🛠️ 기술 구현:
• PDF·OCR 기반 금융 자료 수집 및 전처리
• Qdrant 벡터 DB 구축
• BM25 + Dense Hybrid 검색
• Cross-Encoder 재랭킹
• RAGAS 평가 지표 적용
• Gradio UI 통합 테스트 환경

💡 핵심 가치:
다국어 지원 · 금융 전문성 · 사용자 접근성 강화`,
            tech: ['Whisper', 'mBART', 'RAG', 'Qdrant', 'Cross-Encoder', 'Gradio'],
            image: kbForForeigner,
            pptFile: '/kb-ai-challenge.pptx',
            period: '2025.06 ~ 2025.08',
        },

        // 2. 동서발전 풍력 발전량 예측 (예심 + 본선)
        {
            type: 'Competition',
            title: '동서발전 풍력 발전량 예측',
            subtitle: '풍력 발전량 예측 공모전 본선 진출',
            shortDesc: '시계열 데이터 기반 풍력 발전량 예측 모델 개발',
            fullDesc: `동서발전 풍력 발전량 예측 공모전 프로젝트입니다.

예선 통과 후 본선까지 진출하였습니다.

(상세 내용을 여기에 추가해주세요)`,
            tech: ['Python', 'Time Series', 'LSTM', 'Prediction'],
            emoji: '🌬️',
            period: '2025.07 ~ 2025.10',
        },

        // 3. 비짓부산패스 Plus+
        {
            type: 'Competition',
            title: '비짓부산패스 Plus+',
            subtitle: '대학생 창업 아이디어 경진대회',
            shortDesc: '부산 관광 데이터를 분석하여 관광객 경험 개선 제안',
            fullDesc: `대학생 창업 아이디어 경진대회에서 비짓부산패스 Plus+ 서비스를 제안한 프로젝트입니다.

(상세 내용을 여기에 추가해주세요)`,
            tech: ['Python', 'Data Analysis', 'Visualization', 'Service Design'],
            emoji: '🏖️',
            period: '2025.09 ~ 2025.10',
        },

        // 4. 한식 레시피 정량 분석
        {
            type: 'Research',
            title: '한식 레시피 AI',
            subtitle: 'AI 기반 맛 모듈 구조화 기획',
            shortDesc: '한식 레시피를 정량 분석하고 AI로 맛을 예측하는 연구',
            fullDesc: `한식 레시피 정량 분석 및 AI 기반 맛 모듈 구조화 기획 프로젝트입니다.

(상세 내용을 여기에 추가해주세요)`,
            tech: ['Python', 'NLP', 'Data Analysis', 'Recommendation'],
            github: 'https://github.com/nneans/korean-recipe-ai',
            emoji: '🍳',
            period: '2025.09 ~ 2025.12',
        },

        // 5. 지산학 산업 데이터 공모전 - 영업압박도지수
        {
            type: 'Competition',
            title: '부산 영업압박도지수',
            subtitle: '지산학 산업 데이터 공모전',
            shortDesc: '부산광역시 시군구별 영업압박도지수 개발',
            fullDesc: `지산학 산업 데이터 공모전에서 부산광역시 시군구별 영업압박도지수를 개발한 프로젝트입니다.

(상세 내용을 여기에 추가해주세요)`,
            tech: ['Python', 'Data Analysis', 'Visualization', 'Index Development'],
            emoji: '📊',
            period: '2025.11 ~ 2025.11',
        },

        // 6. LG전자 프로세스 마이닝
        {
            type: 'Research',
            title: 'LG전자 프로세스 마이닝',
            subtitle: 'BAE LAB 연구 프로젝트',
            shortDesc: '고객 사용 패턴 기반 개인화 서비스 연구',
            fullDesc: `LG전자 프로세스 마이닝을 활용한 고객 사용 패턴 기반 개인화 연구 프로젝트입니다.

BAE LAB에서 진행 중인 연구입니다.

(상세 내용을 여기에 추가해주세요)`,
            tech: ['Python', 'Process Mining', 'PM4Py', 'Personalization'],
            emoji: '📱',
            period: '2025.11 ~ 진행중',
        },

        // 7. Mino
        {
            type: 'Personal Project',
            title: 'Mino',
            subtitle: 'AI Personal Finance Assistant',
            shortDesc: 'Gmail 결제 알림을 AI가 자동 분석하는 지능형 가계부',
            fullDesc: `Gmail 결제 알림을 자동으로 수집하여 AI가 소비 내역을 분석하고 분류하는 지능형 가계부입니다.

🎯 주요 기능:
• Gmail 결제 알림 자동 수집 및 파싱
• LLM 기반 소비 내역 자동 분류 (Gemini, GPT, Claude, Ollama 지원)
• Kakao Map 연동 소비 동선 지도 시각화
• 월별 예산 관리 및 통계 대시보드
• AI 채팅 기반 재무 상담

🛠️ 기술적 특징:
• Electron + React로 크로스플랫폼 데스크톱 앱 구현
• Flask 백엔드로 안정적인 API 서버
• SQLite로 로컬 데이터 저장 (개인정보 보호)
• 다양한 LLM 지원 (OpenAI, Anthropic, Google, Ollama 등)`,
            tech: ['React', 'Electron', 'Flask', 'LLM', 'Kakao Map', 'SQLite'],
            github: 'https://github.com/nneans/mino-v4',
            appDownload: '/Mino-1.0.0-arm64.dmg',
            demoUrl: 'https://mino-frontend.vercel.app',
            emoji: '💰',
            image: minoDashboard,
            period: '2025.12 ~ 진행중',
            hasDemo: true,
        },

        // 8. DB손해보험
        {
            type: 'Competition',
            title: 'DB손해보험',
            subtitle: 'DB 금융 공모전',
            shortDesc: 'DB손해보험 데이터 분석 프로젝트',
            fullDesc: `DB손해보험 데이터 분석 공모전 프로젝트입니다.

현재 진행 중입니다.

(상세 내용을 여기에 추가해주세요)`,
            tech: ['Python', 'Data Analysis', 'Machine Learning'],
            emoji: '🛡️',
            period: '진행중',
        },
    ]

    const openModal = (project) => {
        setSelectedProject(project)
        document.body.style.overflow = 'hidden'
    }

    const closeModal = () => {
        setSelectedProject(null)
        document.body.style.overflow = 'auto'
    }

    return (
        <section id="projects" className="section">
            <div className="container">
                <h2 className="section-title">🚀 Projects</h2>

                <div className="projects-grid">
                    {projects.map((project) => (
                        <article
                            key={project.title}
                            className="project-card"
                            onClick={() => openModal(project)}
                        >
                            <div className="project-image-wrapper">
                                {project.image ? (
                                    <img src={project.image} alt={project.title} className="project-image" />
                                ) : (
                                    <span className="project-emoji">{project.emoji}</span>
                                )}
                            </div>
                            <div className="project-details">
                                <span className="project-label">{project.type}</span>
                                <h3 className="project-title">{project.title}</h3>
                                <p className="project-description">{project.shortDesc}</p>
                                <div className="project-tech">
                                    {project.tech.slice(0, 3).map((t) => (
                                        <span key={t} className="tech-tag">{t}</span>
                                    ))}
                                    {project.tech.length > 3 && (
                                        <span className="tech-tag">+{project.tech.length - 3}</span>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {selectedProject && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content sketch-border" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>
                            <X size={24} />
                        </button>

                        <div className="modal-header">
                            {selectedProject.image ? (
                                <img src={selectedProject.image} alt={selectedProject.title} className="modal-image" />
                            ) : (
                                <span className="modal-emoji">{selectedProject.emoji}</span>
                            )}
                            <div>
                                <span className="project-label">{selectedProject.type}</span>
                                <h2 className="modal-title">{selectedProject.title}</h2>
                                {selectedProject.subtitle && (
                                    <p className="modal-subtitle">{selectedProject.subtitle}</p>
                                )}
                                {selectedProject.period && (
                                    <p className="modal-period">{selectedProject.period}</p>
                                )}
                            </div>
                        </div>

                        <div className="modal-body">
                            <p className="modal-description">{selectedProject.fullDesc}</p>

                            <div className="modal-tech">
                                <h4>기술 스택</h4>
                                <div className="project-tech">
                                    {selectedProject.tech.map((t) => (
                                        <span key={t} className="tech-tag">{t}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="modal-links">
                                {selectedProject.github && (
                                    <a
                                        href={selectedProject.github}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="btn btn-outline"
                                    >
                                        <Github size={18} style={{ marginRight: '8px' }} /> GitHub
                                    </a>
                                )}
                                {selectedProject.pptFile && (
                                    <a
                                        href={selectedProject.pptFile}
                                        download
                                        className="btn btn-primary"
                                    >
                                        <Download size={18} style={{ marginRight: '8px' }} /> PPT 다운로드
                                    </a>
                                )}
                                {selectedProject.appDownload && (
                                    <a
                                        href={selectedProject.appDownload}
                                        download
                                        className="btn btn-primary"
                                    >
                                        <Download size={18} style={{ marginRight: '8px' }} /> 앱 다운로드 (macOS)
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Interactive Demo (Popup) */}
                        {selectedProject.demoUrl && (
                            <div className="demo-section">
                                <h4 className="demo-title">
                                    <Play size={20} style={{ marginRight: '8px' }} />
                                    Live Demo
                                </h4>
                                <div className="demo-launcher">
                                    <div className="demo-preview" onClick={() => window.open(selectedProject.demoUrl, 'MinoDemo', 'width=1280,height=800')}>
                                        <img src={selectedProject.image} alt="Demo Preview" />
                                        <div className="play-overlay">
                                            <Play size={48} fill="white" color="white" />
                                            <span>데모 실행하기</span>
                                        </div>
                                    </div>
                                    <p className="demo-notice">
                                        💡 <strong>데모 실행하기</strong>를 클릭하면 별도의 팝업창에서 앱이 실행됩니다.<br />
                                        (PC 환경에서 1280px 이상의 해상도를 권장합니다)
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Mino Workflow */}
                        {selectedProject.title === 'Mino' && <MinoWorkflow />}
                    </div>
                </div>
            )}
        </section>
    )
}

export default Projects

