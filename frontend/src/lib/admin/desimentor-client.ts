import { adminFetch } from "./client";
import type {
  DesimentorDocument,
  DesimentorDocumentRecord,
  DesimentorEntityType,
  DesimentorTemplate,
} from "@/lib/desimentor/types";

export async function fetchDesimentorDocument(entityType: DesimentorEntityType, entityId: number) {
  return adminFetch<{
    document: DesimentorDocumentRecord | null;
    empty: DesimentorDocument;
    previewToken: string;
  }>(`/desimentor/${entityType}/${entityId}`);
}

export async function saveDesimentorDocument(
  entityType: DesimentorEntityType,
  entityId: number,
  content: DesimentorDocument,
  status: "draft" | "published" = "draft"
) {
  return adminFetch<{ success: boolean; document: DesimentorDocumentRecord }>(
    `/desimentor/${entityType}/${entityId}`,
    { method: "PUT", json: { content, status } }
  );
}

export async function publishDesimentorDocument(entityType: DesimentorEntityType, entityId: number) {
  return adminFetch<{ success: boolean; document: DesimentorDocumentRecord }>(
    `/desimentor/${entityType}/${entityId}/publish`,
    { method: "POST" }
  );
}

export async function listDesimentorTemplates(category = "all") {
  return adminFetch<{ items: DesimentorTemplate[] }>(`/desimentor/templates?category=${category}`);
}

export async function saveDesimentorTemplate(data: {
  name: string;
  slug?: string;
  category: "section" | "page" | "widget";
  content: unknown;
  thumbnailMediaId?: number;
}) {
  return adminFetch<{ success: boolean; template: DesimentorTemplate }>("/desimentor/templates", {
    method: "POST",
    json: data,
  });
}
