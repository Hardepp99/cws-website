"use client";

import { WidgetContent } from "./WidgetContent";
import type { DesimentorWidget } from "@/lib/desimentor/types";

export function DesimentorWidgetView({ widget }: { widget: DesimentorWidget }) {
  return <WidgetContent widget={widget} />;
}
