import type { Axis, AxisDefinition, CoupleTypeQuestion } from "./types";

export const axisOrder = ["pace", "expression", "repair", "bond"] as const;

export const axisDefinitions = {
  bond: {
    label: "연결 방식",
    options: {
      D: {
        body: "진심, 의미, 긴 대화로 가까워지는 흐름",
        label: "진심 연결형",
      },
      P: {
        body: "장난, 밈, 농담으로 분위기를 먼저 여는 흐름",
        label: "장난 연결형",
      },
    },
    values: ["P", "D"],
  },
  expression: {
    label: "표현 방식",
    options: {
      N: {
        body: "말 사이의 뉘앙스와 작은 신호를 더 크게 읽는 흐름",
        label: "은근 표현형",
      },
      O: {
        body: "좋고 싫음을 비교적 분명한 말로 꺼내는 흐름",
        label: "직접 표현형",
      },
    },
    values: ["O", "N"],
  },
  pace: {
    label: "대화 속도",
    options: {
      H: {
        body: "천천히 안정감을 쌓고 오래 머무는 흐름",
        label: "안정 정박형",
      },
      S: {
        body: "생각난 순간 바로 말을 걸며 불씨를 살리는 흐름",
        label: "즉흥 점화형",
      },
    },
    values: ["S", "H"],
  },
  repair: {
    label: "회복 리듬",
    options: {
      L: {
        body: "감정을 정리한 뒤 차분히 다시 맞추는 흐름",
        label: "천천히 정리형",
      },
      Q: {
        body: "불편함이 생기면 빨리 확인하고 다시 붙는 흐름",
        label: "바로 회복형",
      },
    },
    values: ["Q", "L"],
  },
} as const satisfies Record<Axis, AxisDefinition>;

export const coupleTypeQuestions = [
  {
    axis: "pace",
    id: "pace-start",
    options: [
      { label: "생각나면 바로 톡을 보내고 흐름을 만든다", value: "S" },
      { label: "조금 모아두었다가 편한 타이밍에 이어간다", value: "H" },
    ],
    question: "둘 사이 대화가 가장 자연스럽게 시작되는 순간은?",
  },
  {
    axis: "expression",
    id: "expression-like",
    options: [
      { label: "좋으면 좋다고 비교적 선명하게 말한다", value: "O" },
      { label: "말보다 분위기와 행동으로 먼저 보여준다", value: "N" },
    ],
    question: "애정 표현은 보통 어떤 쪽에 더 가까워요?",
  },
  {
    axis: "repair",
    id: "repair-conflict",
    options: [
      { label: "불편한 건 빨리 확인하고 풀어야 마음이 놓인다", value: "Q" },
      { label: "일단 각자 식힌 뒤 정리해서 말하는 편이다", value: "L" },
    ],
    question: "작은 오해가 생겼을 때 둘의 기본 리듬은?",
  },
  {
    axis: "bond",
    id: "bond-mood",
    options: [
      { label: "장난과 농담으로 먼저 분위기를 부드럽게 만든다", value: "P" },
      { label: "진심 어린 말로 서로의 마음을 확인한다", value: "D" },
    ],
    question: "둘이 다시 가까워지는 데 가장 잘 통하는 방식은?",
  },
  {
    axis: "pace",
    id: "pace-date",
    options: [
      { label: "갑자기 정해도 재미있으면 바로 움직인다", value: "S" },
      { label: "일정과 컨디션을 맞춰 안정적으로 잡는다", value: "H" },
    ],
    question: "데이트 약속을 잡을 때 둘의 온도는?",
  },
  {
    axis: "expression",
    id: "expression-care",
    options: [
      { label: "필요한 부탁이나 서운함을 말로 꺼내는 편이다", value: "O" },
      { label: "상대가 알아차릴 수 있게 작은 신호를 남긴다", value: "N" },
    ],
    question: "배려가 필요할 때 주로 어떻게 알려요?",
  },
  {
    axis: "repair",
    id: "repair-silence",
    options: [
      { label: "침묵이 길어지기 전에 먼저 확인 메시지를 보낸다", value: "Q" },
      { label: "침묵도 정리 시간으로 두고 천천히 다시 연다", value: "L" },
    ],
    question: "답장이 늦어지는 날, 둘은 보통 어떻게 맞춰가나요?",
  },
  {
    axis: "bond",
    id: "bond-memory",
    options: [
      { label: "웃긴 사진, 별명, 밈 같은 사소한 암호가 많다", value: "P" },
      { label: "그날의 감정과 의미를 오래 기억하는 편이다", value: "D" },
    ],
    question: "둘만의 추억은 어떤 재료로 더 많이 남아 있어요?",
  },
  {
    axis: "pace",
    id: "pace-night",
    options: [
      { label: "밤에 갑자기 대화가 불붙는 일이 잦다", value: "S" },
      { label: "하루의 루틴 안에서 꾸준히 이어지는 편이다", value: "H" },
    ],
    question: "대화가 길어지는 날의 시작점은?",
  },
  {
    axis: "expression",
    id: "expression-check",
    options: [
      { label: "확실히 말해줘야 오해가 줄어든다고 느낀다", value: "O" },
      { label: "너무 설명하기보다 맥락을 봐주길 바란다", value: "N" },
    ],
    question: "마음을 확인하는 방식에서 더 중요한 건?",
  },
  {
    axis: "repair",
    id: "repair-apology",
    options: [
      { label: "짧게라도 먼저 사과하고 대화의 문을 연다", value: "Q" },
      { label: "왜 그랬는지 충분히 이해한 뒤 다시 말한다", value: "L" },
    ],
    question: "미안하다는 말을 꺼내는 타이밍은?",
  },
  {
    axis: "bond",
    id: "bond-support",
    options: [
      { label: "가벼운 농담으로 기분을 돌려주는 게 잘 먹힌다", value: "P" },
      { label: "조용히 들어주고 진짜 마음을 짚어주는 게 좋다", value: "D" },
    ],
    question: "상대가 힘든 날, 가장 힘이 되는 반응은?",
  },
] as const satisfies readonly CoupleTypeQuestion[];
