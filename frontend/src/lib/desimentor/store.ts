"use client";

import { create } from "zustand";
import { emptyDocument } from "./document-utils";
import type { DesimentorDocument, DesimentorEntityType } from "./types";

export type EditorDevice = "desktop" | "tablet" | "mobile";

type EditorState = {
  entityType: DesimentorEntityType;
  entityId: number;
  entityLabel: string;
  document: DesimentorDocument;
  selectedId: string | null;
  status: "draft" | "published";
  dirty: boolean;
  saving: boolean;
  previewToken: string;
  pendingWidgetType: string | null;
  editorDevice: EditorDevice;
  setMeta: (meta: {
    entityType: DesimentorEntityType;
    entityId: number;
    entityLabel: string;
    previewToken?: string;
  }) => void;
  setDocument: (doc: DesimentorDocument, status?: "draft" | "published") => void;
  select: (id: string | null) => void;
  updateDocument: (doc: DesimentorDocument) => void;
  setStatus: (status: "draft" | "published") => void;
  setSaving: (saving: boolean) => void;
  markSaved: () => void;
  queueWidget: (type: string) => void;
  clearPendingWidget: () => void;
  setEditorDevice: (device: EditorDevice) => void;
};

export const useDesimentorStore = create<EditorState>((set) => ({
  entityType: "page",
  entityId: 0,
  entityLabel: "",
  document: emptyDocument(),
  selectedId: null,
  status: "draft",
  dirty: false,
  saving: false,
  previewToken: "",
  pendingWidgetType: null,
  editorDevice: "desktop",
  setMeta: (meta) =>
    set({
      entityType: meta.entityType,
      entityId: meta.entityId,
      entityLabel: meta.entityLabel,
      previewToken: meta.previewToken ?? "",
    }),
  setDocument: (doc, status = "draft") =>
    set({ document: doc, status, dirty: false, selectedId: null }),
  select: (id) => set({ selectedId: id }),
  updateDocument: (doc) => set({ document: doc, dirty: true }),
  setStatus: (status) => set({ status }),
  setSaving: (saving) => set({ saving }),
  markSaved: () => set({ dirty: false, saving: false }),
  queueWidget: (type) => set({ pendingWidgetType: type }),
  clearPendingWidget: () => set({ pendingWidgetType: null }),
  setEditorDevice: (device) => set({ editorDevice: device }),
}));
