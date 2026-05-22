import type { PricingBundle, PricingOptions, PricingSelectOption } from "@/lib/wordpress/types";

/** Parse combined select value: `bundle:id` or `landing:slug` or `service:slug` */
export function parsePricingSelection(value: string): {
  kind: "bundle" | "landing" | "service" | "";
  id: string;
} {
  if (!value) return { kind: "", id: "" };
  const [kind, ...rest] = value.split(":");
  const id = rest.join(":");
  if (kind === "bundle" || kind === "landing" || kind === "service") {
    return { kind, id };
  }
  return { kind: "", id: value };
}

export function findBundle(bundles: PricingBundle[], id: string): PricingBundle | undefined {
  return bundles.find((b) => b.id === id);
}

export function findServiceLabel(groups: PricingOptions["serviceGroups"], value: string): string {
  const { kind, id } = parsePricingSelection(value);
  if (kind !== "landing" && kind !== "service") return "";
  for (const group of groups) {
    const opt = group.options.find((o) => o.value === value);
    if (opt) return `${group.label} — ${opt.label}`;
  }
  return id;
}

export function labelForOption(list: PricingSelectOption[], value: string): string {
  return list.find((o) => o.value === value)?.label ?? value;
}

export function buildPricingInterestSummary(
  selection: string,
  options: PricingOptions,
  budget: string,
  timeline: string
): string {
  const parts: string[] = [];
  const { kind, id } = parsePricingSelection(selection);

  if (kind === "bundle") {
    const bundle = findBundle(options.bundles, id);
    parts.push(`Package: ${bundle?.label ?? id}`);
    if (bundle?.summary) parts.push(bundle.summary);
  } else if (kind === "landing" || kind === "service") {
    parts.push(`Service: ${findServiceLabel(options.serviceGroups, selection)}`);
  }

  if (budget) {
    parts.push(`Budget: ${labelForOption(options.budgetRanges, budget)}`);
  }
  if (timeline) {
    parts.push(`Timeline: ${labelForOption(options.timelines, timeline)}`);
  }

  return parts.join(" | ");
}
