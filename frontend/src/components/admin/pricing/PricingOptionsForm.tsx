"use client";

import { useEffect, useState } from "react";
import { WpEditScreen } from "@/components/admin/wp/WpEditScreen";
import { slugify } from "@/lib/admin/slugify";
import { adminFetch } from "@/lib/admin/client";
import type { PricingBundle, PricingSelectOption } from "@/lib/wordpress/types";

type GroupRule = { group: string; patterns: string[] };

type PricingPayload = {
  bundles: PricingBundle[];
  budgetRanges: PricingSelectOption[];
  timelines: PricingSelectOption[];
  serviceGroupRules: GroupRule[];
};

const EMPTY: PricingPayload = {
  bundles: [],
  budgetRanges: [],
  timelines: [],
  serviceGroupRules: [],
};

function linesToList(text: string): string[] {
  return text.split("\n").map((s) => s.trim()).filter(Boolean);
}

function listToLines(items: string[] | undefined): string {
  return (items ?? []).join("\n");
}

function OptionRepeater({
  label,
  items,
  onChange,
  valueHint,
}: {
  label: string;
  items: PricingSelectOption[];
  onChange: (items: PricingSelectOption[]) => void;
  valueHint?: string;
}) {
  return (
    <div className="cms-repeater cms-pricing-block">
      <label className="cms-label">{label}</label>
      {items.map((item, i) => (
        <div key={i} className="cms-repeater-row cms-repeater-row--inline cms-repeater-row--3col">
          <div>
            <label className="cms-label">Value (ID)</label>
            <input
              className="cms-input"
              value={item.value}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, value: e.target.value };
                onChange(next);
              }}
              placeholder={valueHint || "under-25k"}
            />
          </div>
          <div>
            <label className="cms-label">Label (shown in form)</label>
            <input
              className="cms-input"
              value={item.label}
              onChange={(e) => {
                const next = [...items];
                next[i] = { ...item, label: e.target.value };
                onChange(next);
              }}
            />
          </div>
          <button
            type="button"
            className="cms-btn-text danger"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="cms-btn cms-btn-ghost"
        onClick={() => onChange([...items, { value: "", label: "" }])}
      >
        + Add option
      </button>
    </div>
  );
}

export function PricingOptionsForm() {
  const [data, setData] = useState<PricingPayload>(EMPTY);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetch<PricingPayload>("/pricing")
      .then((d) =>
        setData({
          bundles: d.bundles ?? [],
          budgetRanges: d.budgetRanges ?? [],
          timelines: d.timelines ?? [],
          serviceGroupRules: (d as PricingPayload).serviceGroupRules ?? [],
        }),
      )
      .catch((e) => setErr(String(e)));
  }, []);

  async function save() {
    setSaving(true);
    setErr("");
    try {
      const bundles = data.bundles.map((b) => ({
        ...b,
        id: b.id || slugify(b.label),
      }));
      await adminFetch("/pricing", {
        method: "PUT",
        json: { ...data, bundles },
      });
      setData((prev) => ({ ...prev, bundles }));
      setMsg("Ask price options saved.");
    } catch (e) {
      setErr(String(e));
    } finally {
      setSaving(false);
    }
  }

  function updateBundle(i: number, patch: Partial<PricingBundle>) {
    setData((d) => ({
      ...d,
      bundles: d.bundles.map((b, j) => (j === i ? { ...b, ...patch } : b)),
    }));
  }

  function updateRule(i: number, patch: Partial<GroupRule>) {
    setData((d) => ({
      ...d,
      serviceGroupRules: d.serviceGroupRules.map((r, j) => (j === i ? { ...r, ...patch } : r)),
    }));
  }

  return (
    <WpEditScreen
      title="Ask price options"
      backHref="/admin"
      backLabel="← Dashboard"
      onSave={save}
      saving={saving}
      saveLabel="Save options"
      message={msg}
      error={err}
    >
      <p className="cms-field-hint">
        These options power the <strong>Ask price</strong> popup on the site. Service choices are built automatically
        from your published <strong>Service landings</strong> and <strong>Services</strong>, grouped using the rules
        below.
      </p>

      <h2 className="cms-section-heading">Popular packages</h2>
      <div className="cms-repeater">
        {data.bundles.map((b, i) => (
          <div key={i} className="cms-repeater-row cms-pricing-bundle">
            <div className="cms-repeater-row-head">
              <strong>Package {i + 1}</strong>
              <button
                type="button"
                className="cms-btn-text danger"
                onClick={() =>
                  setData((d) => ({ ...d, bundles: d.bundles.filter((_, j) => j !== i) }))
                }
              >
                Remove
              </button>
            </div>
            <div className="cms-form-grid-2">
              <div>
                <label className="cms-label">Package ID</label>
                <input
                  className="cms-input"
                  value={b.id}
                  onChange={(e) => updateBundle(i, { id: slugify(e.target.value) })}
                  placeholder="starter-website"
                />
              </div>
              <div>
                <label className="cms-label">Display name</label>
                <input
                  className="cms-input"
                  value={b.label}
                  onChange={(e) => updateBundle(i, { label: e.target.value })}
                />
              </div>
            </div>
            <label className="cms-label">Short summary</label>
            <textarea
              className="cms-textarea"
              rows={2}
              value={b.summary}
              onChange={(e) => updateBundle(i, { summary: e.target.value })}
            />
            <label className="cms-label">Includes (one per line)</label>
            <textarea
              className="cms-textarea"
              rows={4}
              value={listToLines(b.includes)}
              onChange={(e) => updateBundle(i, { includes: linesToList(e.target.value) })}
            />
          </div>
        ))}
        <button
          type="button"
          className="cms-btn cms-btn-ghost"
          onClick={() =>
            setData((d) => ({
              ...d,
              bundles: [
                ...d.bundles,
                { id: "", label: "New package", summary: "", includes: [] },
              ],
            }))
          }
        >
          + Add package
        </button>
      </div>

      <h2 className="cms-section-heading">Budget ranges</h2>
      <OptionRepeater
        label=""
        items={data.budgetRanges}
        onChange={(budgetRanges) => setData((d) => ({ ...d, budgetRanges }))}
        valueHint="under-25k"
      />

      <h2 className="cms-section-heading">Timeline options</h2>
      <OptionRepeater
        label=""
        items={data.timelines}
        onChange={(timelines) => setData((d) => ({ ...d, timelines }))}
        valueHint="1-month"
      />

      <h2 className="cms-section-heading">Service grouping rules</h2>
      <p className="cms-field-hint">
        Each rule has a group title and slug patterns (one per line). Landing/service slugs containing a pattern are
        placed in that group in the Ask price dropdown.
      </p>
      <div className="cms-repeater">
        {data.serviceGroupRules.map((rule, i) => (
          <div key={i} className="cms-repeater-row">
            <div className="cms-repeater-row-head">
              <strong>Rule {i + 1}</strong>
              <button
                type="button"
                className="cms-btn-text danger"
                onClick={() =>
                  setData((d) => ({
                    ...d,
                    serviceGroupRules: d.serviceGroupRules.filter((_, j) => j !== i),
                  }))
                }
              >
                Remove
              </button>
            </div>
            <label className="cms-label">Group title</label>
            <input
              className="cms-input"
              value={rule.group}
              onChange={(e) => updateRule(i, { group: e.target.value })}
            />
            <label className="cms-label">Slug patterns (one per line)</label>
            <textarea
              className="cms-textarea"
              rows={4}
              value={listToLines(rule.patterns)}
              onChange={(e) => updateRule(i, { patterns: linesToList(e.target.value) })}
              placeholder={"website-development\necommerce"}
            />
          </div>
        ))}
        <button
          type="button"
          className="cms-btn cms-btn-ghost"
          onClick={() =>
            setData((d) => ({
              ...d,
              serviceGroupRules: [...d.serviceGroupRules, { group: "New group", patterns: [] }],
            }))
          }
        >
          + Add grouping rule
        </button>
      </div>
    </WpEditScreen>
  );
}
