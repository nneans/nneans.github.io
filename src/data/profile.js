
export const profile = {
    name: "MinGyun Kang",
    nameKo: "강민균",
    role: "M.S. Student",
    tagline: "Interested in Time Series Analysis & Process Mining",
    affiliation: "Graduate School of Data Science",
    university: "Pusan National University",
    lab: "BAE LAB",
    labUrl: "https://pnubaelab.github.io/",
    location: "Busan, Korea",
    email: "nneans33@gmail.com",
    github: "https://github.com/nneans",


    // 연락처 및 소셜 링크
    socialLinks: [
        { icon: "📍", label: "Busan, Korea", url: null },
        { icon: "✉️", label: "Email", url: "mailto:nneans33@gmail.com" },
        { icon: "💻", label: "GitHub", url: "https://github.com/nneans" },
    ],

    // Research Interests
    researchInterests: [
        "Process Mining",
        "Time Series Analysis",
    ],

    // News (최신 소식)
    news: [],

    // Education (리스트 형식 복구)
    education: [
        {
            degree: "M.S.",
            field: "Industrial Data Engineering",
            school: "Pusan National University",
            period: "2026.03 ~ ",
            advisor: "Prof. Hyerim Bae",
            advisorUrl: "https://pnubaelab.github.io/",
            details: []
        },
        {
            degree: "B.S.",
            field: "Statistics",
            school: "Pusan National University",
            advisor: null,
            details: []
        }
    ],

    // Affiliation (사용 안 함)
    affiliation: "",




    // 1. Research Experience (연구 과제 - BAE LAB)
    researchExperience: [
        {
            title: "LG전자 프로세스 마이닝",
            subtitle: "고객 사용 패턴 기반 개인화 서비스 연구",
            affiliation: "BAE LAB",
            period: "2026.01 ~ ing",
            description: "LG전자 제품의 사용자 로그 데이터를 분석하여 고객 행동 패턴을 파악하고 개인화 서비스를 제안하는 연구 과제입니다.",
            tech: ["Process Mining", "Data Analysis"],
            materials: [
                // { name: "발표자료.pdf", url: "/files/lg_project.pdf" } 
            ],
            links: []
        }
    ],

    // 2. Industry Projects (산학 협력)
    industryProjects: [
        {
            title: "보험 해지 고객 인터뷰 텍스트 마이닝을 통한 6대 핵심 페르소나 정의 및 이탈 방지 전략 수립",
            subtitle: "삼성생명 산학협력",
            affiliation: "삼성생명",
            period: "2025",
            description: `• 데이터 전처리 및 복구: 엑셀 내 불규칙하게 분산된 인터뷰 텍스트 데이터를 행 병합 로직을 통해 정제하고 분석 가능한 형태로 표준화
• 고객 페르소나 체계화: 10여 개의 세부 해지 사유를 비즈니스 관점에서 6개의 핵심 페르소나(긴급 유동성 확보형, 비용절감 갈아타기형 등)로 재구조화
• 해지 고민 기간 정량 분석: 텍스트 형태의 고민 기간 정보를 수치 데이터(Day 단위)로 변환하여 페르소나별 의사결정 속도 차이 규명
• 텍스트 마이닝 (NLP): KoNLPy(Okt)를 활용한 형태소 분석 및 워드클라우드 시각화로 페르소나별 핵심 키워드 도출`,
            insights: [
                "데이터 기반의 차별화된 타겟팅: '갈아타기형'은 평균 69일간 고민하는 신중한 성향인 반면, '가치투자형'은 즉각적으로 해지하는 특성을 발견하여 각기 다른 골든타임 제안",
                "VOC의 시각화: 막연한 고객의 불만을 키워드 중심의 워드클라우드로 시각화하여, 실무진이 해지 원인을 직관적으로 파악할 수 있도록 지원"
            ],
            tech: ["Python", "KoNLPy", "Text Mining", "NLP", "Data Visualization", "Pandas"],
            materials: [],
            links: []
        }
    ],

    // 3. Personal Projects (개인 프로젝트 - Mino 등)
    personalProjects: [
        {
            title: "Mino",
            subtitle: "개인 자산/소비 관리 애플리케이션",
            affiliation: "Personal",
            period: "2025.11 ~ 2026.01",
            description: "Gmail 파싱을 통해 결제 내역을 자동으로 불러오고, 카카오맵 API를 활용하여 소비 장소를 지도에 시각화해주는 스마트 가계부",
            tech: ["React Native", "TypeScript", "Node.js", "LLM API", "KakaoMap API"],
            materials: [],
            links: []
        },
        {
            title: "K-Recipe2Vec",
            subtitle: "임베딩 모델 기반 한식 대체 식재료 추천 시스템",
            affiliation: "(주)웨이브엔바이브",
            period: "2025.10 ~ 2025.12",
            description: "Doc2Vec과 Word2Vec을 활용하여 한식 레시피 데이터를 학습하고, 사용자가 가진 재료에 맞춰 최적의 대체 재료를 추천",
            tech: ["NLP", "Word2Vec", "Doc2Vec", "Streamlit", "Python"],
            materials: [],
            links: [
                { name: "GitHub", url: "https://github.com/nneans/k-recipe2vec" },
                { name: "Live Demo", url: "https://k-recipe2vec-nneans.streamlit.app" }
            ]
        }
    ],

    // 4. Honors & Awards (공모전)
    competitions: [
        {
            title: "공공데이터 기반 무자녀 가구 맞춤형 가족지원 정책 제안",
            subtitle: "제1회 공공데이터 활용 가족정책 아이디어 공모전",
            affiliation: "한국건강가정진흥원",
            role: "장려상",
            period: "2024.11",
            tech: ["Public Data Analysis", "Data Visualization"],
            materials: [
                "KOSIS 신혼부부 통계 및 가족서비스 통계데이터를 활용한 다차원 분석 수행",
                "지역별 무자녀/유자녀 신혼부부 EDA를 통한 정책 사각지대 및 필요성 도출"
            ]
        },
        {
            title: "부산광역시 영업압박도지수 개발",
            subtitle: "부산대학교 지산학 산업 데이터 공모전",
            affiliation: "부산대학교",
            role: "우수상",
            period: "2025.11",
            tech: ["Public Data Analysis", "Data Visualization"],
            materials: [
                "지역별 상권 경쟁 강도를 수치화한 '영업압박도' 지수 산출 모델 개발",
                "공공데이터 기반 부산시 주요 상권 밀집도 및 폐업률, 공시지가 분석"
            ]
        },
        {
            title: "시계열 기반 풍력 발전량 예측 모델 개발",
            subtitle: "B.D.A x 동서발전 x 60Hz 데이터 공모전",
            affiliation: "B.D.A x 동서발전 x 60Hz",
            role: "장려상",
            period: "2025.12",
            tech: ["Time Series", "Machine Learning", "Feature Engineering"],
            materials: [
                "시계열 데이터 분석을 통한 풍력 발전량의 변동성 및 패턴 예측",
                "공기 밀도, 유효 풍속 등 물리 기반 파생변수 생성을 통한 예측 정확도 향상",
                "XGBoost, LightGBM 모델을 활용한 전력 발전량 최적화 알고리즘 구현"
            ]
        },
        {
            title: "금융 AI 기반 신용평가 모델 개발",
            subtitle: "KB AI Challenge 2024",
            affiliation: "KB국민은행",
            role: null,
            period: "2024.09",
            tech: ["Machine Learning", "Finance AI", "Data Analysis"],
            materials: [
                "금융 데이터 기반 신용평가 예측 모델 구현",
                "다양한 ML 알고리즘을 활용한 신용도 분류 및 리스크 분석"
            ]
        }
    ],

    // Publications (논문) - 나중에 추가
    publications: [
        // {
        //     title: "논문 제목",
        //     authors: "강민균, ...",
        //     venue: "학회/저널명",
        //     year: "2026",
        //     link: "",
        //     codeLink: "",
        //     image: null
        // }
    ],

    // Internships (인턴십)
    internships: [
        {
            period: "2024.06 ~ 2024.12",
            company: "Dongnam Regional Statistics Office",
            location: "Busan, Korea"
        }
    ]
}
