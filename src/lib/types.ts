export type ProductKind = "dry" | "wet" | "supplement";
export type LifeStage = "kitten" | "adult" | "senior" | "all";
export type SuppKind =
  | "vitamin"
  | "probiotic"
  | "prescription"
  | "omega"
  | "enzyme"
  | "binder"
  | "other";
export type EvidenceLevel = "A" | "B" | "C";
export type OrderStatus = "pending" | "paid" | "failed" | "canceled";

export type Brand = {
  id: number;
  slug: string;
  name: string;
  name_en: string | null;
  country: string | null;
  description: string | null;
};

export type Category = {
  id: number;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  care_points: string[];
  accent: string;
  accent_soft: string;
  icon: string;
  sort_order: number;
};

export type Evidence = {
  id: number;
  product_id: number;
  title: string;
  summary: string;
  source_name: string;
  source_type: string;
  citation: string | null;
  url: string | null;
  year: number | null;
  level: EvidenceLevel;
  sort_order: number;
};

export type Product = {
  id: number;
  slug: string;
  name: string;
  name_en: string | null;
  brand_id: number;
  primary_category_id: number;
  kind: ProductKind;
  supplement_kind: SuppKind | null;
  life_stage: LifeStage;
  rx_required: boolean;
  price: number;
  sale_price: number | null;
  unit_label: string | null;
  short_desc: string;
  description: string;
  ingredients: string | null;
  feeding_guide: string | null;
  analysis: Record<string, string>;
  highlights: string[];
  cautions: string[];
  image_url: string | null;
  accent: string | null;
  stock: number;
  rating: number;
  review_count: number;
  is_active: boolean;
  created_at: string;
};

export type ProductWithRefs = Product & {
  brand: Brand;
  category: Category;
};

export type ProductDetail = ProductWithRefs & {
  evidence: Evidence[];
  categories: Category[];
};

export type CareerItem = { year: string; desc: string };

export type Vet = {
  id: number;
  slug: string;
  name: string;
  title: string;
  clinic_name: string | null;
  region: string | null;
  specialties: string[];
  intro: string;
  bio: string;
  career: CareerItem[];
  education: string[];
  consult_fee: number;
  consult_open: boolean;
  years: number;
  rating: number;
  review_count: number;
  photo_seed: string;
  accent: string;
  sort_order: number;
};

export type Clinic = {
  id: number;
  slug: string;
  name: string;
  region: string;
  district: string;
  address: string;
  phone: string | null;
  hours: Record<string, string>;
  intro: string;
  specialties: string[];
  facilities: string[];
  homepage: string | null;
  cat_friendly: boolean;
  night_care: boolean;
  rating: number;
  review_count: number;
  accent: string;
  sort_order: number;
};

export type Testimonial = {
  id: number;
  target_type: "vet" | "clinic";
  target_id: number;
  author: string;
  cat_name: string | null;
  rating: number;
  body: string;
  created_at: string;
};

export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number | null;
  name: string;
  slug: string | null;
  image_url: string | null;
  unit_price: number;
  qty: number;
};

export type Order = {
  id: number;
  order_code: string;
  user_id: string;
  status: OrderStatus;
  amount: number;
  order_name: string;
  orderer_name: string;
  phone: string;
  postcode: string | null;
  address: string;
  address_detail: string | null;
  memo: string | null;
  payment_key: string | null;
  method: string | null;
  receipt_url: string | null;
  approved_at: string | null;
  fail_reason: string | null;
  created_at: string;
  order_items?: OrderItem[];
};

export type CartLine = {
  productId: number;
  slug: string;
  name: string;
  unitPrice: number;
  qty: number;
  unitLabel: string | null;
  accent: string | null;
  seed: string;
  rxRequired: boolean;
};
