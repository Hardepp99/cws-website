"use client";

import {
  countCharacters,
  countWords,
  counterStatus,
  stripHtmlForCount,
  type CounterStatus,
} from "@/lib/admin/field-count";

export type CmsCounterMode = "chars" | "words" | "both";

type Props = {
  value: string;
  mode?: CmsCounterMode;
  stripHtml?: boolean;
  max?: number;
  min?: number;
  unit?: string;
  className?: string;
};

function statusClass(status: CounterStatus): string {
  if (status === "over") return "cms-field-counter--over";
  if (status === "warn") return "cms-field-counter--warn";
  if (status === "ok") return "cms-field-counter--ok";
  return "";
}

export function CmsFieldCounter({
  value,
  mode = "chars",
  stripHtml = false,
  max,
  min,
  unit = "characters",
  className = "",
}: Props) {
  const plain = stripHtml ? stripHtmlForCount(value) : value;
  const chars = countCharacters(plain);
  const words = countWords(plain);

  if (mode === "both") {
    const charStatus = counterStatus(chars, min, max);
    const maxPart = max !== undefined ? ` / ${max}` : "";
    return (
      <span className={`cms-field-counter cms-field-counter--multi ${className}`.trim()} aria-live="polite">
        <span className={statusClass(charStatus)}>
          {chars}
          {maxPart} {unit}
        </span>
        <span aria-hidden="true"> · </span>
        <span>{words} words</span>
      </span>
    );
  }

  if (mode === "words") {
    const status = counterStatus(words, min, max);
    const maxPart = max !== undefined ? ` / ${max}` : "";
    return (
      <span className={`cms-field-counter ${statusClass(status)} ${className}`.trim()} aria-live="polite">
        {words}
        {maxPart} words
      </span>
    );
  }

  const status = counterStatus(chars, min, max);
  const maxPart = max !== undefined ? ` / ${max}` : "";
  return (
    <span className={`cms-field-counter ${statusClass(status)} ${className}`.trim()} aria-live="polite">
      {chars}
      {maxPart} {unit}
    </span>
  );
}

export function CmsLabelRow({
  htmlFor,
  children,
  counter,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  counter?: React.ReactNode;
}) {
  return (
    <label className="cms-label cms-label--row" htmlFor={htmlFor}>
      <span>{children}</span>
      {counter ?? null}
    </label>
  );
}
