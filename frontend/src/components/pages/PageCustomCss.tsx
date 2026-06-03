/** Per-page CSS from admin (scoped under .pro-page). */
export function PageCustomCss({ css }: { css?: string | null }) {
  const trimmed = css?.trim();
  if (!trimmed) return null;
  const scoped = trimmed.includes(".pro-page") ? trimmed : `.pro-page {\n${trimmed}\n}`;
  return <style dangerouslySetInnerHTML={{ __html: scoped }} />;
}
