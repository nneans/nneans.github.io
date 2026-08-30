export type ProjectPreview =
  | {
      type: "document";
      pdfUrl: string;
      pageBaseUrl: string;
      pageCount: number;
    }
  | {
      type: "video";
      url: string;
      poster?: string;
    };

export interface Project {
  id: string;
  title: string;
  entryTitle?: string;
  description: string;
  authors?: string;
  status?: string;
  period: string;
  completedAt: string;
  stack: string[];
  awardLabel?: string;
  links: { label: string; url: string; download?: string }[];
  preview?: ProjectPreview;
}

const documentPreview = (
  category: string,
  filename: string,
  previewId: string,
  pageCount: number,
): Extract<ProjectPreview, { type: "document" }> => ({
  type: "document",
  pdfUrl: `/assets/work-archive/${category}/${filename}`,
  pageBaseUrl: `/assets/work-archive/previews/${previewId}`,
  pageCount,
});

const documents = {
  windPower: documentPreview("competitions", "2025.12-wind-power-forecasting.pdf", "wind-power", 21),
  kbAi: documentPreview("competitions", "2025.08-kb-ai-challenge.pdf", "kb-ai", 19),
  pressureIndex: documentPreview("competitions", "2025.11-business-pressure-index.pdf", "pressure-index", 30),
  veteransHospital: documentPreview(
    "competitions",
    "2026.08-veterans-hospital-analysis.pdf",
    "veterans-hospital-analysis",
    21,
  ),
  minimumWage: documentPreview(
    "competitions",
    "2026.08-minimum-wage-impact-analysis.pdf",
    "minimum-wage-impact-analysis",
    12,
  ),
  kRecipe2Vec: documentPreview("industry-projects", "2025.12-k-recipe2vec.pdf", "k-recipe2vec", 32),
  aiWorkInstruction: documentPreview(
    "industry-projects",
    "2026.07-ai-work-instruction.pdf",
    "ai-work-instruction",
    18,
  ),
  timeSeriesStudy: documentPreview(
    "presentations",
    "2025.10-time-series-clustering-study.pdf",
    "time-series-clustering-study",
    27,
  ),
  predictiveProcessStudy: documentPreview(
    "presentations",
    "2026.07-predictive-process-monitoring-study.pdf",
    "predictive-process-monitoring-study",
    25,
  ),
  aspaiPachita: documentPreview("presentations", "2026.08-aspai-pachita.pdf", "aspai-pachita", 28),
  pact: documentPreview("publications", "2026.07-pact.pdf", "pact", 8),
} as const;

export const portfolio = {
  name: "Mingyun Kang",
  role: "Industrial Data Engineer / Researcher",
  location: "Busan, Republic of Korea",
  email: "alsrbs3345@pusan.ac.kr",
  emails: ["alsrbs3345@pusan.ac.kr", "alsrbs3345@gmail.com"],
  phone: "+82 10-7564-7880",
  phoneHref: "+821075647880",
  github: "https://github.com/nneans",
  labUrl: "https://pnubaelab.github.io/",
  about:
    "Master's student in Industrial Data Engineering at Pusan National University, advised by Professor Hyerim Bae. My research focuses on process mining.",
  aboutMe: [
    "HI👋👋, I'm Mingyun Kang. I'm a master's student in Industrial Data Engineering at BAE LAB, Pusan National University, advised by Professor Hyerim Bae.",
    "My research focuses on process mining. This space is my digital workspace—documenting research notes, dev projects, travel photos, and other things I enjoy.",
  ],
  interests: ["Process Mining", "Time Series", "Machine Learning", "Public Data", "Data Visualization"],
  education: [
    {
      degree: "M.S. in Industrial Data Engineering",
      school: "Pusan National University · BAE LAB",
      period: "2026.08–Present",
    },
    { degree: "B.S. in Statistics", school: "Pusan National University", period: "2022.03–2026.08" },
  ],
  now: [
    "Studying Industrial Data Engineering at Pusan National University",
    "Exploring process mining and time-series representation learning",
    "Building practical data products from research ideas",
  ],
  projects: [
    {
      id: "wind-power",
      title: "2025 B.D.A x 동서발전 x 60Hz 풍력 발전량 예측 공모전",
      entryTitle: "풍력 발전량 예측",
      description: "A time-aware weighted ensemble using LightGBM and XGBoost with physics-informed and lag features.",
      period: "2025.12",
      completedAt: "2025.12",
      stack: ["Time Series", "XGBoost", "LightGBM", "Feature Engineering"],
      awardLabel: "장려상",
      links: [
        {
          label: "Slides (PDF)",
          url: documents.windPower.pdfUrl,
        },
      ],
      preview: documents.windPower,
    },
    {
      id: "k-recipe2vec",
      title: "한식 레시피 정량 분석 및 AI 기반 맛 모듈 구조화 기획 프로젝트",
      description: "A Korean ingredient-substitution system that learns recipe context with Word2Vec and Doc2Vec.",
      period: "2025.10–12",
      completedAt: "2025.12",
      stack: ["NLP", "Word2Vec", "Doc2Vec"],
      links: [
        { label: "GitHub", url: "https://github.com/nneans/k-recipe2vec" },
        {
          label: "Slides (PDF)",
          url: documents.kRecipe2Vec.pdfUrl,
        },
      ],
      preview: documents.kRecipe2Vec,
    },
    {
      id: "ai-work-instruction",
      title: "AI 동작분석 기반 현장 표준작업지도서 구축",
      description:
        "An industry project that analyzes work and waiting segments and postural strain from shop-floor videos, delivering a digital work-instruction system in Korean, English, and Nepali.",
      period: "2026.07",
      completedAt: "2026.07",
      stack: ["Pose Estimation", "YOLO11n", "ONNX", "Multilingual UI"],
      links: [
        {
          label: "Report (PDF)",
          url: documents.aiWorkInstruction.pdfUrl,
        },
      ],
      preview: documents.aiWorkInstruction,
    },
    {
      id: "mino",
      title: "Mino",
      description: "A smart asset-management platform that maps transaction records to spatial patterns and spending behavior.",
      period: "2025.11–2026.02",
      completedAt: "2026.02",
      stack: ["React Native", "SQLite", "Spatial Data"],
      links: [
        { label: "GitHub", url: "https://github.com/nneans/Mino" },
        { label: "Homepage", url: "https://nneans.github.io/Mino/" },
      ],
    },
    {
      id: "kb-ai",
      title: "KB AI Challenge",
      entryTitle: "뽀뽀 For Foreigner: 외국인 고객을 위한 음성인식 기반 챗봇",
      description: "A multilingual voice chatbot using Whisper, NLLB, OCR, Ko-SBERT, and retrieval-augmented generation.",
      period: "2025.06–08",
      completedAt: "2025.08",
      stack: ["Whisper", "NLLB", "RAG", "Ko-SBERT", "Qdrant"],
      links: [
        { label: "GitHub", url: "https://github.com/nneans/KB_AI_Challenge" },
        {
          label: "Slides (PDF)",
          url: documents.kbAi.pdfUrl,
        },
      ],
      preview: documents.kbAi,
    },
    {
      id: "pressure-index",
      title: "2025년 지·산·학 연계 산업 수학 데이터 탐구 경진대회",
      entryTitle: "부산광역시 구별 영업압박도 지수 모형 개발",
      description: "A district-level early warning index for closure risk based on land price, card sales, and foot-traffic data.",
      period: "2025.11",
      completedAt: "2025.11",
      stack: ["Public Data", "Ridge Regression", "Visualization"],
      awardLabel: "우수상",
      links: [
        {
          label: "Slides (PDF)",
          url: documents.pressureIndex.pdfUrl,
        },
      ],
      preview: documents.pressureIndex,
    },
    {
      id: "family-policy",
      title: "제1회 공공데이터 활용 가족정책 아이디어 공모전",
      entryTitle: "공공데이터 기반 무자녀 가구 맞춤형 가족지원 정책 제안",
      description: "A public-data analysis and policy proposal addressing support gaps for child-free newlywed households.",
      period: "2024.11",
      completedAt: "2024.11",
      stack: ["Public Data", "Policy Analysis", "Visualization"],
      awardLabel: "장려상",
      links: [],
    },
    {
      id: "time-series-clustering-study",
      title: "Time-Series Clustering Study",
      description: "A research study presentation comparing TMRC and DEETO approaches for deep time-series clustering.",
      period: "2025.10",
      completedAt: "2025.10",
      stack: ["Time Series", "Deep Clustering", "Representation Learning"],
      links: [
        {
          label: "Slides (PDF)",
          url: documents.timeSeriesStudy.pdfUrl,
        },
      ],
      preview: documents.timeSeriesStudy,
    },
    {
      id: "predictive-process-monitoring-study",
      title: "Data-Aware LSTM for Predictive Process Monitoring",
      description: "A research study presentation on complete remaining-trace and runtime prediction with a data-aware LSTM.",
      period: "2026.07",
      completedAt: "2026.07",
      stack: ["Process Mining", "Predictive Process Monitoring", "LSTM"],
      links: [
        {
          label: "Slides (PDF)",
          url: documents.predictiveProcessStudy.pdfUrl,
        },
      ],
      preview: documents.predictiveProcessStudy,
    },
    {
      id: "aspai-pachita",
      title: "PaCHITA: A Patched Channel-Independent Transformer for Business Process Anomaly Detection",
      description:
        "PaCHITA detects business process anomalies using overlapping patches and channel-independent Transformer encoding, identifying anomalous traces and responsible attributes without requiring clean logs or prior process knowledge.",
      authors: "Yongjae Lee, Mingyun Kang, Hyerim Bae*",
      status:
        "Presented at the 2nd Asia-Pacific Symposium on Process and Artificial Intelligence (ASPAI 2026) · Best Paper Runner-up Award",
      period: "2026.08",
      completedAt: "2026.08",
      stack: ["Process Mining", "Anomaly Detection", "Transformer", "Patch-Based Learning"],
      links: [
        {
          label: "Slides (PDF)",
          url: documents.aspaiPachita.pdfUrl,
        },
      ],
      preview: documents.aspaiPachita,
    },
    {
      id: "pact",
      title: "PaCT: Patch-Based Multi-Channel Transformer for Predictive Process Monitoring",
      description:
        "PaCT is a Transformer-based predictive process monitoring method that uses patch-based multi-channel event-log representations to perform next-activity, remaining-trace, and remaining-runtime prediction.",
      authors: "Mingyun Kang, Yongjae Lee, Kibeom Park, Hyerim Bae*",
      status: "Accepted at ICICIC 2026",
      period: "2026.07",
      completedAt: "2026.07",
      stack: ["Process Mining", "Predictive Process Monitoring", "Transformer"],
      links: [
        {
          label: "Paper (PDF)",
          url: documents.pact.pdfUrl,
        },
      ],
      preview: documents.pact,
    },
    {
      id: "veterans-hospital-analysis",
      title: "2026년 보훈 공공데이터·AI 활용 아이디어 공모전",
      entryTitle: "AI 기반 준보훈병원 입지 및 커버리지 분석",
      description: "A public-data and spatial optimization project analyzing locations and service coverage for veterans hospitals.",
      period: "2026.08",
      completedAt: "2026.08",
      stack: ["Public Data", "Spatial Analysis", "MCLP", "OSRM"],
      awardLabel: "장려상",
      links: [
        {
          label: "Slides (PDF)",
          url: documents.veteransHospital.pdfUrl,
        },
      ],
      preview: documents.veteransHospital,
    },
    {
      id: "minimum-wage-impact-analysis",
      title: "KOSSDA 2026 대학생 데이터 시각화 공모전",
      entryTitle: "최저임금 인상은 더 나은 내일을 약속하는가?",
      description: "A cross-validation study of macro- and micro-level data examining minimum wage changes and labor market structure.",
      period: "2026.08",
      completedAt: "2026.08",
      stack: ["Data Visualization", "Labor Market", "K-Means", "Statistical Analysis"],
      awardLabel: "우수상",
      links: [
        {
          label: "Entry (PDF)",
          url: documents.minimumWage.pdfUrl,
        },
      ],
      preview: documents.minimumWage,
    },
  ] satisfies Project[],
};
