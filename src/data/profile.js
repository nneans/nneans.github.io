
export const profile = {
    name: "강민균",
    role: "Data Scientist & Developer",
    // bio: "데이터와 AI로 복잡한 금융/사회 문제를 해결합니다.", // 요청에 따라 삭제
    email: "nneans33@gmail.com",
    github: "https://github.com/nneans",

    // 학력
    education: [
        {
            school: "부산대학교",
            major: "통계학과 학사",
            period: "2022.03 ~ 2026.02" // 졸업예정일 확인 필요하면 수정
        },
        {
            school: "부산대학교 산업공학과",
            major: "빅데이터분석엔지니어링 연구실 (학석통합)",
            period: "2026.03 ~ (예정)"
        }
    ],

    // 수상 실적: 실제 수상한 내역만 기재 + 참가 경험은 선택적으로 'Experience'나 프로젝트 설명에 녹이는 것 추천
    awards: [
        {
            title: "지산학 산업 데이터 공모전",
            award: "우수상",
            organizer: "부산테크노파크",
            date: "2025.11"
        },
        {
            title: "동서발전 풍력 발전량 예측 공모전",
            award: "장려상",
            organizer: "한국동서발전",
            date: "2025.10"
        },
        {
            title: "대학생 창업 아이디어 경진대회",
            award: "장려상",
            organizer: "부산광역시", // 주최 기관 정확하게 수정 필요시 요청
            date: "2025.10"
        }
    ],

    // 기술 스택/관심사: React 제외, Time Series/BPM 등 데이터/연구 중심
    skills: [
        "Time Series Analysis",
        "Process Mining (BPM)",
        "Machine Learning",
        "Deep Learning",
        "Python",
        "Data Analysis"
    ]
}
