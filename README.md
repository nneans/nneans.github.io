# 강민균 Portfolio

개인 포트폴리오 웹사이트 - React + Vite로 제작

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

### 개인 정보 수정
- `src/components/Hero.jsx` - 이름, 타이틀, 소개글
- `src/components/About.jsx` - 자기소개, 연구 관심사
- `src/components/Contact.jsx` - 이메일, 소셜 링크
- `src/components/Experience.jsx` - 학력, 경력

### 프로젝트 추가
`src/components/Projects.jsx`의 `projects` 배열에 추가:
```javascript
{
  type: 'Research Project',
  title: '프로젝트 제목',
  description: '프로젝트 설명...',
  tech: ['Python', 'PyTorch'],
  github: 'https://github.com/...',
  demo: 'https://demo.com',
}
```

### 논문 추가 (석사 입학 후)
`src/components/Publications.jsx`의 `publications` 배열에 추가:
```javascript
{
  type: 'Conference Paper',
  title: '논문 제목',
  authors: '저자1, 저자2, ...',
  venue: '학회명, 년도',
  links: {
    paper: 'https://...',
    code: 'https://github.com/...',
  }
}
```

## 🛠 기술 스택

- **Frontend**: React 19, Vite
- **Styling**: Vanilla CSS (Design System)
- **Fonts**: Inter, JetBrains Mono (Google Fonts)
- **Deploy**: Vercel

## 📁 프로젝트 구조

```
portfolio/
├── public/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Projects.jsx
│   │   ├── Skills.jsx
│   │   ├── Publications.jsx
│   │   ├── Experience.jsx
│   │   ├── Contact.jsx
│   │   └── Footer.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── vercel.json
└── package.json
```

## 📝 라이선스

MIT License
