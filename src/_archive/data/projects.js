import minoDashboard from '../assets/mino-dashboard.png'
import kbForForeigner from '../assets/kb-for-foreigner.png'

export const projects = [
    // 1. Mino (2025.12)
    {
        id: 'mino',
        type: 'Personal Project',
        title: 'Mino',
        subtitle: 'AI Personal Finance Assistant',
        shortDesc: 'Gmail 알림 기반 AI 지능형 가계부 & 재무 비서',
        fullDesc: `Gmail 결제 알림을 자동으로 수집하여 AI가 소비 내역을 분석하고 분류하는 지능형 가계부입니다.
단순한 기록을 넘어, 사용자의 소비 패턴을 학습하고 자연어 대화를 통해 맞춤형 재무 조언을 제공합니다.

🎯 주요 기능:
• Gmail 결제 알림 자동 수집 및 파싱 (Gmail API)
• LLM 기반 소비 내역 자동 분류 (Gemini, GPT, Claude, Ollama 지원)
• Kakao Map 연동 소비 동선 지도 시각화
• 월별 예산 관리 및 통계 대시보드
• RAG 기반 AI 재무 상담 채팅

🛠️ 기술적 특징:
• Electron + React로 크로스플랫폼 데스크톱 앱 구현
• Flask 백엔드와 SQLite를 활용한 로컬 중심 데이터 처리 (개인정보 보호)
• 다양한 LLM 모델 스위칭 지원 및 프롬프트 엔지니어링 최적화`,
        tech: ['React', 'Electron', 'Flask', 'LLM', 'SQLite', 'KakaoMap'],
        github: 'https://github.com/nneans/mino-v4',
        appDownload: '/Mino-1.0.0-arm64.dmg',
        demoUrl: 'https://mino-frontend.vercel.app',
        emoji: '💰',
        image: minoDashboard,
        period: '2025.12 ~ 진행중',
        hasDemo: true,
        bentoSize: 'hero',
    },

    // 2. K-Recipe2Vec (2025.12)
    {
        id: 'k-recipe2vec',
        type: 'Research & Dev',
        title: 'K-Recipe2Vec',
        subtitle: 'Data-Driven Ingredient Substitution for Korean Cuisine',
        shortDesc: '(주)웨이브앤바이브 데이터 기반 한식 식재료 대체 AI',
        fullDesc: `약 8만 개의 한식 레시피 데이터를 분석하여 문맥에 맞는 대체 식재료를 추천하는 AI 서비스입니다.
(주)웨이브앤바이브로부터 제공받은 레시피 원문 데이터를 활용하여, 단순 성분 분석이 아닌 조리 맥락을 고려한 추천 알고리즘을 개발했습니다.

🎯 주요 기능:
• Word2Vec & Doc2Vec 기반 식재료/레시피 임베딩 벡터화
• 요리 문맥, 조리법, 카테고리를 고려한 하이브리드 추천 시스템
• 사용자 입맛에 맞춘 가중치 조절 (고급 설정 기능)

💡 성과:
• 기존 단순 매칭 방식 대비 추천 정확도 및 사용자 만족도 향상
• Hugging Face Spaces를 통한 안정적인 API 서비스 구축`,
        tech: ['React', 'FastAPI', 'Word2Vec', 'Doc2Vec', 'HuggingFace'],
        github: 'https://github.com/nneans/k-recipe2vec',
        demoUrl: 'https://nneans.github.io/k-recipe2vec/',
        emoji: '🍳',
        period: '2025.10 ~ 2025.12',
        bentoSize: 'medium',
    },

    // 3. LG전자 프로세스 마이닝 (2025.11~)
    {
        id: 'lg-pm',
        type: 'Research',
        title: 'LG전자 프로세스 마이닝',
        subtitle: 'BAE LAB 산학 협력 프로젝트',
        shortDesc: '고객 로그 데이터 마이닝을 통한 개인화 서비스 제안',
        fullDesc: `LG전자 가전 제품의 로그 데이터를 프로세스 마이닝(Process Mining) 기술로 분석하여 사용자 행동 패턴을 도출하는 연구입니다.
PM4Py 라이브러리를 활용하여 이벤트 로그(Event Log)를 표준화하고, 사용자 유형별 최적화된 개인화 서비스를 제안하는 것을 목표로 합니다.`,
        tech: ['Python', 'Process Mining', 'PM4Py', 'Data Analysis'],
        emoji: '📱',
        period: '2025.11 ~ 진행중',
        bentoSize: 'small',
    },

    // 4. 부산 영업압박도지수 (2025.11)
    {
        id: 'busan-index',
        type: 'Competition',
        title: '부산 영업압박도지수',
        subtitle: '지산학 산업 데이터 공모전',
        shortDesc: '부산광역시 시군구별 소상공인 영업 부담 지표 개발',
        fullDesc: `부산광역시 내 소상공인들의 영업 환경을 정량적으로 평가하기 위해 '영업압박도지수'를 개발하였습니다.
카드 매출 데이터, 유동 인구, 임대료 정보를 결합하여 시군구별 영업 위험도를 시각화하고 정책 제언을 도출했습니다.`,
        tech: ['Python', 'QGIS', 'Data Analysis'],
        emoji: '📊',
        period: '2025.11',
        bentoSize: 'small',
    },

    // 5. 비짓부산패스 Plus+ (2025.10)
    {
        id: 'visit-busan',
        type: 'Competition',
        title: '비짓부산패스 Plus+',
        subtitle: '대학생 창업 아이디어 경진대회',
        shortDesc: '관광 데이터 분석 기반 전통시장 연계 관광 상품 기획',
        fullDesc: `부산 방문 외국인 관광객 데이터를 분석하여, 특정 지역(해운대 등) 쏠림 현상을 해결하기 위한 '전통시장 연계형 패스'를 기획했습니다.
데이터에 기반한 문제 정의와 '게이미피케이션(스탬프 투어)' 솔루션을 통해 원도심 관광 활성화 전략을 제안했습니다.`,
        tech: ['Python', 'Service Design', 'Data Visualization'],
        emoji: '🏖️',
        pptFile: '/visit-busan-pass.pdf',
        period: '2025.09 ~ 2025.10',
        bentoSize: 'medium',
    },

    // 6. 동서발전 풍력 발전량 예측 (2025.10)
    {
        id: 'wind-power',
        type: 'Competition',
        title: '풍력 발전량 예측',
        subtitle: '동서발전 공모전 본선 진출',
        shortDesc: '기상 데이터와 LSTM을 활용한 시계열 발전량 예측',
        fullDesc: `기상청 데이터와 발전소 센서 데이터를 융합하여 풍력 발전량을 예측하는 AI 모델을 개발했습니다.
시계열적 특성을 반영하기 위해 LSTM(Long Short-Term Memory) 모델을 적용하였으며, 결측치 처리 및 피처 엔지니어링을 통해 예측 정확도를 개선하여 본선에 진출했습니다.`,
        tech: ['Python', 'LSTM', 'Time Series', 'PyTorch'],
        emoji: '🌬️',
        period: '2025.07 ~ 2025.10',
        bentoSize: 'small',
    },

    // 7. KB AI Challenge (2025.08)
    {
        id: 'kb-ai',
        type: 'Competition',
        title: '뽀뽀 For Foreigner',
        subtitle: 'KB AI Challenge - 외국인 금융 챗봇',
        shortDesc: '다국어 음성인식(Whisper) + RAG 금융 상담 챗봇',
        fullDesc: `외국인 고객을 위한 다국어 금융 상담 챗봇 시스템입니다.
Whisper AI로 음성을 인식하고, mBART로 번역한 뒤, RAG(Retrieval-Augmented Generation) 기술을 통해 금융 약관 문서를 참조하여 정확한 답변을 생성합니다.`,
        tech: ['Whisper', 'RAG', 'Qdrant', 'Gradio', 'LangChain'],
        image: kbForForeigner,
        pptFile: '/kb-ai-challenge.pptx',
        period: '2025.06 ~ 2025.08',
        bentoSize: 'medium',
    },

    // 8. DB손해보험 (진행중 / 정보 부족으로 하단 배치)
    {
        id: 'db-ins',
        type: 'Competition',
        title: 'DB손해보험 데이터 분석',
        subtitle: 'DB 금융 공모전',
        shortDesc: '보험 데이터 분석 및 인사이트 도출',
        fullDesc: `DB손해보험의 실제 데이터를 활용하여 보험 사기 탐지 혹은 마케팅 인사이트를 발굴하는 프로젝트를 진행 중입니다.`,
        tech: ['Python', 'Data Analysis', 'Scikit-learn'],
        emoji: '🛡️',
        period: '진행중',
        bentoSize: 'small',
    },
]
