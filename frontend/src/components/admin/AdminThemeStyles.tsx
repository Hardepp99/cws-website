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
      --admin-sidebar: linear-gradient(180deg, ${CWS_BRAND.navy} 0%, #0d2568 100%);
      --admin-accent: ${royal};
      --admin-accent-hover: ${CWS_BRAND.navy};
    }
  `;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
