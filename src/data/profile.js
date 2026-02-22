
export const profile = {
    name: "MinGyun Kang",
    nameKo: "강민균",
    role: "M.S. Student",
    tagline: "Interested in Process Mining & Time Series Analysis",
    bioLine1: "Undergraduate Student at BAE LAB (2025.08 - )",
    bioLine2: "Integrated B.S.-M.S. program at BAE LAB (2026.03 - )",
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
            graphLabel: "LG전자 프로세스 마이닝",
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
            title: "K-Recipe2Vec",
            graphLabel: "K-Recipe2Vec",
            subtitle: "임베딩 모델 기반 한식 대체 식재료 추천 시스템",
            affiliation: "(주)웨이브앤바이브",
            period: "2025.10 ~ 2025.12",
            description: "Word2Vec과 Doc2Vec을 활용하여 한식 레시피 데이터를 학습하고, 사용자가 가진 재료와 요리의 문맥을 고려하여 최적의 대체 식재료를 추천하는 시스템입니다. (주)웨이브앤바이브의 RMR 솔루션을 위해 개발되었으며, 기존 레시피 데이터베이스를 활용하여 대체 레시피를 자동으로 도출하는 것을 목표로 했습니다.",
            tech: ["NLP", "Word2Vec", "Doc2Vec"],
            slides: { folder: "/slides/k-recipe2vec/", count: 32 },
            download: { name: "PPT Download", url: "/ppt/k-recipe2vec.pdf" },
            materials: [],
            links: [
                { name: "GitHub", url: "https://github.com/nneans/k-recipe2vec" },
                { name: "Homepage", url: "https://nneans.github.io/k-recipe2vec/" }
            ]
        }
    ],

    // 3. Personal Projects (개인 프로젝트 - Mino 등)
    personalProjects: [
        {
            title: "Mino",
            graphLabel: "Mino",
            subtitle: "개인 자산/소비 관리 애플리케이션",
            affiliation: "Personal",
            period: "2025.11 ~ 2026.02",
            description: "금융 결제 내역을 자동으로 수집하고, 소비 장소를 지도에 시각화하여 개인의 소비 패턴을 한눈에 파악할 수 있는 스마트 가계부입니다.",
            tech: ["React Native", "SQLite"],
            images: ["/projects/mino.png"],
            materials: [],
            links: [
                { name: "GitHub", url: "https://github.com/nneans/Mino" },
                { name: "Homepage", url: "https://nneans.github.io/Mino/" }
            ]
        },
        {
            title: "OurLog",
            graphLabel: "OurLog",
            subtitle: "함께 기록하는 키치한 감성의 여행 공유 플랫폼",
            affiliation: "Personal",
            period: "2026.02 ~ 2026.02",
            description: "가족, 친구와 함께 여행 기록을 실시간으로 공유하고 사진과 지도를 남길 수 있는 웹 애플리케이션입니다. RLS 정책을 이용한 보안과 Supabase RPC를 이용한 트랜잭션 등 데이터베이스 통신 기술을 익히고, Framer Motion을 활용해 매력적인 키치 스타일의 UI/UX를 구현했습니다.",
            tech: ["React", "Vite", "Supabase", "Tailwind CSS", "Framer Motion"],
            images: [],
            materials: [],
            links: [
                { name: "GitHub", url: "https://github.com/nneans/OurLog" }
            ]
        }
    ],

    // 4. Honors & Awards (공모전)
    competitions: [
        {
            title: "KB AI Challenge",
            graphLabel: "KB AI Challenge",
            subtitle: "외국인 고객을 위한 음성인식 챗봇",
            affiliation: "KB국민은행",
            period: "2025.06 ~ 2025.08",
            hideInList: true,
            description: "OpenAI Whisper와 Meta NLLB 모델을 활용하여 다국어 음성 인식 및 번역 기능을 갖춘 외국인 전용 챗봇 서비스입니다. KB국민은행의 대출 상품 및 FAQ 데이터를 MuPDF와 Tesseract OCR로 전처리하고, Ko-SBERT 기반의 RAG 시스템을 구축하였습니다.",
            tech: ["Whisper", "NLLB", "RAG", "Ko-SBERT", "Qdrant", "OCR"],
            slides: { folder: "/slides/kb-ai/", count: 19 },
            download: { name: "PPT Download", url: "/ppt/kb-ai.pdf" },
            materials: [],
            links: [
                { name: "GitHub", url: "https://github.com/nneans/KB_AI_Challenge" },
                { name: "Homepage", url: "https://nneans-kb-ai-challenge.hf.space" }
            ]
        },
        {
            title: "공공데이터 기반 무자녀 가구 맞춤형 가족지원 정책 제안",
            graphLabel: "가족정책 아이디어",
            subtitle: "제1회 공공데이터 활용 가족정책 아이디어 공모전",
            affiliation: "한국건강가정진흥원",
            role: "장려상",
            period: "2024.11",
            description: "저출산 심화에 따른 무자녀 신혼부부의 급증과 가족센터 이용률 저하 현상을 KOSIS 및 가족서비스 통계 데이터로 분석한 후 , 이를 바탕으로 유자녀 중심 정책의 사각지대를 해소하기 위한 심리·체험형 가족 지원 정책을 기획하였습니다.",
            tech: ["Public Data Analysis", "Data Visualization"],
            materials: [
                "KOSIS 신혼부부 통계 및 가족서비스 통계데이터를 활용한 다차원 분석 수행",
                "지역별 무자녀/유자녀 신혼부부 EDA를 통한 정책 사각지대 및 필요성 도출"
            ]
        },
        {
            title: "부산광역시 영업압박도지수 개발",
            graphLabel: "지산학 산업 데이터",
            subtitle: "부산대학교 지산학 산업 데이터 공모전",
            affiliation: "부산대학교 산업수학센터",
            role: "우수상",
            period: "2025.11",
            description: "부산시 내 폐업리스크에 대해 선제적으로 대응할 수 있도록 공시지가, 카드 매출액, 유동인구 등의 부산시 데이터를 수집한 후 이를 바탕으로 릿지 회귀를 통해 영업압박도지수를 개발하였습니다.",
            tech: ["Public Data Analysis", "Data Visualization"],
            slides: { folder: "/slides/jisanhak/", count: 30 },
            download: { name: "PPT Download", url: "/ppt/jisanhak.pdf" },
            materials: [
                "지역별 상권 경쟁 강도를 수치화한 '영업압박도' 지수 산출 모델 개발",
                "공공데이터 기반 부산시 주요 상권 밀집도 및 폐업률, 공시지가 분석"
            ]
        },
        {
            title: "풍력 발전량 예측 공모전",
            graphLabel: "풍력 발전량 예측",
            subtitle: "B.D.A x 동서발전 x 60Hz 데이터 공모전",
            affiliation: "B.D.A x 동서발전 x 60Hz",
            role: "장려상",
            period: "2025.12",
            description: "풍속의 비선형성, 난류 강도, 공기 밀도 등 물리적 특성을 반영한 파생 변수와 시차 변수를 생성해 데이터 패턴을 구체화한 후, LightGBM과 XGBoost 기반의 '시간대별 동적 가중 앙상블' 전략을 통해 시간대 및 발전량 구간별로 모델을 최적화하여 예측 정확도를 높였습니다.",
            tech: ["Time Series", "Machine Learning", "Feature Engineering"],
            slides: { folder: "/slides/wind-power/", count: 21 },
            download: { name: "PPT Download", url: "/ppt/wind-power.pdf" },
            materials: [
                "시계열 데이터 분석을 통한 풍력 발전량의 변동성 및 패턴 예측",
                "공기 밀도, 유효 풍속 등 물리 기반 파생변수 생성을 통한 예측 정확도 향상",
                "XGBoost, LightGBM 모델을 활용한 전력 발전량 최적화 알고리즘 구현"
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
