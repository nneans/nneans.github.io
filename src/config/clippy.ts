import type { SkyCondition, SkyPhase } from "../os/weather";

export interface ClippyContext {
  condition: SkyCondition;
  phase: SkyPhase;
  /** NaN when the forecast never arrived. */
  temperature: number;
  /** Hour of day in Busan, 0-23. */
  hour: number;
  openWindows: number;
  musicPlaying: boolean;
}

export interface ClippyLine {
  id: string;
  text: string;
  /** Omit to make the line always eligible. */
  when?: (context: ClippyContext) => boolean;
  /** Higher weight lines are picked more often among the eligible ones. */
  weight?: number;
}

const cold = (context: ClippyContext) => context.temperature <= 4;
const hot = (context: ClippyContext) => context.temperature >= 28;

export const clippyLines: ClippyLine[] = [
  /* --- weather --- */
  {
    id: "rain",
    text: "부산에 비가 오고 있어요. 우산 챙기셨나요? 저는 클립이라 젖어도 녹슬 뿐입니다.",
    when: (context) => context.condition === "rain",
    weight: 3,
  },
  {
    id: "rain-night",
    text: "비 오는 밤이네요. 창밖 소리 들으면서 천천히 둘러보셔도 좋아요.",
    when: (context) => context.condition === "rain" && context.phase === "night",
    weight: 3,
  },
  {
    id: "storm",
    text: "천둥번개가 치고 있어요. 1996년이었다면 지금 당장 컴퓨터 전원을 뽑으라고 했을 거예요.",
    when: (context) => context.condition === "storm",
    weight: 4,
  },
  {
    id: "snow",
    text: "부산에 눈이 와요. 이건 좀 사건입니다. 나가서 보고 오세요, 기다릴게요.",
    when: (context) => context.condition === "snow",
    weight: 5,
  },
  {
    id: "fog",
    text: "안개가 꼈네요. 광안대교가 안 보이는 날입니다.",
    when: (context) => context.condition === "fog",
    weight: 3,
  },
  {
    id: "overcast",
    text: "오늘 부산 하늘은 흐림이에요. 배경화면이 칙칙한 건 제 탓이 아닙니다.",
    when: (context) => context.condition === "overcast",
  },
  {
    id: "clear-day",
    text: "부산 날씨가 아주 맑아요. 이런 날에 포트폴리오를 보고 계시다니, 고맙기도 하고 미안하기도 하네요.",
    when: (context) => context.condition === "clear" && context.phase === "day",
    weight: 2,
  },
  {
    id: "clear-night",
    text: "오늘 밤은 하늘이 맑아요. 배경의 별은 진짜 부산 날씨를 보고 그린 겁니다.",
    when: (context) => context.condition === "clear" && context.phase === "night",
    weight: 2,
  },
  {
    id: "cold",
    text: `부산이 춥네요. 이 정도면 부산 사람들은 "이게 부산 날씨냐"고 합니다.`,
    when: cold,
    weight: 2,
  },
  {
    id: "hot",
    text: "부산이 덥습니다. 해운대에 사람 많겠네요.",
    when: hot,
    weight: 2,
  },
  {
    id: "dawn-sky",
    text: "지금 부산은 해 뜨는 중이에요. 배경 하늘도 같이 물들고 있습니다.",
    when: (context) => context.phase === "dawn",
    weight: 3,
  },
  {
    id: "dusk-sky",
    text: "부산은 지금 노을이에요. 배경 한 번 봐주세요, 공들인 부분입니다.",
    when: (context) => context.phase === "dusk",
    weight: 3,
  },

  /* --- time of day --- */
  {
    id: "very-late",
    text: "부산은 지금 새벽 3시입니다. 안 주무세요? 저야 상관없지만요.",
    when: (context) => context.hour >= 2 && context.hour < 5,
    weight: 4,
  },
  {
    id: "late",
    text: "늦은 시간이네요. 이력서는 내일 읽어도 도망가지 않습니다.",
    when: (context) => context.hour >= 23 || context.hour < 2,
    weight: 2,
  },
  {
    id: "morning",
    text: "좋은 아침이에요. 커피 한 잔 하시면서 보세요.",
    when: (context) => context.hour >= 6 && context.hour < 10,
  },
  {
    id: "lunch",
    text: "점심시간이네요. 밥은 드셨나요?",
    when: (context) => context.hour >= 12 && context.hour < 14,
  },
  {
    id: "afternoon-slump",
    text: "오후 3시, 제일 졸린 시간이죠. 게임 폴더에 Minesweeper 있습니다. 아무한테도 말 안 할게요.",
    when: (context) => context.hour >= 14 && context.hour < 17,
    weight: 2,
  },

  /* --- what you are doing --- */
  {
    id: "many-windows",
    text: "창을 꽤 많이 열어두셨네요. 1996년 컴퓨터였으면 벌써 멈췄을 겁니다.",
    when: (context) => context.openWindows >= 4,
    weight: 4,
  },
  {
    id: "music",
    text: "음악 듣고 계시는군요. 취향 좋으신데요. 창을 닫아도 계속 나옵니다.",
    when: (context) => context.musicPlaying,
    weight: 3,
  },
  {
    id: "idle-empty",
    text: "아무것도 안 열고 계시네요. 바탕화면 아이콘은 더블클릭하시면 됩니다. 저도 처음엔 몰랐어요.",
    when: (context) => context.openWindows === 0,
    weight: 2,
  },

  /* --- portfolio nudges --- */
  {
    id: "work-archive",
    text: "Work Archive부터 보시는 걸 추천드려요. 여기 온 이유가 아마 그거일 테니까요.",
  },
  {
    id: "time-travel",
    text: "Time Travel 앱 열어보셨어요? 달력에 점 찍힌 날짜를 누르면 그날로 갑니다.",
  },
  {
    id: "cv",
    text: "CV.pdf 파일이 바탕화면에 있어요. 진짜 PDF는 아니지만 내용은 진짜입니다.",
  },
  {
    id: "contact",
    text: "연락하고 싶으시면 Contact 앱을 쓰시면 돼요. 답장은 제가 아니라 민균님이 합니다.",
  },
  {
    id: "backgrounds",
    text: "배경이 마음에 안 드시면 Backgrounds에서 바꾸실 수 있어요. 단색으로 돌아가도 서운해하지 않을게요.",
  },
  {
    id: "recycle",
    text: "바탕화면 아이콘을 휴지통으로 끌어다 버릴 수 있어요. 버려도 됩니다. 되돌릴 수 있거든요.",
  },

  /* --- just Clippy being Clippy --- */
  {
    id: "letter",
    text: "편지를 쓰시는 것 같군요! ...아니네요. 죄송합니다. 직업병입니다.",
    weight: 2,
  },
  {
    id: "unemployed",
    text: "2001년에 해고당한 뒤로 할 일이 없었어요. 불러주셔서 고맙습니다.",
    weight: 2,
  },
  {
    id: "screensaver",
    text: "3분쯤 가만히 두시면 화면보호기가 나와요. 한번 해보세요. 볼 만합니다.",
  },
  {
    id: "no-tips",
    text: "도움말을 드릴까요? 사실 저도 이 사이트는 처음입니다.",
  },
];
