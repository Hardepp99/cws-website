import { CWS_BRAND } from "@/lib/site-brand";
import { getSiteSettings } from "@/lib/wordpress/api";

export async function AdminThemeStyles() {
  let royal: string = CWS_BRAND.royal;
  let blue: string = CWS_BRAND.blue;
  const green = CWS_BRAND.green;
  try {
    const s = await getSiteSettings();
    if (s.primaryColor) royal = s.primaryColor;
    if (s.secondaryColor) blue = s.secondaryColor;
  } catch {
    /* use brand defaults */
  }

  const css = `
    :root {
      --admin-navy: ${CWS_BRAND.navy};
      --admin-royal: ${royal};
      --admin-blue: ${blue};
      --admin-green: ${green};
      --admin-green-dark: ${CWS_BRAND.greenDark};
      --admin-orange: ${CWS_BRAND.orange};
      --admin-ink: ${CWS_BRAND.ink};
      --admin-gradient: linear-gradient(135deg, ${blue} 0%, ${royal} 55%, ${CWS_BRAND.navy} 100%);
      --admin-gradient-green: linear-gradient(90deg, ${CWS_BRAND.greenDark} 0%, ${green} 55%, #00c17a 100%);
      --admin-accent: ${royal};
      --admin-accent-hover: ${CWS_BRAND.navy};
      /* Apple-style admin chrome (sidebar + shell) */
      --admin-mac-bg: #f5f5f7;
      --admin-mac-ink: #1d1d1f;
      --admin-mac-muted: #6e6e73;
      --admin-mac-line: rgba(0, 0, 0, 0.08);
      --admin-sidebar-bg: rgba(255, 255, 255, 0.78);
      --admin-sidebar-active: #1d1d1f;
      --admin-sidebar-hover: rgba(0, 0, 0, 0.05);
      --admin-sidebar-link-hover: #aeaeb2;
      --admin-glass: blur(20px) saturate(180%);
      --admin-ease: cubic-bezier(0.32, 0.72, 0, 1);
    }
  `;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
