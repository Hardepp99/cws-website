"use client";

import { useDesimentorStore, type EditorDevice } from "@/lib/desimentor/store";

const DEVICES: { id: EditorDevice; label: string; icon: string }[] = [
  { id: "desktop", label: "Desktop", icon: "fa-desktop" },
  { id: "tablet", label: "Tablet", icon: "fa-tablet-screen-button" },
  { id: "mobile", label: "Mobile", icon: "fa-mobile-screen" },
];

export function DesimentorDeviceSwitcher() {
  const device = useDesimentorStore((s) => s.editorDevice);
  const setDevice = useDesimentorStore((s) => s.setEditorDevice);

  return (
    <div className="desimentor-device-switcher" role="group" aria-label="Preview device">
      {DEVICES.map((d) => (
        <button
          key={d.id}
          type="button"
          className={device === d.id ? "active" : ""}
          title={d.label}
          onClick={() => setDevice(d.id)}
        >
          <i className={`fa-solid ${d.icon}`} aria-hidden="true" />
          <span>{d.label}</span>
        </button>
      ))}
    </div>
  );
}
