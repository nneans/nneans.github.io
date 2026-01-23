import minoDashboard from '../assets/mino-dashboard.png'
import kbForForeigner from '../assets/kb-for-foreigner.png'
import pnuEmptyClass from '../assets/pnu-empty-class.png'
// minoLogo check

export const projects = [
    // 0. PNU 빈 강의실
    {
        id: 'pnu-empty-class',
        type: 'Personal Project',
        title: 'PNU 빈 강의실',
        subtitle: '부산대학교 빈 강의실 실시간 조회 서비스',
        shortDesc: '부산대 캠퍼스의 빈 강의실을 실시간으로 조회하고 시간표를 확인하는 웹 서비스',
        fullDesc: `부산대학교 학생들을 위해 개발한 빈 강의실 조회 및 시간표 확인 서비스입니다.
        
🎯 핵심 기능:
• 건물별/강의실별 실시간 빈 강의실 현황 조회
• 직관적인 시각적 시간표 제공 (1시간 단위 블록)
• 건물/강의실 검색 및 즐겨찾기 기능
• 다크 모드 기반의 깔끔한 UI/UX

🛠️ 기술적 특징:
• Python(Pandas)을 이용한 대용량 수강편람 데이터 전처리 파이프라인 구축
• 복잡한 시간표 데이터를 효율적으로 시각화하는 React 컴포넌트 구현
• 반응형 디자인으로 모바일/PC 환경 최적화`,
        tech: ['React', 'Python', 'Pandas', 'Vite'],
        image: pnuEmptyClass,
        period: '2026.01 ~ 진행중',
        bentoSize: 'large', // 2x2 or large 2x1
    },

    // 1. KB AI Challenge
    {
        id: 'kb-ai',
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
        bentoSize: 'medium', // 2x1
    },

    // 2. Mino (Bento Highlight)
    {
        id: 'mino',
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
        bentoSize: 'hero', // Custom large size
    },

    // 3. 동서발전 풍력 발전량 예측 (예심 + 본선)
    {
        id: 'wind-power',
        type: 'Competition',
        title: '동서발전 풍력 발전량 예측',
        subtitle: '풍력 발전량 예측 공모전 본선 진출',
        shortDesc: '시계열 데이터 기반 풍력 발전량 예측 모델 개발',
        fullDesc: `동서발전 풍력 발전량 예측 공모전 프로젝트입니다.

예선 통과 후 본선까지 진출하였습니다.`,
        tech: ['Python', 'Time Series', 'LSTM', 'Prediction'],
        emoji: '🌬️',
        period: '2025.07 ~ 2025.10',
        bentoSize: 'small',
    },

    // 4. 비짓부산패스 Plus+
    {
        id: 'visit-busan',
        type: 'Competition',
        title: '비짓부산패스 Plus+',
        subtitle: '대학생 창업 아이디어 경진대회',
        shortDesc: '부산 관광 데이터를 분석하여 관광객 경험 개선 제안',
        fullDesc: `[프로젝트] 비짓부산패스 Plus+: 전통시장 연계형 관광 활성화 전략

1. 프로젝트 개요
• 주제: 기존 '비짓부산패스'의 한계를 보완하고, 최신 관광 트렌드인 '데일리케이션(Dailycation)'을 반영하여 전통시장과 연계한 새로운 관광 패스 모델 제안
• 팀원: 강민균, 김민재, 김하영

2. 문제 정의 및 현황 분석
• 관광 불균형: 부산 외국인 관광객이 급증(200만 돌파)했으나 해운대·광안리 등 동부산권에 편중됨.
• 콘텐츠 한계: 기존 패스는 입장권 위주라 '현지 문화 체험' 트렌드 반영 부족.
• 데이터 근거: 해운대 시장(131.5% 증가) 대비 타 지역 전통시장의 성장세 미흡 확인.

3. 해결 방안 (실행 전략)
• 전통시장 제휴 확대: 자갈치, 국제시장 등 외국인 방문율 높은 시장을 새로운 거점으로 도입.
• 디지털 편의성 개선: QR 기반 다국어 '먹거리 지도', 알리페이/위챗페이 등 글로벌 결제 도입.
• 게이미피케이션: 모바일 스탬프 투어를 도입하여 체류 시간 증대 및 소비 촉진 유도.

4. 기대 효과
• 지역 경제 활성화: 동부산 집중 수요를 원도심/서부산으로 분산하여 균형 발전 도모.
• 접근성 제고: 결제 장벽 제거로 글로벌 접근성 강화.
• 재방문 유도: 시즌별 축제와 연계하여 지속적인 방문 동기 부여.`,
        tech: ['Python', 'Data', 'Service Design'],
        emoji: '🏖️',
        pptFile: '/visit-busan-pass.pdf',
        period: '2025.09 ~ 2025.10',
        bentoSize: 'medium',
    },

    // 5. 한식 레시피 정량 분석
    {
        id: 'korean-recipe',
        type: 'Research',
        title: '한식 레시피 AI',
        subtitle: 'AI 기반 맛 모듈 구조화 기획',
        shortDesc: '한식 레시피를 정량 분석하고 AI로 맛을 예측하는 연구',
        fullDesc: `한식 레시피 정량 분석 및 AI 기반 맛 모듈 구조화 기획 프로젝트입니다.`,
        tech: ['Python', 'NLP', 'Data Analysis'],
        github: 'https://github.com/nneans/korean-recipe-ai',
        emoji: '🍳',
        period: '2025.09 ~ 2025.12',
        bentoSize: 'small',
    },

    // 6. 지산학 산업 데이터 공모전 - 영업압박도지수
    {
        id: 'busan-index',
        type: 'Competition',
        title: '부산 영업압박도지수',
        subtitle: '지산학 산업 데이터 공모전',
        shortDesc: '부산광역시 시군구별 영업압박도지수 개발',
        fullDesc: `지산학 산업 데이터 공모전에서 부산광역시 시군구별 영업압박도지수를 개발한 프로젝트입니다.`,
        tech: ['Python', 'Data Analysis', 'Index Dev'],
        emoji: '📊',
        period: '2025.11 ~ 2025.11',
        bentoSize: 'small',
    },

    // 7. LG전자 프로세스 마이닝
    {
        id: 'lg-pm',
        type: 'Research',
        title: 'LG전자 프로세스 마이닝',
        subtitle: 'BAE LAB 연구 프로젝트',
        shortDesc: '고객 사용 패턴 기반 개인화 서비스 연구',
        fullDesc: `LG전자 프로세스 마이닝을 활용한 고객 사용 패턴 기반 개인화 연구 프로젝트입니다.
BAE LAB에서 진행 중인 연구입니다.`,
        tech: ['Python', 'Process Mining', 'PM4Py'],
        emoji: '📱',
        period: '2025.11 ~ 진행중',
        bentoSize: 'small',
    },

    // 8. DB손해보험
    {
        id: 'db-ins',
        type: 'Competition',
        title: 'DB손해보험',
        subtitle: 'DB 금융 공모전',
        shortDesc: 'DB손해보험 데이터 분석 프로젝트',
        fullDesc: `DB손해보험 데이터 분석 공모전 프로젝트입니다.
현재 진행 중입니다.`,
        tech: ['Python', 'Data Analysis', 'ML'],
        emoji: '🛡️',
        period: '진행중',
        bentoSize: 'small',
    },
]
