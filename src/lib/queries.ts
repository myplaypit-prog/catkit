import { createPublicClient } from "./supabase/server";
import type {
  Brand,
  Category,
  Clinic,
  ProductDetail,
  ProductWithRefs,
  Testimonial,
  Vet,
} from "./types";

const PRODUCT_SELECT =
  "*, brand:brands!inner(*), category:categories!primary_category_id(*)";

export type ProductFilters = {
  condition?: string;
  kind?: string;
  brand?: string;
  life?: string;
  supp?: string;
  rx?: string;
  q?: string;
  sort?: string;
  limit?: number;
};

/** ilike 패턴에서 Supabase 필터 구문을 깨뜨리는 문자 제거 */
function safeTerm(raw: string) {
  return raw.replace(/[,()%\\]/g, " ").trim().slice(0, 40);
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  return (data ?? []) as Category[];
}

export async function getCategory(slug: string): Promise<Category | null> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as Category) ?? null;
}

export async function getBrands(): Promise<Brand[]> {
  const supabase = createPublicClient();
  const { data } = await supabase.from("brands").select("*").order("name");
  return (data ?? []) as Brand[];
}

export async function getProducts(
  filters: ProductFilters = {},
): Promise<ProductWithRefs[]> {
  const supabase = createPublicClient();

  const select = filters.condition
    ? PRODUCT_SELECT + ", product_categories!inner(category_id, categories!inner(slug))"
    : PRODUCT_SELECT;

  let query = supabase.from("products").select(select).eq("is_active", true);

  if (filters.condition) {
    query = query.eq("product_categories.categories.slug", filters.condition);
  }
  if (filters.kind && filters.kind !== "all") {
    query = query.eq("kind", filters.kind);
  }
  if (filters.brand && filters.brand !== "all") {
    query = query.eq("brands.slug", filters.brand);
  }
  if (filters.life && filters.life !== "all") {
    // 전연령 상품은 어떤 연령 필터에도 노출됩니다.
    query = query.in("life_stage", [filters.life, "all"]);
  }
  if (filters.supp && filters.supp !== "all") {
    query = query.eq("supplement_kind", filters.supp);
  }
  if (filters.rx === "rx") query = query.eq("rx_required", true);
  if (filters.rx === "otc") query = query.eq("rx_required", false);

  if (filters.q) {
    const term = safeTerm(filters.q);
    if (term) query = query.ilike("search_text", "%" + term + "%");
  }

  switch (filters.sort) {
    case "price_asc":
      query = query.order("effective_price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("effective_price", { ascending: false });
      break;
    case "review":
      query = query.order("review_count", { ascending: false });
      break;
    case "new":
      query = query.order("id", { ascending: false });
      break;
    default:
      query = query
        .order("rating", { ascending: false })
        .order("review_count", { ascending: false });
  }

  if (filters.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) {
    console.error("[getProducts]", error.message);
    return [];
  }
  return (data ?? []) as unknown as ProductWithRefs[];
}

export async function getProduct(slug: string): Promise<ProductDetail | null> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("products")
    .select(
      PRODUCT_SELECT +
        ", evidence:product_evidence(*), product_categories(categories(*))",
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!data) return null;

  const row = data as unknown as ProductDetail & {
    product_categories: { categories: Category }[];
  };

  return {
    ...row,
    evidence: (row.evidence ?? []).sort((a, b) => a.sort_order - b.sort_order),
    categories: (row.product_categories ?? [])
      .map((pc) => pc.categories)
      .filter(Boolean)
      .sort((a, b) => a.sort_order - b.sort_order),
  };
}

export async function getRelatedProducts(
  categoryId: number,
  excludeId: number,
  limit = 4,
): Promise<ProductWithRefs[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT + ", product_categories!inner(category_id)")
    .eq("is_active", true)
    .eq("product_categories.category_id", categoryId)
    .neq("id", excludeId)
    .order("rating", { ascending: false })
    .limit(limit);
  return (data ?? []) as unknown as ProductWithRefs[];
}

export async function getProductsBySlugs(
  slugs: string[],
): Promise<ProductWithRefs[]> {
  if (slugs.length === 0) return [];
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .in("slug", slugs);
  return (data ?? []) as unknown as ProductWithRefs[];
}

/** 찜 목록처럼 id 묶음으로 가져올 때. 순서는 호출한 쪽에서 맞춥니다 */
export async function getProductsByIds(
  ids: number[],
): Promise<ProductWithRefs[]> {
  if (ids.length === 0) return [];
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .in("id", ids);
  return (data ?? []) as unknown as ProductWithRefs[];
}

export async function getVets(): Promise<Vet[]> {
  const supabase = createPublicClient();
  const { data } = await supabase.from("vets").select("*").order("sort_order");
  return (data ?? []) as Vet[];
}

export async function getVet(slug: string): Promise<Vet | null> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("vets")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as Vet) ?? null;
}

export async function getClinics(filters: {
  region?: string;
  q?: string;
  night?: string;
} = {}): Promise<Clinic[]> {
  const supabase = createPublicClient();
  let query = supabase.from("clinics").select("*").order("sort_order");

  if (filters.region && filters.region !== "all") {
    query = query.eq("region", filters.region);
  }
  if (filters.night === "1") query = query.eq("night_care", true);
  if (filters.q) {
    const term = safeTerm(filters.q);
    if (term) {
      query = query.or(
        ["name.ilike.%" + term + "%", "address.ilike.%" + term + "%", "intro.ilike.%" + term + "%"].join(","),
      );
    }
  }

  const { data } = await query;
  return (data ?? []) as Clinic[];
}

export async function getClinic(slug: string): Promise<Clinic | null> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("clinics")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as Clinic) ?? null;
}

export async function getClinicVets(clinicId: number): Promise<Vet[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("clinic_vets")
    .select("vets(*)")
    .eq("clinic_id", clinicId);
  return ((data ?? []) as unknown as { vets: Vet }[])
    .map((r) => r.vets)
    .filter(Boolean);
}

export async function getVetClinics(vetId: number): Promise<Clinic[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("clinic_vets")
    .select("clinics(*)")
    .eq("vet_id", vetId);
  return ((data ?? []) as unknown as { clinics: Clinic }[])
    .map((r) => r.clinics)
    .filter(Boolean);
}

export async function getTestimonials(
  targetType: "vet" | "clinic",
  targetId: number,
): Promise<Testimonial[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .order("rating", { ascending: false })
    .order("id");
  return (data ?? []) as Testimonial[];
}

export async function getFeaturedTestimonials(limit = 6): Promise<Testimonial[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("rating", 5)
    .order("id")
    .limit(limit);
  return (data ?? []) as Testimonial[];
}

export async function getClinicRegions(): Promise<string[]> {
  const supabase = createPublicClient();
  const { data } = await supabase.from("clinics").select("region");
  const set = new Set((data ?? []).map((r: { region: string }) => r.region));
  return Array.from(set).sort();
}
