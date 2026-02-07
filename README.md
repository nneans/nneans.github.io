# 강민균 Portfolio

개인 포트폴리오 웹사이트 - React + Vite + Three.js로 제작

## ✨ 특징

- 🎨 **3D 인터랙티브 그래프**: Three.js로 구현한 프로젝트 아카이브
- 📱 **완벽한 반응형**: 모바일, 태블릿, 데스크톱 최적화
- ⚡ **성능 최적화**: 코드 스플리팅, Lazy Loading
- ♿ **접근성**: ARIA 레이블, 키보드 네비게이션
- 🔍 **SEO 최적화**: sitemap, robots.txt, Open Graph 메타 태그
- 🎯 **프린트 지원**: 인쇄 시 최적화된 레이아웃

## 🚀 시작하기

### 로컬 개발
```bash
npm install
npm run dev
```

### 프로덕션 빌드
```bash
npm run build
npm run preview
```

## 📦 Vercel 배포

### 방법 1: GitHub 연동 (권장)
1. 이 프로젝트를 GitHub에 푸시
2. [Vercel](https://vercel.com)에 로그인
3. "New Project" → GitHub 레포 선택
4. 자동으로 빌드 및 배포 진행
5. 배포 완료 후 URL 제공 (예: `your-portfolio.vercel.app`)

### 방법 2: Vercel CLI
```bash
# Vercel CLI 설치
npm i -g vercel

# 이 디렉토리에서 배포
vercel

# 프로덕션 배포
vercel --prod
```

## ✏️ 커스터마이징

### 1. 개인 정보 수정
`src/data/profile.js` 파일에서 모든 정보 관리:
```javascript
export const profile = {
  name: '강민균',
  university: 'Pusan National University',
  education: [...],
  researchInterests: [...],
  // ...
}
```

### 2. 이미지 교체
```bash
# 프로필 이미지
/public/profile.png (120x120 권장)

# 파비콘
/public/favicon.png (32x32)

# OG 이미지 (소셜 미디어 공유)
/public/og-image.png (1200x630)
```

### 3. SEO 설정
`index.html`에서 메타 태그 수정:
- 타이틀, 설명 변경
- OG 이미지 URL 업데이트
- 도메인 주소 변경

`public/sitemap.xml`에서 배포된 도메인으로 URL 업데이트

### 4. 프로젝트 추가
`src/data/profile.js`의 배열에 추가:

**연구 프로젝트:**
```javascript
researchExperience: [
  {
    title: '프로젝트 제목',
    subtitle: '부제목',
    affiliation: '소속 기관',
    period: '2024.01 - 2024.12',
    role: '역할',
    description: '프로젝트 설명...',
    tech: ['Python', 'PyTorch'],
    links: [{ name: 'GitHub', url: 'https://...' }],
  }
]
```

**대회:**
```javascript
competitions: [
  {
    title: '대회명',
    affiliation: '주최 기관',
    period: '2024.01',
    role: '수상 내역',
    description: '설명...',
  }
]
```

## 🛠 기술 스택

- **Frontend**: React 19, Vite
- **3D Graphics**: Three.js, @react-three/fiber, @react-three/drei
- **Styling**: Vanilla CSS (모바일 반응형)
- **Icons**: lucide-react
- **Deploy**: Vercel
- **Performance**: Code Splitting, Lazy Loading, Suspense

## 📁 프로젝트 구조

```
portfolio/
├── public/
│   ├── profile.png         # 프로필 이미지
│   ├── favicon.png         # 파비콘
│   ├── og-image.png        # OG 이미지
│   ├── robots.txt          # 검색엔진 크롤러
│   └── sitemap.xml         # 사이트맵
├── src/
│   ├── components/
│   │   ├── ProjectGraph.jsx      # 3D 그래프
│   │   ├── ProjectModal.jsx      # 프로젝트 상세 모달
│   │   ├── LoadingSpinner.jsx    # 로딩 컴포넌트
│   │   └── ...
│   ├── data/
│   │   └── profile.js            # 모든 개인 정보
│   ├── App.jsx
│   ├── App.css                   # 반응형 스타일
│   └── main.jsx
├── index.html                    # SEO 메타 태그
├── vite.config.js                # 성능 최적화 설정
└── package.json
```

## 🎯 성능 최적화

- ✅ **코드 스플리팅**: React, Three.js 벤더 청크 분리
- ✅ **Lazy Loading**: 이미지 지연 로딩
- ✅ **Suspense**: 3D 그래프 비동기 로딩
- ✅ **Minification**: Terser를 통한 최소화
- ✅ **Tree Shaking**: 사용하지 않는 코드 제거

## 📱 반응형 디자인

- Desktop: 1024px+
- Tablet: 768px - 1023px
- Mobile: < 768px
- Small Mobile: < 480px

## ♿ 접근성

- ARIA 레이블 지원
- 키보드 네비게이션
- 고대비 모드 지원
- 모션 감소 옵션 (`prefers-reduced-motion`)
- 스크린 리더 호환

## 📝 라이선스

MIT License

---

Made with ❤️ by 강민균
