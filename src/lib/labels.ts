import type {
  LifeStage,
  ProductKind,
  SuppKind,
  EvidenceLevel,
  OrderStatus,
} from "./types";

export const KIND_LABEL: Record<ProductKind, string> = {
  dry: "건사료",
  wet: "습식",
  supplement: "건강기능식품",
};

export const LIFE_STAGE_LABEL: Record<LifeStage, string> = {
  kitten: "자묘 (~1세)",
  adult: "성묘 (1~7세)",
  senior: "노령묘 (7세~)",
  all: "전연령",
};

export const LIFE_STAGE_SHORT: Record<LifeStage, string> = {
  kitten: "자묘",
  adult: "성묘",
  senior: "노령묘",
  all: "전연령",
};

export const SUPP_LABEL: Record<SuppKind, string> = {
  vitamin: "비타민 · 미네랄",
  probiotic: "유산균",
  prescription: "처방 보조제",
  omega: "오메가-3",
  enzyme: "소화효소",
  binder: "인 흡착제",
  other: "기타 기능성",
};

export const EVIDENCE_LABEL: Record<EvidenceLevel, string> = {
  A: "무작위 대조 연구 · 진료 가이드라인",
  B: "대조군 연구 · 코호트 · 종설",
  C: "기전 연구 · 전문가 견해",
};

export const EVIDENCE_SHORT: Record<EvidenceLevel, string> = {
  A: "근거 A",
  B: "근거 B",
  C: "근거 C",
};

export const EVIDENCE_TONE: Record<EvidenceLevel, { fg: string; bg: string }> = {
  A: { fg: "#4F7F4A", bg: "#EDF4EC" },
  B: { fg: "#8A6048", bg: "#EFE6DE" },
  C: { fg: "#A9813A", bg: "#FBF1E1" },
};

export const SOURCE_TYPE_LABEL: Record<string, string> = {
  journal: "학술지 논문",
  guideline: "진료 가이드라인",
  clinical_trial: "임상시험",
  manufacturer: "제조사 자료",
};

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "결제 대기",
  paid: "결제 완료",
  failed: "결제 실패",
  canceled: "주문 취소",
};

export const ORDER_STATUS_TONE: Record<OrderStatus, { fg: string; bg: string }> = {
  pending: { fg: "#A9813A", bg: "#FBF1E1" },
  paid: { fg: "#4F7F4A", bg: "#EDF4EC" },
  failed: { fg: "#C25F2C", bg: "#FDEDE3" },
  canceled: { fg: "#7A6557", bg: "#F5EDE4" },
};

export const ANALYSIS_LABEL: Record<string, string> = {
  protein: "조단백질",
  fat: "조지방",
  fiber: "조섬유",
  moisture: "수분",
  phosphorus: "인 (P)",
  sodium: "나트륨",
  potassium: "칼륨",
  kcal: "열량",
  starch: "전분",
  epa_dha: "EPA + DHA",
  arginine: "아르기닌",
  epa: "EPA",
  dha: "DHA",
  peptide_size: "펩타이드 크기",
  protein_source: "단백질 원료",
  serving: "1회 급여량",
  form: "제형",
  strain: "균주",
  cfu: "생균수",
  zinc: "아연",
  biotin: "비오틴",
  niacinamide: "니아신아마이드",
  vitamin_e: "비타민 E",
  vitamin_b: "비타민 B군",
  vitamin_c: "비타민 C",
  quercetin: "퀘르세틴",
  bromelain: "브로멜라인",
  same: "SAMe",
  silybin: "실리빈",
  lipase: "리파아제",
  protease: "프로테아제",
  amylase: "아밀라아제",
  calcium_carbonate: "탄산칼슘",
  chitosan: "키토산",
  minerals: "미네랄",
  antioxidant: "항산화 성분",
  oils: "배합 오일",
  cycle: "사용 주기",
  volume: "용량",
};

export function analysisLabel(key: string) {
  return ANALYSIS_LABEL[key] ?? key;
}

/** 보장성분표를 사료 라벨과 같은 순서로 정렬하기 위한 기준 */
const ANALYSIS_ORDER = [
  "protein",
  "fat",
  "fiber",
  "moisture",
  "starch",
  "phosphorus",
  "sodium",
  "potassium",
  "epa_dha",
  "epa",
  "dha",
  "arginine",
  "kcal",
  "protein_source",
  "peptide_size",
  "strain",
  "cfu",
  "form",
  "serving",
];

export function sortAnalysis(analysis: Record<string, string>) {
  return Object.entries(analysis ?? {}).sort(([a], [b]) => {
    const ia = ANALYSIS_ORDER.indexOf(a);
    const ib = ANALYSIS_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}
